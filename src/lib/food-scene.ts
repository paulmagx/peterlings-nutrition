/**
 * 3D-Szene „schwebendes Essen“ (Three.js, WebGL).
 *
 * Alle Modelle werden hier im Code erzeugt – keine Modelldateien, keine Texturen
 * von außen, keine Anfragen an Dritte (passt zur CSP in netlify.toml/vercel.json).
 *
 * Wird nur von FoodScene.astro und nur bei Bedarf nachgeladen (dynamischer Import).
 * - „Bewegung reduzieren“: ein ruhiges Standbild, keine Animation.
 * - Unsichtbar (weggescrollt, Tab im Hintergrund): Rendern pausiert.
 */
import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
  type Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SplineCurve,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { leafletPoints } from "./parsley";

export type SceneVariant = "hero" | "cta";

/* ───────────────────────── Materialien ───────────────────────── */

const leafGreen = () =>
  new MeshPhysicalMaterial({
    color: "#4d8a3f",
    roughness: 0.42,
    sheen: 0.6,
    sheenColor: new Color("#b9dc8f"),
    sheenRoughness: 0.5,
    clearcoat: 0.25,
    clearcoatRoughness: 0.4,
    side: DoubleSide,
  });

const glossy = (color: string, roughness = 0.32) =>
  new MeshPhysicalMaterial({
    color,
    roughness,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
  });

/* ───────────────────────── Hilfsfunktionen ───────────────────────── */

/** Biegt eine flache Blatt-Geometrie leicht (Längs- und Querwölbung). */
function bend(geo: BufferGeometry, along: number, across: number) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + along * y * y + across * x * x);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function mirroredShape(right: [number, number][], scale: number) {
  const pts = [
    ...right,
    ...right
      .slice(0, -1)
      .reverse()
      .map(([x, y]) => [-x, y] as [number, number]),
  ].map(([x, y]) => new Vector2(x * scale, -y * scale));
  const shape = new Shape();
  shape.moveTo(pts[0].x, pts[0].y);
  shape.splineThru(pts.slice(1));
  return shape;
}

const thinLeaf = {
  depth: 0.012,
  bevelEnabled: true,
  bevelThickness: 0.012,
  bevelSize: 0.01,
  bevelSegments: 2,
  curveSegments: 10,
};

/* ───────────────────────── Modelle ───────────────────────── */

