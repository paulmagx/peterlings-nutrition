#!/usr/bin/env node
/**
 * Link- und Attrappen-Prüfung (Issue #16).
 *
 * Startet `astro preview` (oder mit --dev `astro dev`), crawlt alle internen Seiten mit
 * Playwright und meldet:
 *   - interne Links, die nicht mit HTTP 200 antworten (404-Seite ausgenommen)
 *   - Anker (#…), deren ID auf der Zielseite fehlt
 *   - <a> ohne href oder mit href="#", onclick-Attribute
 *   - <button> ohne Funktion (nicht in einem Formular, ohne click-Listener)
 *   - Formulare ohne action und ohne submit-Listener
 *   - mailto:/tel:/http-Links mit TODO-Platzhalter in der Adresse
 * Sichtbare „TODO“-Texte sind gewollt (Platzhalter für Lea); sie werden nur pro Seite gezählt.
 *
 * Aufruf:
 *   npm run build && npm run check:links                  # gebaute Seite (astro preview)
 *   npm run check:links -- --dev                          # Dev-Modus, Entwürfe sichtbar
 *   npm run check:links -- --url http://localhost:4321    # bereits laufender Server
 *
 * Exit-Code 1 bei toten Links oder Attrappen, 2 bei Fehlern der Prüfung selbst.
 * Playwright steht bewusst nicht in package.json (die CI hat keine Browser); es muss lokal
 * auffindbar sein (Projekt-node_modules oder NODE_PATH) und einen Chromium-Browser haben.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const devMode = args.includes("--dev");
const urlArg = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const candidates = [
    "playwright",
    ...(process.env.NODE_PATH ?? "")
      .split(":")
      .filter(Boolean)
      .map((p) => resolve(p, "playwright")),
    "/opt/node-tools/node_modules/playwright",
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* nächsten Kandidaten versuchen */
    }
  }
  console.error(
    "Playwright wurde nicht gefunden. Installiere es (npm i -g playwright && npx playwright install chromium)\n" +
      "und setze ggf. NODE_PATH auf das globale node_modules-Verzeichnis.",
  );
  process.exit(2);
}

const { chromium } = loadPlaywright();

async function waitFor(base, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      await fetch(base);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Server unter ${base} antwortet nicht.`);
}

let server = null;
let base = urlArg;
if (!base) {
  if (!devMode && !existsSync(resolve(root, "dist"))) {
    console.error("Kein dist/-Ordner. Bitte zuerst `npm run build` ausführen.");
    process.exit(2);
  }
  const port = devMode ? 4398 : 4399;
  base = `http://localhost:${port}`;
  server = spawn(
    "npx",
    [
      "astro",
      devMode ? "dev" : "preview",
      "--port",
      String(port),
      "--host",
      "localhost",
      "--ignore-lock", // im Vordergrund laufen, sonst bleibt ein Hintergrund-Server übrig
    ],
    {
      cwd: root,
      stdio: "ignore",
      detached: true,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
    },
  );
  server.on("error", (e) => {
    console.error("Server konnte nicht gestartet werden:", e.message);
    process.exit(2);
  });
}
const stopServer = () => {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, "SIGTERM"); // ganze Prozessgruppe (npx startet Unterprozesse)
  } catch {
    /* schon beendet */
  }
};
process.on("exit", stopServer);

const problems = []; // { kind, page, detail }
const report = (kind, page, detail) => problems.push({ kind, page, detail });
const todoCounts = new Map();
const pageIds = new Map(); // Pfad -> Set(IDs)
const internalLinks = []; // { from, href (absolut), raw }
const externalLinks = new Set();

const norm = (u) => {
  const x = new URL(u);
  let p = x.pathname.replace(/\/index\.html$/, "/");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p;
};
const is404 = (p) => p === "/404" || p === "/404.html";

/** Prüft per DevTools-Protokoll, ob ein Element (oder ein Vorfahre/window) einen Listener des Typs hat. */
async function hasListener(cdp, elementExpr, types) {
  const expr = `(()=>{let n=${elementExpr};const o=[];while(n){o.push(n);n=n.parentNode}o.push(window);return o})()`;
  const { result } = await cdp.send("Runtime.evaluate", { expression: expr });
  const props = await cdp.send("Runtime.getProperties", {
    objectId: result.objectId,
    ownProperties: true,
  });
  for (const p of props.result.filter((x) => /^\d+$/.test(x.name))) {
    const { listeners } = await cdp.send("DOMDebugger.getEventListeners", {
      objectId: p.value.objectId,
    });
    if (listeners.some((x) => types.includes(x.type))) return true;
  }
  return false;
}

