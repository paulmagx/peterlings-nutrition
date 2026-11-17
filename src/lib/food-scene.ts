/**
 * 3D-Szene „schwebendes Essen“ (Three.js, WebGL).
 *
 * Alle Modelle (src/lib/food-models.ts) werden im Code erzeugt – keine Modelldateien, keine Texturen
 * von außen, keine Anfragen an Dritte (passt zur CSP in netlify.toml/vercel.json).
 *
 * Wird nur von FoodScene.astro und nur bei Bedarf nachgeladen (dynamischer Import).
 * - „Bewegung reduzieren“: ein ruhiges Standbild, keine Animation.
 * - Unsichtbar (weggescrollt, Tab im Hintergrund): Rendern pausiert.
 */
import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  MathUtils,
  type Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildFood, type Kind } from "./food-models";

export type SceneVariant = "hero" | "cta";

/** [Art, x, y (beides -1…1 relativ zum sichtbaren Bereich), Tiefe z, Größe] */
type Spot = [Kind, number, number, number, number];

// Die Mitte bleibt frei für Überschrift und Buttons.
const layouts: Record<SceneVariant, { wide: Spot[]; narrow: Spot[] }> = {
  hero: {
    wide: [
      ["parsley", -0.8, 0.5, 0.6, 1.7],
      ["tomato", -0.6, -0.5, 1.4, 0.95],
      ["lemon", -0.92, -0.12, -1.2, 1.25],
      ["blueberry", -0.5, 0.78, 0.6, 1],
      ["blueberry", -0.42, 0.68, 0.2, 0.9],
      ["pea", -0.68, 0.06, 2.4, 1],
      ["basil", -0.36, -0.86, -1.6, 1.25],
      ["kiwi", -0.94, -0.82, -0.6, 1.1],
      ["avocado", 0.78, -0.42, 0.6, 1.25],
      ["parsley", 0.86, 0.66, -0.8, 1.5],
      ["lime", 0.6, 0.46, 1.2, 1],
      ["orange", 0.98, 0.08, -2.2, 1.3],
      ["blueberry", 0.52, -0.86, 1.6, 0.95],
      ["carrot", 0.38, 0.86, -1.6, 1.1],
      ["cucumber", 0.96, -0.9, -0.8, 1.15],
      ["pea", 0.66, 0.02, 2.2, 0.9],
      ["tomato", 0.18, 0.95, -5, 0.8],
      ["pea", -0.12, -0.96, -4.5, 1.1],
    ],
    narrow: [
      ["parsley", -0.72, 0.8, 0.4, 1.3],
      ["tomato", 0.7, 0.84, 0.8, 0.75],
      ["blueberry", 0.15, 0.93, 0.2, 0.75],
      ["lemon", -0.98, 0.32, -1.5, 1],
      ["lime", 1.0, 0.36, -1.5, 0.9],
      ["avocado", 0.74, -0.8, 0.6, 0.95],
      ["basil", -0.62, -0.86, 0.4, 1],
      ["pea", -0.1, -0.94, 1.6, 0.9],
      ["kiwi", 1.02, -0.3, -2, 0.9],
      ["carrot", -1.0, -0.36, -2, 0.9],
    ],
  },
  cta: {
    wide: [
      ["parsley", -0.84, 0.36, 0.2, 1.4],
      ["lemon", -0.62, -0.6, 0.8, 1],
      ["blueberry", -0.46, 0.74, 1.2, 0.9],
      ["pea", -0.7, -0.08, 2, 0.9],
      ["tomato", 0.74, 0.5, 0.8, 0.9],
      ["basil", 0.86, -0.5, 0.2, 1.2],
      ["kiwi", 0.5, -0.82, -1, 1],
      ["blueberry", 0.56, 0.84, 1.4, 0.8],
    ],
    narrow: [
      ["parsley", -0.8, 0.84, 0.2, 1.1],
      ["tomato", 0.74, 0.86, 0.6, 0.7],
      ["lemon", 0.78, -0.86, 0.2, 0.85],
      ["blueberry", -0.6, -0.9, 1, 0.8],
    ],
  },
};

/* ───────────────────────── Szene ───────────────────────── */

interface Item {
  obj: Object3D;
  spot: Spot;
  seed: number;
  spin: Vector3;
  base: Vector3;
}

const easeOut = (t: number) => 1 - Math.pow(1 - MathUtils.clamp(t, 0, 1), 3);