/** Petersilienzweig: drei Teilblätter an einem Stiel – wie das Logo, nur in 3D. */
function parsley(): Object3D {
  const g = new Group();
  const mat = leafGreen();
  const leaflet = bend(
    new ExtrudeGeometry(mirroredShape(leafletPoints, 1 / 11.6), thinLeaf),
    0.12,
    0.35,
  );
  const parts: [number, number, number, number, number][] = [
    // x, y, Drehung, Größe, Neigung
    [0.05, 0.05, 0.14, 0.92, 0.25],
    [-0.04, -0.06, -0.98, 0.74, -0.35],
    [0.06, -0.08, 1.19, 0.68, 0.4],
  ];
  for (const [x, y, rot, s, tilt] of parts) {
    const m = new Mesh(leaflet, mat);
    m.position.set(x, y, 0);
    m.rotation.set(tilt * 0.6, tilt, -rot);
    m.scale.setScalar(s);
    g.add(m);
  }
  const stem = new CatmullRomCurve3([
    new Vector3(0.04, 0.0, 0),
    new Vector3(0.03, -0.35, 0.04),
    new Vector3(-0.08, -0.7, 0.02),
    new Vector3(-0.28, -1.0, -0.05),
  ]);
  g.add(new Mesh(new TubeGeometry(stem, 24, 0.022, 8), mat));
  g.position.y = 0.3;
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/** Basilikumblatt: glatt, gewölbt, mit Mittelrippe. */
function basil(): Object3D {
  const g = new Group();
  const mat = leafGreen();
  (mat as MeshPhysicalMaterial).color.set("#3f7f38");
  const outline: [number, number][] = [
    [0, 0],
    [0.22, -0.12],
    [0.38, -0.38],
    [0.4, -0.7],
    [0.3, -0.98],
    [0.14, -1.18],
    [0, -1.3],
  ];
  const leaf = bend(
    new ExtrudeGeometry(mirroredShape(outline, 1), thinLeaf),
    0.05,
    0.9,
  );
  g.add(new Mesh(leaf, mat));
  const rib = new CatmullRomCurve3([
    new Vector3(0, -0.25, 0.0),
    new Vector3(0, 0.1, 0.06),
    new Vector3(0, 0.6, 0.06),
    new Vector3(0, 1.15, 0.02),
  ]);
  const ribMat = new MeshStandardMaterial({ color: "#6fa25a", roughness: 0.5 });
  g.add(new Mesh(new TubeGeometry(rib, 20, 0.014, 6), ribMat));
  g.position.y = -0.5;
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/** Kirschtomate mit Kelch. */
function tomato(): Object3D {
  const g = new Group();
  const body = new Mesh(
    new SphereGeometry(0.5, 48, 32),
    glossy("#d94a32", 0.28),
  );
  body.scale.set(1, 0.86, 1);
  g.add(body);
  const star: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const r = i % 2 === 0 ? 0.2 : 0.06;
    star.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const shape = new Shape(star.map(([x, y]) => new Vector2(x, y)));
  const calyx = new Mesh(
    bend(
      new ExtrudeGeometry(shape, { ...thinLeaf, curveSegments: 2 }),
      -1.6,
      -1.6,
    ),
    new MeshStandardMaterial({
      color: "#4f7d3a",
      roughness: 0.6,
      side: DoubleSide,
    }),
  );
  calyx.rotation.x = -Math.PI / 2;
  calyx.position.y = 0.425;
  g.add(calyx);
  const stalk = new Mesh(
    new CylinderGeometry(0.025, 0.035, 0.16, 8),
    new MeshStandardMaterial({ color: "#5b8a43", roughness: 0.6 }),
  );
  stalk.position.y = 0.5;
  stalk.rotation.z = 0.2;
  g.add(stalk);
  return g;
}

/** Blaubeere mit „Krönchen“ und matter Wachsschicht. */
function blueberry(): Object3D {
  const g = new Group();
  const mat = new MeshPhysicalMaterial({
    color: "#2b3463",
    roughness: 0.55,
    sheen: 1,
    sheenColor: new Color("#9fb0d8"),
    sheenRoughness: 0.6,
  });
  const body = new Mesh(new SphereGeometry(0.3, 40, 24), mat);
  body.scale.set(1, 0.84, 1);
  g.add(body);
  const crown = new Mesh(
    new TorusGeometry(0.075, 0.025, 8, 20),
    new MeshStandardMaterial({ color: "#232a45", roughness: 0.8 }),
  );
  crown.rotation.x = Math.PI / 2;
  crown.position.y = 0.245;
  g.add(crown);
  return g;
}

function pea(): Object3D {
  return new Mesh(new SphereGeometry(0.17, 28, 18), glossy("#86b94d", 0.42));
}

/** Textur für Scheiben (Zitrus, Gurke, Karotte, Kiwi) – auf einer Canvas gezeichnet. */
function sliceTexture(
  kind: "citrus" | "cucumber" | "carrot" | "kiwi",
  pulp: string,
  rind: string,
) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const cx = size / 2;
  ctx.fillStyle = rind;
  ctx.beginPath();
  ctx.arc(cx, cx, cx, 0, Math.PI * 2);
  ctx.fill();

  if (kind === "citrus") {
    ctx.fillStyle = "#fbf6e4"; // weiße Haut
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.9, 0, Math.PI * 2);
    ctx.fill();
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2 + 0.06;
      const a1 = ((i + 1) / n) * Math.PI * 2 - 0.06;
      const grad = ctx.createRadialGradient(
        cx,
        cx,
        cx * 0.1,
        cx,
        cx,
        cx * 0.84,
      );
      grad.addColorStop(0, "#fff8dc");
      grad.addColorStop(0.35, pulp);
      grad.addColorStop(1, pulp);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos((a0 + a1) / 2) * cx * 0.1,
        cx + Math.sin((a0 + a1) / 2) * cx * 0.1,
      );
      ctx.arc(cx, cx, cx * 0.84, a0, a1);
      ctx.closePath();
      ctx.fill();
    }
    // Fruchtfleisch-Bläschen
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = cx * (0.2 + Math.random() * 0.6);
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(a) * r,
        cx + Math.sin(a) * r,
        9,
        4,
        a,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (kind === "cucumber" || kind === "kiwi") {
    const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.94);
    grad.addColorStop(0, kind === "kiwi" ? "#f4f1d6" : "#eef3cf");
    grad.addColorStop(kind === "kiwi" ? 0.28 : 0.45, pulp);
    grad.addColorStop(1, pulp);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.94, 0, Math.PI * 2);
    ctx.fill();
    const seeds = kind === "kiwi" ? 46 : 9;
    for (let ring = 0; ring < (kind === "kiwi" ? 2 : 1); ring++) {
      for (let i = 0; i < seeds; i++) {
        const a = (i / seeds) * Math.PI * 2 + ring * 0.07;
        const r = cx * (kind === "kiwi" ? 0.36 + ring * 0.06 : 0.3);
        ctx.fillStyle = kind === "kiwi" ? "#1f1a14" : "#f6f7e2";
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(a) * r,
          cx + Math.sin(a) * r,
          kind === "kiwi" ? 7 : 12,
          kind === "kiwi" ? 4 : 6,
          a,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
    if (kind === "kiwi") {
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * cx * 0.3, cx + Math.sin(a) * cx * 0.3);
        ctx.lineTo(cx + Math.cos(a) * cx * 0.9, cx + Math.sin(a) * cx * 0.9);
        ctx.stroke();
      }
    }
  } else {
    // Karotte: Ringe, hellerer Kern
    const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.95);
    grad.addColorStop(0, "#f8b45f");
    grad.addColorStop(0.42, "#f6a24a");
    grad.addColorStop(0.46, "#e9852c");
    grad.addColorStop(1, pulp);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.95, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function slice(
  kind: "lemon" | "lime" | "orange" | "cucumber" | "carrot" | "kiwi",
): Object3D {
  const conf = {
    lemon: ["citrus", "#f4d34f", "#efc23a", 0.62, 0.11],
    lime: ["citrus", "#b5d35b", "#5f9a2e", 0.52, 0.1],
    orange: ["citrus", "#f6a03e", "#ec8a22", 0.66, 0.11],
    cucumber: ["cucumber", "#c7dc96", "#36602a", 0.46, 0.1],
    carrot: ["carrot", "#ec8a30", "#df7420", 0.34, 0.12],
    kiwi: ["kiwi", "#7fae35", "#7b6040", 0.5, 0.1],
  } as const;
  const [tex, pulp, rind, r, h] = conf[kind];
  const face = new MeshPhysicalMaterial({
    map: sliceTexture(tex, pulp, rind),
    roughness: 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    transmission: 0,
  });
  const side = new MeshStandardMaterial({ color: rind, roughness: 0.5 });
  const m = new Mesh(new CylinderGeometry(r, r, h, 64, 1), [
    side,
    face,
    face,
  ] as Material[]);
  m.rotation.x = Math.PI / 2;
  const g = new Group();
  g.add(m);
  return g;
}

