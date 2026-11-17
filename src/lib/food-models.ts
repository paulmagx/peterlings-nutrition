/**
 * Prozedurale, möglichst naturgetreue Lebensmittel-Modelle für die 3D-Szene.
 *
 * Alles entsteht im Browser: Formen aus Three.js-Geometrien, Oberflächen aus
 * selbst berechneten Texturen (Rauschen, Poren, Adern, Fruchtfleisch-Bläschen)
 * plus Normal-Maps für das Relief. Keine Dateien, keine Anfragen nach außen.
 *
 * Texturen werden pro Sorte einmal erzeugt und dann geteilt (Cache).
 */
import {
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  type Object3D,
  PlaneGeometry,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SplineCurve,
  SRGBColorSpace,
  type Texture,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";
import { leafletPath } from "./parsley";

export type Kind =
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

/* ───────────────────────── Rauschen ───────────────────────── */

type RGB = [number, number, number];

function hash(x: number, y: number, s: number) {
  let h =
    Math.imul(x, 374761393) ^
    Math.imul(y, 668265263) ^
    Math.imul(s, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Wertrauschen, in x mit Periode px kachelbar (für Kugel-Texturen ohne Naht). */
function noise(x: number, y: number, px: number, s: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const wx = (n: number) => ((n % px) + px) % px;
  const a = hash(wx(xi), yi, s);
  const b = hash(wx(xi + 1), yi, s);
  const c = hash(wx(xi), yi + 1, s);
  const d = hash(wx(xi + 1), yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, px: number, octaves: number, s: number) {
  let amp = 0.5;
  let f = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * f, y * f, px * f, s + i * 17);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* ───────────────────────── Texturen ───────────────────────── */

interface Surface {
  map: CanvasTexture;
  normalMap: CanvasTexture;
}

function newCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/**
 * Berechnet Farbe und Höhe pro Pixel. u, v laufen von 0 bis 1 (v = 0 oben im Bild).
 * fn schreibt Farbe in col (0–255) und gibt die Höhe (0–1) zurück.
 */
function paint(
  w: number,
  h: number,
  fn: (u: number, v: number, col: RGB) => number,
) {
  const color = newCanvas(w, h);
  const ctx = color.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const height = new Float32Array(w * h);
  const col: RGB = [0, 0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      height[i] = fn((x + 0.5) / w, (y + 0.5) / h, col);
      img.data[i * 4] = col[0];
      img.data[i * 4 + 1] = col[1];
      img.data[i * 4 + 2] = col[2];
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { color, height, ctx };
}

/** Normal-Map aus einem Höhenfeld (Sobel), wiederholend am Rand. */
function normalsFrom(
  height: Float32Array,
  w: number,
  h: number,
  strength: number,
) {
  const c = newCanvas(w, h);
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const at = (x: number, y: number) =>
    height[((y + h) % h) * w + ((x + w) % w)];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      img.data[i] = (-dx / len) * 127.5 + 127.5;
      img.data[i + 1] = (-dy / len) * 127.5 + 127.5;
      img.data[i + 2] = (1 / len) * 127.5 + 127.5;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function toTexture(c: HTMLCanvasElement, srgb: boolean) {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.wrapS = RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function surface(
  w: number,
  h: number,
  strength: number,
  fn: (u: number, v: number, col: RGB) => number,
  decorate?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): Surface {
  const { color, height, ctx } = paint(w, h, fn);
  decorate?.(ctx, w, h);
  return {
    map: toTexture(color, true),
    normalMap: toTexture(normalsFrom(height, w, h, strength), false),
  };
}

const cache = new Map<string, Surface>();
function cached(key: string, make: () => Surface) {
  let s = cache.get(key);
  if (!s) {
    s = make();
    cache.set(key, s);
  }
  return s;
}

/* ───────────────────────── Materialien ───────────────────────── */

function physical(
  s: Surface,
  opts: ConstructorParameters<typeof MeshPhysicalMaterial>[0] = {},
) {
  return new MeshPhysicalMaterial({
    map: s.map,
    normalMap: s.normalMap,
    ...opts,
  });
}

const MathClamp = (x: number) => Math.min(1, Math.max(-1, x));

/** Kugel mit Verformung in Richtung der Oberflächennormale. */
function deformedSphere(
  r: number,
  ws: number,
  hs: number,
  shape: (dir: Vector3, theta: number, phi: number) => number,
) {
  const geo = new SphereGeometry(r, ws, hs);
  const pos = geo.attributes.position;
  const dir = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    dir.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
    const theta = Math.acos(MathClamp(dir.y));
    const phi = Math.atan2(dir.z, dir.x);
    const k = shape(dir, theta, phi);
    pos.setXYZ(i, dir.x * r * k, dir.y * r * k, dir.z * r * k);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ───────────────────────── Tomate ───────────────────────── */

function tomatoSurface() {
  return cached("tomato", () =>
    surface(512, 256, 1.6, (u, v, col) => {
      const theta = v * Math.PI;
      const n = fbm(u * 8, v * 4, 8, 4, 3);
      let c = mix([200, 40, 24], [160, 24, 16], smooth(0.3, 0.75, n));
      // Schultern um den Stielansatz: orange-gelbliche Streifen
      const shoulder =
        Math.pow(clamp01(1 - theta / 0.75), 2) *
        (0.55 + 0.45 * Math.cos(u * Math.PI * 2 * 5 + n * 2));
      c = mix(c, [226, 118, 44], shoulder * 0.75);
      // Stielnarbe
      c = mix(c, [128, 116, 54], smooth(0.09, 0.04, theta));
      // feine helle Punkte unter der Haut
      const dots = fbm(u * 90, v * 45, 90, 2, 9);
      c = mix(c, [236, 120, 90], smooth(0.72, 0.82, dots) * 0.35);
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return (
        fbm(u * 40, v * 20, 40, 3, 5) * 0.4 + smooth(0.12, 0.0, theta) * 0.4
      );
    }),
  );
}

function tomato(): Object3D {
  const g = new Group();
  const body = new Mesh(
    deformedSphere(0.5, 72, 54, (_dir, theta, phi) => {
      const lobes = 0.03 * Math.cos(5 * phi) * Math.sin(theta) ** 2;
      const dimple = -0.09 * Math.exp(-(theta * theta) / 0.04);
      const bottom = -0.03 * Math.exp(-((Math.PI - theta) ** 2) / 0.1);
      return 1 + lobes + dimple + bottom;
    }),
    physical(tomatoSurface(), {
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      normalScale: new Vector2(0.35, 0.35),
      sheen: 0.2,
      sheenColor: new Color("#ff9a7a"),
    }),
  );
  body.scale.set(1, 0.84, 1);
  g.add(body);

  // Kelch: fünf schmale, gebogene Kelchblätter und ein Stielchen
  const sepal = leafGeometry(0.07, 0.3, 6, 14, 0.9, -1.2, 0, true);
  const sepalMat = new MeshPhysicalMaterial({
    color: "#3d6b28",
    roughness: 0.62,
    sheen: 0.8,
    sheenColor: new Color("#a8cf86"),
    side: DoubleSide,
  });
  for (let i = 0; i < 5; i++) {
    const m = new Mesh(sepal, sepalMat);
    m.position.y = 0.37;
    m.rotation.order = "YXZ";
    m.rotation.y = (i / 5) * Math.PI * 2 + 0.3;
    m.rotation.x = -Math.PI / 2 + 0.35 + (i % 2) * 0.25;
    g.add(m);
  }
  const stalk = new Mesh(
    new TubeGeometry(
      new CatmullRomCurve3([
        new Vector3(0, 0.34, 0),
        new Vector3(0.01, 0.44, 0),
        new Vector3(0.05, 0.52, 0.01),
      ]),
      10,
      0.024,
      8,
    ),
    sepalMat,
  );
  g.add(stalk);
  return g;
}

/* ───────────────────────── Blaubeere ───────────────────────── */

function blueberrySurface() {
  return cached("blueberry", () =>
    surface(512, 256, 1.2, (u, v, col) => {
      const n = fbm(u * 10, v * 5, 10, 5, 21);
      const bloom = smooth(0.38, 0.72, n);
      let c = mix([30, 34, 70], [120, 134, 184], bloom * 0.7);
      c = mix(
        c,
        [18, 20, 44],
        smooth(0.5, 0.0, fbm(u * 4, v * 2, 4, 3, 22)) * 0.4,
      );
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return fbm(u * 30, v * 15, 30, 3, 23) * 0.5;
    }),
  );
}

function blueberry(): Object3D {
  const g = new Group();
  const body = new Mesh(
    deformedSphere(0.3, 56, 40, (_dir, theta, phi) => {
      const crater = -0.16 * Math.exp(-(theta * theta) / 0.035);
      return 1 + crater + 0.02 * Math.sin(phi * 3 + theta * 2);
    }),
    physical(blueberrySurface(), {
      roughness: 0.62,
      sheen: 1,
      sheenColor: new Color("#b9c6ea"),
      sheenRoughness: 0.55,
      normalScale: new Vector2(0.4, 0.4),
    }),
  );
  body.scale.set(1, 0.86, 1);
  g.add(body);
  // Krönchen: fünf kleine Zipfel um eine dunkle Mulde
  const dark = new MeshPhysicalMaterial({
    color: "#3a3550",
    roughness: 0.85,
    side: DoubleSide,
  });
  const hole = new Mesh(new CircleGeometry(0.04, 20), dark);
  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 0.205;
  g.add(hole);
  const tip = leafGeometry(0.03, 0.045, 3, 4, 0, 0.4, 0, true);
  for (let i = 0; i < 5; i++) {
    const m = new Mesh(tip, dark);
    m.position.y = 0.198;
    m.rotation.order = "YXZ";
    m.rotation.y = (i / 5) * Math.PI * 2;
    m.rotation.x = -0.5;
    m.translateY(0.03);
    g.add(m);
  }
  return g;
}

/* ───────────────────────── Erbse ───────────────────────── */

function peaSurface() {
  return cached("pea", () =>
    surface(256, 128, 2.2, (u, v, col) => {
      const n = fbm(u * 6, v * 3, 6, 4, 31);
      const c = mix([104, 160, 54], [156, 200, 92], n);
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return fbm(u * 14, v * 7, 14, 3, 32);
    }),
  );
}

function pea(): Object3D {
  return new Mesh(
    deformedSphere(
      0.17,
      40,
      28,
      (dir) => 1 + 0.02 * Math.sin(dir.x * 7 + dir.y * 5),
    ),
    physical(peaSurface(), {
      roughness: 0.32,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      normalScale: new Vector2(0.5, 0.5),
    }),
  );
}

/* ───────────────────────── Scheiben ───────────────────────── */

type SliceKind = "lemon" | "lime" | "orange" | "cucumber" | "carrot" | "kiwi";

interface Citrus {
  pulp: RGB;
  pulpLight: RGB;
  rind: RGB;
  pith: RGB;
  segments: number;
}

const citrus: Record<"lemon" | "lime" | "orange", Citrus> = {
  lemon: {
    pulp: [226, 176, 20],
    pulpLight: [246, 214, 92],
    rind: [226, 178, 18],
    pith: [250, 244, 214],
    segments: 9,
  },
  lime: {
    pulp: [128, 172, 44],
    pulpLight: [184, 214, 104],
    rind: [58, 112, 30],
    pith: [236, 242, 206],
    segments: 10,
  },
  orange: {
    pulp: [232, 112, 18],
    pulpLight: [248, 164, 70],
    rind: [232, 116, 22],
    pith: [252, 236, 206],
    segments: 10,
  },
};

const TAU = Math.PI * 2;

function sliceSurface(kind: SliceKind) {
  return cached(`slice-${kind}`, () => {
    const size = 512;
    const polar = (u: number, v: number) => {
      const x = u * 2 - 1;
      const y = v * 2 - 1;
      return [Math.hypot(x, y), (Math.atan2(y, x) + TAU) % TAU] as const;
    };

    if (kind === "lemon" || kind === "lime" || kind === "orange") {
      const c = citrus[kind];
      const seg = TAU / c.segments;
      return surface(size, size, 5, (u, v, col) => {
        const [r, a] = polar(u, v);
        let out: RGB;
        let h: number;
        if (r > 0.94) {
          const pores = fbm(u * 120, v * 120, 1e6, 2, 41);
          out = mix(
            c.rind,
            mix(c.rind, [0, 0, 0], 0.25),
            smooth(0.6, 0.85, pores),
          );
          out = mix(out, [255, 255, 255], smooth(0.97, 1, r) * 0.15);
          h = 0.8 - smooth(0.6, 0.85, pores) * 0.2;
        } else if (r > 0.85) {
          const fib = fbm(r * 40, (a / TAU) * 400, 400, 2, 42);
          out = mix(
            c.pith,
            c.pulpLight,
            smooth(0.88, 0.85, r) * 0.4 + fib * 0.08,
          );
          h = 0.9;
        } else {
          const local = a % seg;
          const toEdge = r * Math.sin(Math.min(local, seg - local));
          const membrane = smooth(0.016, 0.004, toEdge) + smooth(0.84, 0.86, r);
          const core = smooth(0.09, 0.05, r);
          // Saftbläschen: radial gestreckte Zellen
          const ves = fbm(r * 9, (a / TAU) * 180, 180, 3, 43);
          const cell = Math.abs(Math.sin(ves * 22));
          out = mix(c.pulp, c.pulpLight, smooth(0.15, 0.9, cell) * 0.75);
          out = mix(
            out,
            mix(c.pulp, [0, 0, 0], 0.12),
            smooth(0.4, 0.0, r) * 0.0 + smooth(0.6, 0.2, cell) * 0.2,
          );
          out = mix(out, c.pith, clamp01(membrane) * 0.6);
          out = mix(out, c.pith, core);
          h = 0.35 + cell * 0.25 + clamp01(membrane) * 0.45 + core * 0.4;
        }
        col[0] = out[0];
        col[1] = out[1];
        col[2] = out[2];
        return h;
      });
    }

    if (kind === "kiwi") {
      return surface(
        size,
        size,
        4,
        (u, v, col) => {
          const [r, a] = polar(u, v);
          const streak = fbm(r * 5, (a / TAU) * 220, 220, 3, 51);
          let out: RGB;
          let h = 0.5 + streak * 0.2;
          if (r > 0.955) {
            out = mix(
              [120, 92, 52],
              [92, 68, 38],
              fbm(u * 200, v * 200, 1e6, 2, 52),
            );
            h = 0.7;
          } else {
            const coreR = 0.2 * (1 + 0.12 * Math.sin(a * 6 + streak * 3));
            out = mix([150, 192, 64], [94, 150, 36], smooth(0.25, 0.9, r));
            out = mix(out, [196, 220, 120], smooth(0.5, 0.95, streak) * 0.35);
            out = mix(
              out,
              [238, 234, 198],
              smooth(coreR + 0.03, coreR - 0.02, r),
            );
            out = mix(
              out,
              [222, 226, 160],
              smooth(coreR + 0.12, coreR, r) * 0.35,
            );
          }
          col[0] = out[0];
          col[1] = out[1];
          col[2] = out[2];
          return h;
        },
        (ctx, w) => {
          // Kerne: kleine schwarze Tropfen im Ring um das Herz
          const rand = rng(7);
          for (let i = 0; i < 140; i++) {
            const a = rand() * TAU;
            const r = (0.25 + rand() * 0.12) * (w / 2);
            ctx.save();
            ctx.translate(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r);
            ctx.rotate(a);
            ctx.fillStyle = rand() > 0.3 ? "#16120c" : "#2b2214";
            ctx.beginPath();
            ctx.ellipse(0, 0, 6 + rand() * 3, 2.6 + rand(), 0, 0, TAU);
            ctx.fill();
            ctx.restore();
          }
        },
      );
    }

    if (kind === "cucumber") {
      return surface(
        size,
        size,
        3,
        (u, v, col) => {
          const [r, a] = polar(u, v);
          const lobe = 0.42 * (1 + 0.16 * Math.cos(3 * a));
          let out: RGB;
          let h = 0.5;
          if (r > 0.955) {
            const stripe =
              0.5 +
              0.5 *
                Math.sin(a * 14 + fbm(r * 4, (a / TAU) * 30, 30, 2, 61) * 4);
            out = mix([34, 66, 26], [70, 108, 46], stripe * 0.6);
            h = 0.7;
          } else if (r > 0.9) {
            out = mix([96, 150, 60], [178, 210, 132], smooth(0.955, 0.9, r));
          } else {
            const n = fbm(u * 30, v * 30, 1e6, 3, 62);
            out = mix([176, 210, 128], [160, 198, 110], n);
            out = mix(
              out,
              [176, 206, 134],
              smooth(lobe + 0.04, lobe - 0.02, r) * 0.8,
            );
            h = 0.5 - smooth(lobe + 0.04, lobe - 0.02, r) * 0.2 + n * 0.1;
          }
          col[0] = out[0];
          col[1] = out[1];
          col[2] = out[2];
          return h;
        },
        (ctx, w) => {
          // Kerne entlang der drei Kammern
          ctx.fillStyle = "rgba(248, 250, 228, 0.9)";
          for (let k = 0; k < 3; k++) {
            const a0 = (k / 3) * TAU;
            for (let j = -2; j <= 2; j++) {
              const a = a0 + j * 0.22;
              const r = (0.28 + Math.abs(j) * 0.015) * (w / 2);
              ctx.save();
              ctx.translate(w / 2 + Math.cos(a) * r, w / 2 + Math.sin(a) * r);
              ctx.rotate(a + Math.PI / 2);
              ctx.beginPath();
              ctx.ellipse(0, 0, 13, 6, 0, 0, TAU);
              ctx.fill();
              ctx.restore();
            }
          }
        },
      );
    }

    // Karotte
    return surface(size, size, 3, (u, v, col) => {
      const [r, a] = polar(u, v);
      const rays = fbm(r * 4, (a / TAU) * 160, 160, 3, 71);
      let out: RGB;
      if (r > 0.965) out = [196, 86, 24];
      else if (r > 0.5) out = mix([226, 98, 16], [240, 124, 32], rays);
      else
        out = mix(
          [248, 164, 70],
          [252, 190, 104],
          rays * 0.8 + smooth(0.2, 0, r) * 0.3,
        );
      out = mix(out, [252, 196, 120], smooth(0.02, 0, Math.abs(r - 0.5)) * 0.6);
      col[0] = out[0];
      col[1] = out[1];
      col[2] = out[2];
      return 0.5 + rays * 0.3 - smooth(0.02, 0, Math.abs(r - 0.5)) * 0.2;
    });
  });
}

/** Scheibe mit abgerundetem Rand; Textur wird von oben „projiziert“. */
function slice(kind: SliceKind): Object3D {
  const dims: Record<SliceKind, [number, number]> = {
    lemon: [0.62, 0.11],
    lime: [0.52, 0.1],
    orange: [0.66, 0.11],
    cucumber: [0.46, 0.1],
    carrot: [0.34, 0.12],
    kiwi: [0.5, 0.1],
  };
  const [R, T] = dims[kind];
  const H = T / 2;
  const b = H * 0.9;
  const pts: Vector2[] = [new Vector2(0.0001, H)];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI;
    pts.push(new Vector2(R - b + b * Math.sin(a), H * Math.cos(a)));
  }
  pts.push(new Vector2(0.0001, -H));
  const geo = new LatheGeometry(pts.reverse(), 96);
  // Planare UV-Koordinaten von oben: Der Rand trifft so den Schalen-Ring der Textur.
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / (2 * R) + 0.5, pos.getZ(i) / (2 * R) + 0.5);
  }
  const wet = kind !== "carrot";
  const m = new Mesh(
    geo,
    physical(sliceSurface(kind), {
      roughness: wet ? 0.42 : 0.55,
      clearcoat: wet ? 0.55 : 0.25,
      clearcoatRoughness: 0.18,
      specularIntensity: 0.55,
      normalScale: new Vector2(0.6, 0.6),
    }),
  );
  m.rotation.x = Math.PI / 2;
  const g = new Group();
  g.add(m);
  return g;
}

/* ───────────────────────── Avocado ───────────────────────── */

const avocadoProfile = new SplineCurve(
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
).getPoints(64);

function avocadoRadius(y: number) {
  const p = avocadoProfile;
  for (let i = 0; i < p.length - 1; i++) {
    if (y >= p[i].y && y <= p[i + 1].y) {
      const t = (y - p[i].y) / (p[i + 1].y - p[i].y || 1);
      return p[i].x + (p[i + 1].x - p[i].x) * t;
    }
  }
  return 0;
}

function avocadoSkinSurface() {
  return cached("avocado-skin", () =>
    surface(512, 512, 6, (u, v, col) => {
      const bumps = fbm(u * 50, v * 70, 1e6, 3, 81);
      const pebble = smooth(0.5, 0.78, bumps);
      const patch = fbm(u * 5, v * 6, 1e6, 3, 82);
      let c = mix([30, 46, 20], [52, 72, 28], patch);
      c = mix(c, [74, 96, 40], pebble * 0.45);
      c = mix(
        c,
        [18, 24, 12],
        smooth(0.6, 0.85, fbm(u * 9, v * 9, 1e6, 2, 83)) * 0.4,
      );
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return pebble * 0.8 + bumps * 0.2;
    }),
  );
}

function avocadoFleshSurface() {
  return cached("avocado-flesh", () =>
    surface(320, 512, 2.5, (u, v, col) => {
      const x = (u * 2 - 1) * 0.64;
      const y = 1 - v * 2; // v = 0 oben im Bild → y = +1
      const r = avocadoRadius(y);
      const t = r > 0 ? Math.abs(x) / r : 1;
      const fib = fbm(u * 12, v * 40, 1e6, 3, 91);
      let c: RGB = mix([226, 214, 112], [196, 206, 78], smooth(0.25, 0.75, t));
      c = mix(c, [112, 160, 40], smooth(0.75, 0.93, t));
      c = mix(c, [44, 70, 26], smooth(0.95, 1.0, t));
      c = mix(c, [246, 236, 150], clamp01((fib - 0.5) * 0.4));
      // Schatten der Kernmulde
      const dp = Math.hypot(x, y + 0.36);
      c = mix(c, [190, 178, 84], smooth(0.36, 0.3, dp) * 0.5);
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return fib * 0.4 + smooth(0.3, 0.36, dp) * 0.3;
    }),
  );
}

function pitSurface() {
  return cached("avocado-pit", () =>
    surface(256, 256, 2, (u, v, col) => {
      const streak = fbm(u * 6, v * 24, 6, 4, 95);
      const c = mix([104, 58, 30], [158, 100, 58], streak);
      col[0] = c[0];
      col[1] = c[1];
      col[2] = c[2];
      return streak;
    }),
  );
}

function avocado(): Object3D {
  const g = new Group();
  const skin = new Mesh(
    new LatheGeometry(avocadoProfile, 64, 0, Math.PI),
    physical(avocadoSkinSurface(), {
      roughness: 0.68,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
      normalScale: new Vector2(0.9, 0.9),
      side: DoubleSide,
    }),
  );
  g.add(skin);

  const outline = [
    ...avocadoProfile,
    ...avocadoProfile
      .slice(0, -1)
      .reverse()
      .map((p) => new Vector2(-p.x, p.y)),
  ];
  const capGeo = new ShapeGeometry(new Shape(outline), 1);
  const pos = capGeo.attributes.position;
  const uv = capGeo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / 1.28 + 0.5, (pos.getY(i) + 1) / 2);
  }
  capGeo.rotateY(-Math.PI / 2);
  const cap = new Mesh(
    capGeo,
    physical(avocadoFleshSurface(), {
      roughness: 0.48,
      clearcoat: 0.45,
      clearcoatRoughness: 0.25,
      specularIntensity: 0.6,
      normalScale: new Vector2(0.3, 0.3),
    }),
  );
  cap.position.x = -0.001;
  g.add(cap);

  const pit = new Mesh(
    new SphereGeometry(0.29, 48, 32, -Math.PI / 2, Math.PI),
    physical(pitSurface(), {
      roughness: 0.38,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      normalScale: new Vector2(0.3, 0.3),
    }),
  );
  pit.scale.set(0.95, 1.08, 1);
  pit.position.set(-0.01, -0.36, 0);
  g.add(pit);

  g.rotation.y = Math.PI / 2; // Schnittfläche zur Kamera
  g.scale.setScalar(0.85);
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/* ───────────────────────── Blätter ───────────────────────── */

/**
 * Fein unterteilte Blattfläche (Basis bei y = 0) – im Gegensatz zu einer
 * extrudierten Kontur lässt sie sich überall sanft wölben.
 */
function leafGeometry(
  width: number,
  length: number,
  segX: number,
  segY: number,
  across: number,
  along: number,
  pucker: number,
  /** Zur Spitze hin spitz zulaufen lassen (für Kelchblätter ohne Textur). */
  taper = false,
) {
  const geo = new PlaneGeometry(width, length, segX, segY);
  geo.translate(0, length / 2, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = y / length;
    const x = taper
      ? pos.getX(i) * Math.sin(Math.PI * Math.min(1, 0.15 + t * 0.85)) ** 0.7
      : pos.getX(i);
    pos.setX(i, x);
    const z =
      across * x * x +
      along * y * y +
      pucker * (noise(x * 18 + 5, y * 18 + 5, 1e6, 7) - 0.5);
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo as BufferGeometry;
}

interface LeafArt {
  w: number;
  h: number;
  /** Blattkontur in Pixeln (Clip für Farbe und Alpha). */
  outline: () => Path2D;
  /** Zeichnet die Adern als Linien (Farbe/Stärke setzt der Aufrufer). */
  veins: (ctx: CanvasRenderingContext2D, main: boolean) => void;
  base: RGB;
  light: RGB;
  vein: string;
}

/** Blatt-Textur: Farbe mit Alpha-Kontur (für alphaTest) und Normal-Map der Adern. */
function leafSurface(key: string, art: LeafArt) {
  return cached(key, () => {
    const { w, h } = art;
    const color = newCanvas(w, h);
    const ctx = color.getContext("2d")!;
    // Grundfarbe mit sanftem Verlauf und Flecken
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = x / w;
        const v = y / h;
        const n = fbm(u * 8, v * 8, 1e6, 4, 101);
        const center = 1 - Math.abs(u - 0.5) * 2;
        const c = mix(art.base, art.light, center * 0.45 + (n - 0.5) * 0.5);
        const i = (y * w + x) * 4;
        img.data[i] = c[0];
        img.data[i + 1] = c[1];
        img.data[i + 2] = c[2];
        img.data[i + 3] = 255;
      }
    }
    const fill = newCanvas(w, h);
    fill.getContext("2d")!.putImageData(img, 0, 0);
    ctx.save();
    ctx.clip(art.outline());
    ctx.drawImage(fill, 0, 0);
    ctx.strokeStyle = art.vein;
    ctx.lineCap = "round";
    art.veins(ctx, true);
    ctx.globalAlpha = 0.5;
    art.veins(ctx, false);
    ctx.restore();

    // Höhe: Adern als Rinnen
    const hc = newCanvas(w, h);
    const hctx = hc.getContext("2d")!;
    hctx.fillStyle = "#808080";
    hctx.fillRect(0, 0, w, h);
    hctx.strokeStyle = "#2a2a2a";
    hctx.lineCap = "round";
    art.veins(hctx, true);
    hctx.globalAlpha = 0.6;
    art.veins(hctx, false);
    hctx.globalAlpha = 1;
    hctx.filter = "blur(2px)";
    hctx.drawImage(hc, 0, 0);
    const data = hctx.getImageData(0, 0, w, h).data;
    const height = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const u = (i % w) / w;
      const v = Math.floor(i / w) / h;
      height[i] = data[i * 4] / 255 + fbm(u * 30, v * 30, 1e6, 2, 102) * 0.08;
    }
    return {
      map: toTexture(color, true),
      normalMap: toTexture(normalsFrom(height, w, h, 3), false),
    };
  });
}

function leafMaterial(s: Surface, gloss: number) {
  return new MeshPhysicalMaterial({
    map: s.map,
    normalMap: s.normalMap,
    normalScale: new Vector2(0.8, 0.8),
    alphaTest: 0.5,
    alphaToCoverage: true,
    roughness: 0.5 - gloss * 0.2,
    clearcoat: gloss,
    clearcoatRoughness: 0.35,
    sheen: 0.6,
    sheenColor: new Color("#c4e3a0"),
    sheenRoughness: 0.5,
    side: DoubleSide,
  });
}

// Petersilie: Kontur aus dem Logo (Einheiten des Teilblatts, Basis 0|0, Spitze 0|-11.6)
const PK = 44; // Pixel pro Einheit
const parsleyArt: LeafArt = {
  w: 10 * PK,
  h: 12 * PK,
  base: [52, 104, 38],
  light: [98, 150, 64],
  vein: "rgba(150, 196, 108, 0.5)",
  outline() {
    const p = new Path2D();
    p.addPath(
      new Path2D(leafletPath),
      new DOMMatrix([PK, 0, 0, PK, 5 * PK, 12 * PK - 0.2 * PK]),
    );
    return p;
  },
  veins(ctx, main) {
    ctx.save();
    ctx.translate(5 * PK, 12 * PK - 0.2 * PK);
    ctx.scale(PK, PK);
    ctx.lineWidth = main ? 0.16 : 0.06;
    const line = (
      x0: number,
      y0: number,
      cx: number,
      cy: number,
      x1: number,
      y1: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.stroke();
    };
    if (main) {
      line(0, 0, 0.2, -6, 0, -10.8);
      for (const s of [1, -1]) {
        line(0, -1.2, 2.2 * s, -2, 3.9 * s, -3.4);
        line(0, -3.2, 2.6 * s, -4.2, 4.2 * s, -5.3);
        line(0, -6.2, 1.9 * s, -7.2, 3.0 * s, -8.5);
        line(0, -8.4, 0.9 * s, -9.2, 1.5 * s, -9.9);
      }
    } else {
      const rand = rng(5);
      for (let i = 0; i < 40; i++) {
        const y = -1 - rand() * 9;
        const s = rand() > 0.5 ? 1 : -1;
        const x = (0.5 + rand() * 1.8) * s;
        line(
          x,
          y,
          x + 0.4 * s,
          y - 0.3,
          x + (0.4 + rand() * 0.8) * s,
          y - 0.6 - rand() * 0.6,
        );
      }
    }
    ctx.restore();
  },
};

const basilArt: LeafArt = {
  w: 320,
  h: 512,
  base: [36, 92, 32],
  light: [78, 138, 56],
  vein: "rgba(120, 176, 88, 0.55)",
  outline() {
    const w = 320;
    const h = 512;
    const p = new Path2D();
    p.moveTo(w / 2, h - 6);
    p.bezierCurveTo(w * 0.98, h * 0.82, w * 1.0, h * 0.3, w / 2, 6);
    p.bezierCurveTo(0, h * 0.3, w * 0.02, h * 0.82, w / 2, h - 6);
    p.closePath();
    return p;
  },
  veins(ctx, main) {
    const w = 320;
    const h = 512;
    ctx.lineWidth = main ? 5 : 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, h);
    ctx.quadraticCurveTo(w / 2 + 6, h / 2, w / 2, 20);
    ctx.stroke();
    if (!main) return;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) {
      const y = h * (0.82 - i * 0.12);
      for (const s of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(w / 2, y);
        ctx.quadraticCurveTo(
          w / 2 + s * w * 0.22,
          y - h * 0.04,
          w / 2 + s * w * 0.4,
          y - h * 0.13,
        );
        ctx.stroke();
      }
    }
  },
};

