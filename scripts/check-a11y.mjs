#!/usr/bin/env node
/**
 * Barrierefreiheits-Prüfung (Issue #30, Ziel WCAG 2.2 AA).
 *
 * Startet wie `check-links.mjs` einen Server, crawlt alle internen Seiten (inkl. 404-Seite)
 * und prüft jede Seite mit axe-core (Tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa)
 * auf 390 px (Handy) und 1280 px (Desktop) Breite, jeweils
 *   1. im Ausgangszustand und
 *   2. „interaktiv“: alle <details> (FAQ) aufgeklappt und alle Zwei-Klick-Boxen geöffnet
 *      (externe Anfragen werden dabei abgefangen und mit einer leeren Seite beantwortet).
 * Zusätzlich (axe prüft das nicht als WCAG-Regel):
 *   - genau eine <h1> je Seite, keine übersprungenen Überschriftenebenen
 *   - jede <nav> hat einen eindeutigen Namen
 *   - kein waagerechtes Scrollen bei 320 px Breite (Reflow, entspricht 1280 px bei 400 % Zoom)
 *
 * Standardmäßig laufen zwei Durchgänge:
 *   - Vorschau (`astro preview`, gebaute Seite aus dist/)
 *   - Dev-Modus (`astro dev`): zeigt /wissen-Entwürfe und – über A11Y_FORMS_PREVIEW=1 –
 *     testweise das Newsletter- und das Kontaktformular, auch wenn sie noch nicht
 *     freigeschaltet sind.
 *
 * Aufruf:
 *   npm run build && npm run check:a11y            # beide Durchgänge
 *   npm run check:a11y -- --preview-only           # nur gebaute Seite
 *   npm run check:a11y -- --dev-only               # nur Dev-Modus
 *   npm run check:a11y -- --url http://localhost:4321   # bereits laufender Server
 *
 * Exit-Code 1 bei Verstößen, 2 bei Fehlern der Prüfung selbst.
 * Playwright steht bewusst nicht in package.json (siehe check-links.mjs).
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { AxeBuilder } from "@axe-core/playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const urlArg = args.includes("--url") ? args[args.indexOf("--url") + 1] : null;
const runPreview = !urlArg && !args.includes("--dev-only");
const runDev = !urlArg && !args.includes("--preview-only");

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const VIEWPORTS = [
  { name: "390px", width: 390, height: 844 },
  { name: "1280px", width: 1280, height: 800 },
];

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

async function waitFor(base, tries = 120) {
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

/** Startet `astro preview` bzw. `astro dev` und liefert { base, stop }. */
function startServer(dev) {
  const port = dev ? 4396 : 4397;
  const server = spawn(
    "npx",
    [
      "astro",
      dev ? "dev" : "preview",
      "--port",
      String(port),
      "--host",
      "localhost",
      // --ignore-lock: im Vordergrund laufen (sonst startet Astro in Agent-Umgebungen
      // einen Hintergrund-Server, der nach der Prüfung weiterläuft).
      "--ignore-lock",
    ],
    {
      cwd: root,
      stdio: "ignore",
      detached: true,
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: "1",
        ...(dev && { A11Y_FORMS_PREVIEW: "1" }),
      },
    },
  );
  server.on("error", (e) => {
    console.error("Server konnte nicht gestartet werden:", e.message);
    process.exit(2);
  });
  const stop = () => {
    if (!server.pid) return;
    try {
      process.kill(-server.pid, "SIGTERM"); // ganze Prozessgruppe
    } catch {
      /* schon beendet */
    }
  };
  process.on("exit", stop);
  return { base: `http://localhost:${port}`, stop };
}

const problems = []; // { run, page, viewport, state, kind, detail }
let checkedPages = 0;

const norm = (u) => {
  const x = new URL(u);
  let p = x.pathname.replace(/\/index\.html$/, "/");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p;
};

/** Externe Anfragen (z. B. Karte nach dem Zwei-Klick) mit einer leeren Seite beantworten. */
async function blockExternal(context, origin) {
  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(origin) || url.startsWith("data:"))
      return route.fallback();
    return route.fulfill({
      status: 200,
      contentType: "text/html",
      body: '<!doctype html><html lang="de"><title>Extern</title><body></body></html>',
    });
  });
}

async function runAxe(page) {
  const result = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .exclude("astro-dev-toolbar")
    .analyze();
  return result.violations;
}

/** Zusätzliche Strukturprüfungen im Browser. */
async function structureChecks(page) {
  return page.evaluate(() => {
    const out = [];
    const visible = (el) => !!el.getClientRects().length;
    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(
      (h) => !h.closest("astro-dev-toolbar"),
    );
    const h1 = headings.filter((h) => h.tagName === "H1");
    if (h1.length !== 1)
      out.push(["Überschriften", `${h1.length} × <h1> statt genau einer`]);
    let prev = 0;
    for (const h of headings) {
      const level = Number(h.tagName[1]);
      if (prev && level > prev + 1)
        out.push([
          "Überschriften",
          `Sprung h${prev} → h${level}: „${h.textContent.trim().slice(0, 50)}“`,
        ]);
      prev = level;
    }
    const navs = [...document.querySelectorAll("nav")].filter(visible);
    const names = navs.map((n) => {
      const by = n.getAttribute("aria-labelledby");
      if (by) return document.getElementById(by)?.textContent.trim() ?? "";
      return n.getAttribute("aria-label") ?? "";
    });
    names.forEach((name, i) => {
      if (!name) out.push(["Landmarks", "<nav> ohne Namen"]);
      else if (names.indexOf(name) !== i)
        out.push(["Landmarks", `<nav>-Name „${name}“ doppelt`]);
    });
    for (const tag of ["main", "header", "footer"]) {
      const n = document.querySelectorAll(`body > ${tag}`).length;
      if (n !== 1)
        out.push(["Landmarks", `${n} × <${tag}> auf oberster Ebene`]);
    }
    return out;
  });
}