export function mountFoodScene(host: HTMLElement, variant: SceneVariant) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return; // Kein WebGL: Die Seite funktioniert ohne Szene genauso.
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "food-scene-canvas";
  host.appendChild(canvas);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.6;
  pmrem.dispose();

  const key = new DirectionalLight("#fff4e0", 1.15);
  key.position.set(-4, 6, 8);
  // Kühles Gegenlicht von hinten gibt Konturen und Glanzkanten.
  const rim = new DirectionalLight("#e4eeff", 1.1);
  rim.position.set(6, 3, -7);
  scene.add(key, rim, new HemisphereLight("#ffffff", "#cddccd", 0.3));

  const CZ = 14;
  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.set(0, 0, CZ);
  // Nebel in der Hintergrundfarbe lässt hintere Teile sanft verblassen (Tiefe).
  scene.fog = new Fog(
    new Color(variant === "hero" ? "#f4f7f3" : "#ffffff"),
    CZ + 1,
    CZ + 15,
  );

  const root = new Group();
  scene.add(root);

  let items: Item[] = [];
  let layoutKey = "";

  let buildToken = 0;
  let start = performance.now();

  /**
   * Baut die Teile nacheinander und gibt dem Browser dazwischen Luft
   * (Texturen werden beim ersten Mal berechnet, das soll nicht ruckeln).
   */
  async function populate(narrow: boolean) {
    const key = narrow ? "narrow" : "wide";
    if (key === layoutKey) return;
    layoutKey = key;
    const token = ++buildToken;
    const next: Item[] = [];
    for (const [i, spot] of layouts[variant][key].entries()) {
      const obj = buildFood(spot[0]);
      obj.scale.setScalar(spot[4]);
      // Feste Startdrehung je Teil (keine Zufallswerte, damit es immer gleich aussieht)
      obj.rotation.set(
        Math.sin(i * 1.7) * 0.6,
        Math.cos(i * 2.3) * 0.8,
        Math.sin(i * 3.1) * 0.5,
      );
      next.push({
        obj,
        spot,
        seed: i * 1.37 + 0.5,
        spin: new Vector3(
          (0.08 + ((i * 7) % 5) * 0.03) * (i % 2 ? 1 : -1),
          0.12 + ((i * 3) % 4) * 0.04,
          0.04 * (i % 3 ? 1 : -1),
        ),
        base: new Vector3(obj.rotation.x, obj.rotation.y, obj.rotation.z),
      });
      await new Promise((r) => setTimeout(r, 0));
      if (token !== buildToken) return;
    }
    root.clear();
    for (const it of next) root.add(it.obj);
    const first = items.length === 0;
    items = next;
    if (first) {
      start = performance.now();
      frame(start);
      requestAnimationFrame(() => canvas.classList.add("is-ready"));
    }
    if (!running) frame(performance.now());
  }

  let width = 1;
  let height = 1;
  function resize() {
    const r = host.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    void populate(camera.aspect < 0.9);
  }

  // Zeiger (leichte Parallaxe) und Scrollen (Teile steigen beim Wegscrollen auf)
  const pointer = new Vector2();
  const pointerSmooth = new Vector2();
  if (!reduced) {
    addEventListener(
      "pointermove",
      (e) => {
        pointer.set(
          (e.clientX / innerWidth) * 2 - 1,
          (e.clientY / innerHeight) * 2 - 1,
        );
      },
      { passive: true },
    );
  }

  const tmp = new Vector3();

  function frame(now: number) {
    const t = reduced ? 0 : (now - start) / 1000;
    const rect = host.getBoundingClientRect();
    const scroll = reduced
      ? 0
      : MathUtils.clamp(-rect.top / Math.max(rect.height, 1), -0.5, 1.2);
    pointerSmooth.lerp(pointer, 0.04);

    const halfH0 = Math.tan(MathUtils.degToRad(camera.fov / 2));
    for (const it of items) {
      const [, nx, ny, z, s] = it.spot;
      const halfH = halfH0 * (CZ - z);
      const halfW = halfH * camera.aspect;
      const depth = MathUtils.clamp((z + 6) / 9, 0.2, 1.2); // vorne bewegt sich mehr

      // Einflug: von außen und aus der Tiefe an den Platz
      const enter = reduced ? 1 : easeOut((t - 0.15 - it.seed * 0.06) / 1.8);
      const out = 1 + (1 - enter) * 0.9;
      tmp.set(
        nx * halfW * out + Math.sin(t * 0.5 + it.seed) * 0.22 * s,
        ny * halfH * out +
          Math.sin(t * 0.7 + it.seed * 2) * 0.28 * s +
          scroll * 6 * depth,
        z - (1 - enter) * 8,
      );
      tmp.x += pointerSmooth.x * 0.5 * depth;
      tmp.y -= pointerSmooth.y * 0.35 * depth;
      it.obj.position.copy(tmp);
      // Die Avocado pendelt nur, damit die Schnittfläche sichtbar bleibt.
      const sway = it.spot[0] === "avocado";
      it.obj.rotation.set(
        sway
          ? Math.sin(t * 0.35 + it.seed) * 0.35 + scroll * 0.6
          : it.base.x + t * it.spin.x + (1 - enter) * 2.5 + scroll * 1.2,
        sway
          ? Math.sin(t * 0.45 + it.seed) * 0.5 - 0.3
          : it.base.y + t * it.spin.y + (1 - enter) * 3,
        it.base.z + Math.sin(t * 0.4 + it.seed) * 0.25 + t * it.spin.z,
      );
    }
    renderer.render(scene, camera);
  }

  // Nur rendern, wenn sichtbar
  let running = false;
  let visible = false;
  let raf = 0;
  const loop = (now: number) => {
    frame(now);
    raf = requestAnimationFrame(loop);
  };
  function update() {
    const shouldRun = visible && !document.hidden && !reduced;
    if (shouldRun && !running) raf = requestAnimationFrame(loop);
    if (!shouldRun && running) cancelAnimationFrame(raf);
    running = shouldRun;
  }

  new ResizeObserver(() => {
    resize();
    if (!running) frame(performance.now());
  }).observe(host);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(host);
  document.addEventListener("visibilitychange", update);

  resize();
}