/** Petersilienzweig: drei Teilblätter an einem Stiel – wie das Logo, nur in 3D. */
function parsley(): Object3D {
  const g = new Group();
  const s = leafSurface("parsley", parsleyArt);
  const mat = leafMaterial(s, 0.25);
  // Ebene so groß wie die Textur, Basis des Teilblatts bei y = 0 (in Teilblatt-Einheiten / 11.6)
  const unit = 1 / 11.6;
  const geo = leafGeometry(10 * unit, 12 * unit, 16, 20, 0.6, 0.12, 0.05);
  geo.translate(0, -0.2 * unit, 0);
  const parts: [number, number, number, number, number][] = [
    [0.05, 0.05, 0.14, 0.92, 0.25],
    [-0.04, -0.06, -0.98, 0.74, -0.35],
    [0.06, -0.08, 1.19, 0.68, 0.4],
  ];
  const stemMat = new MeshPhysicalMaterial({
    color: "#6a9c48",
    roughness: 0.45,
    clearcoat: 0.3,
    sheen: 0.5,
    sheenColor: new Color("#c9e6a8"),
  });
  for (const [x, y, rot, sc, tilt] of parts) {
    const m = new Mesh(geo, mat);
    m.position.set(x, y, 0);
    m.rotation.set(tilt * 0.6, tilt, -rot);
    m.scale.setScalar(sc);
    g.add(m);
  }
  const stem = new CatmullRomCurve3([
    new Vector3(0.04, 0.02, 0),
    new Vector3(0.03, -0.35, 0.04),
    new Vector3(-0.08, -0.7, 0.02),
    new Vector3(-0.28, -1.0, -0.05),
  ]);
  g.add(new Mesh(new TubeGeometry(stem, 32, 0.02, 10), stemMat));
  g.position.y = 0.3;
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/** Basilikumblatt: glänzend, gewölbt, leicht gewellt. */
function basil(): Object3D {
  const g = new Group();
  const mat = leafMaterial(leafSurface("basil", basilArt), 0.35);
  const leaf = new Mesh(leafGeometry(0.82, 1.3, 18, 28, 0.9, 0.05, 0.025), mat);
  g.add(leaf);
  const stalk = new Mesh(
    new TubeGeometry(
      new CatmullRomCurve3([
        new Vector3(0, 0.02, 0.01),
        new Vector3(0, -0.12, 0.03),
        new Vector3(0.03, -0.24, 0.02),
      ]),
      8,
      0.018,
      8,
    ),
    new MeshPhysicalMaterial({ color: "#5e9446", roughness: 0.5 }),
  );
  g.add(stalk);
  g.position.y = -0.55;
  const wrap = new Group();
  wrap.add(g);
  return wrap;
}

/* ───────────────────────── Fabrik ───────────────────────── */

const builders: Record<Kind, () => Object3D> = {
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

export function buildFood(kind: Kind): Object3D {
  return builders[kind]();
}

/** Alle erzeugten Texturen (z. B. zum Aufräumen). */
export function foodTextures(): Texture[] {
  return [...cache.values()].flatMap((s) => [s.map, s.normalMap]);
}