try {
  await waitFor(base);
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: base });
  const origin = new URL(base).origin;

  const queue = ["/"];
  const seen = new Set();

  async function visit(path, { allow404 = false } = {}) {
    const page = await context.newPage();
    const res = await page.goto(origin + path, { waitUntil: "networkidle" });
    if (!res || (res.status() !== 200 && !allow404)) {
      report("Seite nicht erreichbar", path, `HTTP ${res?.status()}`);
      await page.close();
      return;
    }
    const cdp = await context.newCDPSession(page);
    const data = await page.evaluate(() => {
      const inToolbar = (el) => !!el.closest("astro-dev-toolbar");
      const links = [...document.querySelectorAll("a")]
        .filter((a) => !inToolbar(a))
        .map((a) => ({
          raw: a.getAttribute("href"),
          abs: a.href,
          text: (a.textContent || "").trim().slice(0, 40),
        }));
      const ids = [
        ...document.querySelectorAll("[id]"),
        ...document.querySelectorAll("a[name]"),
      ].map((e) => e.id || e.getAttribute("name"));
      const onclick = [...document.querySelectorAll("[onclick]")].map(
        (e) =>
          e.tagName.toLowerCase() +
          ": " +
          (e.textContent || "").trim().slice(0, 30),
      );
      const buttons = [...document.querySelectorAll("button")]
        .map((b, index) => ({
          index,
          text: (b.textContent || "").trim().slice(0, 40),
          type: b.getAttribute("type"),
          inForm: !!(b.form || b.closest("form")),
          toolbar: inToolbar(b),
        }))
        .filter((b) => !b.toolbar);
      const forms = [...document.querySelectorAll("form")].map((f, index) => ({
        index,
        action: f.getAttribute("action"),
        id: f.id,
      }));
      const todo = (document.body.innerText.match(/TODO/g) || []).length;
      return { links, ids, onclick, buttons, forms, todo };
    });

    pageIds.set(norm(page.url()), new Set(data.ids));
    if (!allow404) todoCounts.set(path, data.todo);

    for (const o of data.onclick) report("onclick-Attribut", path, o);

    for (const l of data.links) {
      if (l.raw === null) report("<a> ohne href", path, `„${l.text}“`);
      else if (l.raw.trim() === "" || l.raw.trim() === "#")
        report('<a> mit leerem href / href="#"', path, `„${l.text}“`);
      else if (/^(mailto:|tel:)/i.test(l.raw)) {
        if (/TODO/i.test(decodeURIComponent(l.raw)))
          report("Link mit TODO-Platzhalter", path, l.raw);
      } else if (/^javascript:/i.test(l.raw))
        report("javascript:-Link", path, `„${l.text}“`);
      else {
        const u = new URL(l.abs);
        if (u.origin !== origin) {
          externalLinks.add(l.abs);
          if (/TODO/i.test(decodeURIComponent(l.abs)))
            report("Link mit TODO-Platzhalter", path, l.abs);
        } else if (allow404 && u.pathname === path) {
          // Anker auf der 404-Probeseite selbst (z. B. „Zum Inhalt springen“): nicht prüfbar, ignorieren.
        } else {
          internalLinks.push({ from: path, href: l.abs, raw: l.raw });
          const p = norm(l.abs);
          if (!seen.has(p) && !queue.includes(p) && !is404(p)) queue.push(p);
        }
      }
    }

    // Buttons ohne Formular brauchen einen click-Listener (am Button oder an einem Vorfahren).
    for (const b of data.buttons) {
      if (b.inForm && b.type !== "button") continue;
      const el = `document.querySelectorAll('button')[${b.index}]`;
      if (!(await hasListener(cdp, el, ["click", "pointerup", "mouseup"])))
        report(
          "<button> ohne Funktion",
          path,
          `„${b.text}“ (type=${b.type ?? "–"})`,
        );
    }

    // Formulare ohne action brauchen einen submit-Listener.
    for (const f of data.forms) {
      if (f.action) continue;
      const el = `document.querySelectorAll('form')[${f.index}]`;
      if (!(await hasListener(cdp, el, ["submit"])))
        report(
          "Formular ohne action und ohne submit-Listener",
          path,
          f.id || `#${f.index}`,
        );
    }
    await page.close();
  }

  async function drain() {
    while (queue.length) {
      const p = queue.shift();
      if (seen.has(p)) continue;
      seen.add(p);
      await visit(p);
    }
  }
  await drain();
  // 404-Seite: Inhalt prüfen, Status 404 ist erwartet.
  await visit("/__nicht-vorhanden__", { allow404: true });
  await drain();

  // Interne Links: Status und Anker prüfen (je Ziel einmal abgefragt).
  const statusCache = new Map();
  for (const l of internalLinks) {
    const u = new URL(l.href);
    const p = norm(l.href);
    if (is404(p)) continue;
    const key = u.origin + u.pathname;
    if (!statusCache.has(key)) {
      const r = await context.request.get(key);
      statusCache.set(key, r.status());
    }
    if (statusCache.get(key) !== 200)
      report("Toter Link", l.from, `${l.raw} → HTTP ${statusCache.get(key)}`);
    else if (u.hash && u.hash.length > 1) {
      const id = decodeURIComponent(u.hash.slice(1));
      const ids = pageIds.get(p);
      if (!ids) report("Anker nicht prüfbar", l.from, l.raw);
      else if (!ids.has(id))
        report(
          "Anker ohne Ziel",
          l.from,
          `${l.raw} (ID „${id}“ fehlt auf ${p})`,
        );
    }
  }
  await browser.close();
} catch (e) {
  console.error("Prüfung abgebrochen:", e);
  stopServer();
  process.exit(2);
}
stopServer();

// Ausgabe
console.log(`\nPrüfung von ${base} (${devMode ? "Dev-Modus" : "Vorschau"})`);
console.log(
  `Geprüfte Seiten: ${todoCounts.size}, interne Links: ${internalLinks.length}, externe Links: ${externalLinks.size}`,
);
for (const e of externalLinks) console.log(`  extern (nicht abgerufen): ${e}`);
console.log("\nSichtbare TODO-Platzhalter je Seite (gewollt, nur zur Info):");
let total = 0;
for (const [p, n] of [...todoCounts].sort()) {
  total += n;
  console.log(`  ${p.padEnd(40)} ${n}`);
}
console.log(`  ${"Summe".padEnd(40)} ${total}`);

if (problems.length) {
  console.log(`\n${problems.length} Problem(e) gefunden:`);
  for (const p of problems) console.log(`  [${p.kind}] ${p.page}: ${p.detail}`);
  process.exit(1);
}
console.log("\nKeine toten Links und keine Attrappen gefunden.");
