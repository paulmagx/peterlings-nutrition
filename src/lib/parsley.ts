/**
 * Petersilienblatt (glatte Petersilie) – Bildmarke von Peterlings Nutrition.
 * Ein Teilblatt mit Basis bei (0,0) und Spitze nach oben; das Logo setzt drei davon
 * an einen geschwungenen Stiel (24er-Raster). Genutzt von ParsleyMark.astro und
 * Botanical.astro; public/favicon.svg enthält dieselben Werte.
 */
/**
 * Umriss der rechten Hälfte eines Teilblatts (Basis → Spitze), Einheit ≈ 1/11,6 der Blatthöhe.
 * Daraus ist leafletPath erzeugt (gespiegelt, Catmull-Rom geglättet); die 3D-Szene nutzt die Punkte direkt.
 */
export const leafletPoints: [number, number][] = [
  [0, 0],
  [0.9, -1.4],
  [2.4, -2.7],
  [4.3, -3.3],
  [3.7, -4.3],
  [4.7, -5.3],
  [3.3, -5.8],
  [2.3, -5.6],
  [3.1, -7.1],
  [3.4, -8.6],
  [2.1, -8.5],
  [1.7, -9.9],
  [0, -11.6],
];

export const leafletPath =
  "M0 0C0.12 -0.18 0.59 -1.05 0.9 -1.4C1.21 -1.75 1.96 -2.45 2.4 -2.7C2.84 -2.95 4.13 -3.09 4.3 -3.3C4.47 -3.51 3.65 -4.04 3.7 -4.3C3.75 -4.56 4.75 -5.1 4.7 -5.3C4.65 -5.5 3.61 -5.76 3.3 -5.8C2.99 -5.84 2.33 -5.43 2.3 -5.6C2.27 -5.77 2.96 -6.71 3.1 -7.1C3.24 -7.49 3.53 -8.42 3.4 -8.6C3.27 -8.78 2.32 -8.33 2.1 -8.5C1.88 -8.67 1.97 -9.5 1.7 -9.9C1.43 -10.3 0.44 -11.6 0 -11.6C-0.44 -11.6 -1.43 -10.3 -1.7 -9.9C-1.97 -9.5 -1.88 -8.67 -2.1 -8.5C-2.32 -8.33 -3.27 -8.78 -3.4 -8.6C-3.53 -8.42 -3.24 -7.49 -3.1 -7.1C-2.96 -6.71 -2.27 -5.77 -2.3 -5.6C-2.33 -5.43 -2.99 -5.84 -3.3 -5.8C-3.61 -5.76 -4.65 -5.5 -4.7 -5.3C-4.75 -5.1 -3.75 -4.56 -3.7 -4.3C-3.65 -4.04 -4.47 -3.51 -4.3 -3.3C-4.13 -3.09 -2.84 -2.95 -2.4 -2.7C-1.96 -2.45 -1.21 -1.75 -0.9 -1.4C-0.59 -1.05 -0.12 -0.18 0 0Z";

/** Blattadern eines Teilblatts (werden als Maske aus der Fläche ausgespart). */
export const leafletVeins =
  "M0 -0.6V-9.6M0 -3.2L2.6 -4.6M0 -3.2L-2.6 -4.6M0 -6.4L1.8 -7.6M0 -6.4L-1.8 -7.6";

/** Lage der drei Teilblätter im 24er-Raster: Mitte, links, rechts. */
export const leafletTransforms = [
  "translate(12.6 12.2) rotate(8) scale(0.92)",
  "translate(11.9 13.4) rotate(-56) scale(0.74)",
  "translate(13.1 13.6) rotate(68) scale(0.68)",
];

export const stemPath = "M12.5 12.4C12.6 16 11.8 19.4 9.4 22.4";