async function checkSite(base, label) {
  const origin = new URL(base).origin;
  const browser = await chromium.launch();
  try {
    // 1. Seiten einsammeln (Crawl über interne Links).
    const crawlContext = await browser.newContext();
    const queue = ["/"];
    const seen = new Set();
    while (queue.length) {
      const p = queue.shift();
      if (seen.has(p)) continue;
      seen.add(p);
      const page = await crawlContext.newPage();
      await page.goto(origin + p, { waitUntil: "load" });
      const hrefs = await page.$$eval("a[href]", (as) =>
        as.filter((a) => !a.closest("astro-dev-toolbar")).map((a) => a.href),
      );
      for (const h of hrefs) {
        const u = new URL(h);
        if (u.origin !== origin) continue;
        const np = norm(h);
        if (/\.[a-z0-9]+$/i.test(np) || np === "/404") continue;
        if (!seen.has(np) && !queue.includes(np)) queue.push(np);
      }
      await page.close();
    }
    await crawlContext.close();
    const pages = [...seen].sort();
    pages.push("/__nicht-vorhanden__"); // 404-Seite

    // 2. Jede Seite in beiden Breiten und Zuständen prüfen.
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        locale: "de-DE",
      });
      await blockExternal(context, origin);
      for (const p of pages) {
        const page = await context.newPage();
        await page.goto(origin + p, { waitUntil: "networkidle" });
        const add = (state, kind, detail) =>
          problems.push({
            run: label,
            page: p,
            viewport: vp.name,
            state,
            kind,
            detail,
          });

        for (const v of await runAxe(page))
          add("Start", `axe: ${v.id} (${v.impact})`, describe(v));
        for (const [kind, detail] of await structureChecks(page))
          add("Start", kind, detail);

        // Interaktiver Zustand: FAQ aufklappen, Zwei-Klick-Boxen öffnen.
        const opened = await page.evaluate(() => {
          const details = [...document.querySelectorAll("details")];
          details.forEach((d) => (d.open = true));
          return details.length;
        });
        const consentButtons = page.locator(".consent-embed__button");
        const consentCount = await consentButtons.count();
        for (let i = 0; i < consentCount; i++)
          await consentButtons.first().click();
        if (opened || consentCount) {
          await page.waitForLoadState("networkidle");
          for (const v of await runAxe(page))
            add("interaktiv", `axe: ${v.id} (${v.impact})`, describe(v));
        }
        await page.close();
        checkedPages++;
      }

      // Reflow: 320 px Breite, kein waagerechtes Scrollen.
      if (vp.width < 500) {
        const narrow = await browser.newContext({
          viewport: { width: 320, height: 640 },
        });
        await blockExternal(narrow, origin);
        for (const p of pages) {
          const page = await narrow.newPage();
          await page.goto(origin + p, { waitUntil: "networkidle" });
          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          if (overflow > 0)
            problems.push({
              run: label,
              page: p,
              viewport: "320px",
              state: "Start",
              kind: "Reflow",
              detail: `Seite ist ${overflow}px breiter als das Fenster`,
            });
          await page.close();
        }
        await narrow.close();
      }
      await context.close();
    }
    console.log(`${label}: ${pages.length} Seiten geprüft (${base})`);
  } finally {
    await browser.close();
  }
}

function describe(v) {
  const nodes = v.nodes
    .slice(0, 3)
    .map(
      (n) =>
        `${n.target.join(" ")}${n.failureSummary ? ` – ${n.failureSummary.split("\n").slice(1).join(" ").trim()}` : ""}`,
    );
  const more = v.nodes.length > 3 ? ` (+${v.nodes.length - 3} weitere)` : "";
  return `${v.help}\n      ${nodes.join("\n      ")}${more}`;
}

try {
  if (urlArg) {
    await waitFor(urlArg);
    await checkSite(urlArg, "Server");
  }
  if (runPreview) {
    if (!existsSync(resolve(root, "dist"))) {
      console.error(
        "Kein dist/-Ordner. Bitte zuerst `npm run build` ausführen.",
      );
      process.exit(2);
    }
    const s = startServer(false);
    try {
      await waitFor(s.base);
      await checkSite(s.base, "Vorschau");
    } finally {
      s.stop();
    }
  }
  if (runDev) {
    const s = startServer(true);
    try {
      await waitFor(s.base);
      await checkSite(s.base, "Dev-Modus (Entwürfe, Formulare)");
    } finally {
      s.stop();
    }
  }
} catch (e) {
  console.error("Prüfung abgebrochen:", e);
  process.exit(2);
}

console.log(`Prüfungen insgesamt: ${checkedPages} (Seite × Breite)`);
if (problems.length) {
  console.log(`\n${problems.length} Problem(e) gefunden:`);
  for (const p of problems)
    console.log(
      `  [${p.run} | ${p.viewport} | ${p.state}] ${p.page}: ${p.kind}\n      ${p.detail}`,
    );
  process.exit(1);
}
console.log("\nKeine Barrierefreiheits-Verstöße gefunden.");