/** Avocado-Hälfte: Schale (halber Drehkörper), Schnittfläche mit Farbverlauf, Kern. */
function avocado(): Object3D {
  const g = new Group();
  const profile = new SplineCurve(
    [
      [0.001, -1.0],
      [0.38, -0.92],
      [0.56, -0.7],
      [0.62, -0.4],
      [0.58, -0.1],
      [0.48, 0.25],
      [0.39, 0.55],
      [0.29, 0.82],
      [0.001, 1.0],
    ].map(([x, y]) => new Vector2(x, y)),
  ).getPoints(48);

  const skin = new Mesh(
    new LatheGeometry(profile, 48, 0, Math.PI),
    new MeshPhysicalMaterial({
      color: "#2f4a22",
      roughness: 0.75,
      sheen: 0.4,
      sheenColor: new Color("#5d7a3b"),
      side: DoubleSide,
    }),
  );
  g.add(skin);

  const outline = (k: number) => {
    const s = new Shape();
    const pts = [
      ...profile,
      ...profile
        .slice(0, -1)
        .reverse()
        .map((p) => new Vector2(-p.x, p.y)),
    ];
    s.moveTo(pts[0].x * k, pts[0].y * k);
    for (const p of pts.slice(1)) s.lineTo(p.x * k, p.y * k);
    return s;
  };
  const layers: [number, string, number][] = [
    [1, "#6f9a35", 0],
    [0.95, "#b6cc5a", 0.004],
    [0.86, "#dfe39a", 0.008],
  ];
  for (const [k, color, off] of layers) {
    const cap = new Mesh(
      new ShapeGeometry(outline(k), 1),
      new MeshPhysicalMaterial({
        color,
        roughness: 0.45,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
      }),
    );
    cap.geometry.rotateY(-Math.PI / 2);
    cap.position.set(-off, -0.04 * (1 - k) * 10, 0);
    g.add(cap);
  }
  const pit = new Mesh(
    new SphereGeometry(0.29, 40, 24, -Math.PI / 2, Math.PI),
    glossy("#8a5634", 0.4),
  );
  pit.position.set(-0.012, -0.36, 0);
  g.add(pit);

  g.rotation.y = Math.PI / 2; // Schnittfläche zur Kamera
  g.scale.setScalar(0.85);
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/* ───────────────────────── Anordnung ───────────────────────── */

type Kind =
  | "parsley"
  | "basil"
  | "tomato"
  | "blueberry"
  | "pea"
  | "lemon"
  | "lime"
  | "orange"
  | "cucumber"
  | "carrot"
  | "kiwi"
  | "avocado";

/** [Art, x, y (beides -1…1 relativ zum sichtbaren Bereich), Tiefe z, Größe] */
type Spot = [Kind, number, number, number, number];

const build: Record<Kind, () => Object3D> = {
  parsley,
  basil,
  tomato,
  blueberry,
  pea,
  lemon: () => slice("lemon"),
  lime: () => slice("lime"),
  orange: () => slice("orange"),
  cucumber: () => slice("cucumber"),
  carrot: () => slice("carrot"),
  kiwi: () => slice("kiwi"),
  avocado,
};

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
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "food-scene-canvas";
  host.appendChild(canvas);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  pmrem.dispose();

  const key = new DirectionalLight("#fff4e0", 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key, new HemisphereLight("#ffffff", "#cddccd", 0.6));

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

  function populate(narrow: boolean) {
    const key = narrow ? "narrow" : "wide";
    if (key === layoutKey) return;
    layoutKey = key;
    root.clear();
    items = layouts[variant][key].map((spot, i) => {
      const obj = build[spot[0]]();
      obj.scale.setScalar(spot[4]);
      // Feste Startdrehung je Teil (keine Zufallswerte, damit es immer gleich aussieht)
      obj.rotation.set(
        Math.sin(i * 1.7) * 0.6,
        Math.cos(i * 2.3) * 0.8,
        Math.sin(i * 3.1) * 0.5,
      );
      root.add(obj);
      return {
        obj,
        spot,
        seed: i * 1.37 + 0.5,
        spin: new Vector3(
          (0.08 + ((i * 7) % 5) * 0.03) * (i % 2 ? 1 : -1),
          0.12 + ((i * 3) % 4) * 0.04,
          0.04 * (i % 3 ? 1 : -1),
        ),
        base: new Vector3(obj.rotation.x, obj.rotation.y, obj.rotation.z),
      };
    });
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
    populate(camera.aspect < 0.9);
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
  const start = performance.now();

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
  frame(performance.now());
  requestAnimationFrame(() => canvas.classList.add("is-ready"));
}
