import type { ImageMetadata } from "astro";

/**
 * Optionale Fotos aus `src/assets/images/`. Fehlt eine Datei, liefert
 * `getImage()` `undefined` und `Photo.astro` zeigt einen Platzhalter.
 * Erwartete Dateinamen: siehe `src/assets/images/README.md`.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/images/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

const images = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  const name = path
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  if (name) images.set(name, mod.default);
}

/** Bild anhand des Dateinamens ohne Endung, z. B. `getImage("portrait")`. */
export function getImage(name: string): ImageMetadata | undefined {
  return images.get(name);
}
