# Fotos für die Website

Lege die Fotos hier ab. Beim Build werden sie automatisch in AVIF und WebP
umgewandelt und in mehreren Größen ausgeliefert. Fehlt eine Datei, zeigt die
Seite einen Platzhalter „Foto folgt“, der Build funktioniert trotzdem.

Der Dateiname (ohne Endung) ist der Schlüssel für `getImage("…")` in
`src/data/images.ts`. Erlaubt: `jpg`, `jpeg`, `png`, `webp`, `avif`.

## Erwartete Dateien

| Datei      | Format         | Mindestgröße | Verwendung                           |
| ---------- | -------------- | ------------ | ------------------------------------ |
| `portrait` | hochkant (4:5) | 1200 × 1500  | Über mich: Porträt von Lea           |
| `hero`     | quer (3:2)     | 2000 × 1333  | Startseite: Titelbild                |
| `praxis`   | quer (3:2)     | 1600 × 1067  | Praxis / Beratungsraum               |
| `food-1` … | quadratisch    | 1200 × 1200  | Food-Bilder (fortlaufend nummeriert) |

Größer ist in Ordnung (am besten 2000 px und mehr an der langen Kante, nicht
über ca. 5 MB pro Datei). Zugeschnitten wird per CSS auf das jeweilige
Seitenverhältnis, wichtige Motive bitte mittig platzieren.

## Bildrechte

- Nur Fotos verwenden, an denen Lea alle Rechte hat (selbst gemacht oder
  Nutzungsrecht der Fotografin / des Fotografen schriftlich geklärt).
- Bei Fotos mit erkennbaren Personen: Einwilligung der abgebildeten Personen.
- Keine Stockfotos ohne passende Lizenz, keine Bilder aus dem Netz.
- Bei Bedarf Urheber-Nennung im Impressum ergänzen.
- Vor dem Hochladen Standortdaten (EXIF/GPS) entfernen.

## Einbinden

```astro
---
import Photo from "../components/Photo.astro";
import { getImage } from "../data/images";
---

<Photo
  image={getImage("portrait")}
  alt="Porträtfoto von Lea Petruschka"
  aspect="portrait"
/>
```

`alt` beschreibt, was auf dem Foto zu sehen ist (nicht „Foto von …“).
