# Qualität: Lighthouse und Gerätetest (Issue #31)

Stand: lokaler Test gegen `astro preview` (Lighthouse 13.6.0, Chromium 1243, headless). Die Werte
sind Laborwerte ohne Netlify-Header und ohne CDN, bitte nach dem ersten Deployment erneut prüfen.

## Lighthouse

Reihenfolge der Werte: Performance / Barrierefreiheit / Best Practices / SEO. Mobil und Desktop
liefern in allen Kategorien dieselben Werte, außer wo angegeben.

| Seite       | Vorher (Mobil)       | Nachher (Mobil und Desktop) |
| ----------- | -------------------- | --------------------------- |
| Start       | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Leistungen  | 100 / 92 / 100 / 100 | 100 / 98 / 100 / 100        |
| Über mich   | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Kontakt     | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Termin      | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Wissen      | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Datenschutz | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| Impressum   | 100 / 95 / 100 / 100 | 100 / 100 / 100 / 100       |
| 404         | 100 / 95 / 100 / 66  | 100 / 100 / 100 / 66        |

- Die 404-Seite erreicht beim SEO-Wert 66 mit Absicht: Sie ist per `noindex` von der Suche
  ausgenommen ("Seite ist nicht indexierbar").
- LCP mobil 0,8 s, Desktop 0,2 bis 0,3 s, TBT höchstens 50 ms, CLS vorher bis 0,027, nachher 0.
- Offener Barrierefreiheits-Befund (nur gemeldet): `/leistungen/` springt von `h1` auf `h3`
  (Überschriftenreihenfolge, Lighthouse `heading-order`).
- Kein Zugriff auf PageSpeed Insights oder echte Geräte aus der Testumgebung.

## Gerätetest

Playwright mit Chromium: iPhone SE (375 und 320 px), iPhone 15, Pixel 7, iPad hoch und quer,
Desktop 1280 und 1920, alle 9 Seiten. Geprüft: horizontaler Überlauf, Elemente rechts
außerhalb des Viewports, abgeschnittene Texte, Abstand unter dem Footer für die mobile
Tab-Leiste. Ergebnis nachher: keine Auffälligkeiten (der Skip-Link ist absichtlich unsichtbar).
Der Footer hat unten genug Polster (`pb-28`), die Tab-Leiste verdeckt keinen Inhalt.

WebKit und Firefox sind in der Testumgebung nicht installiert. Der Test auf echtem iOS Safari
und Firefox steht noch aus (Safe-Area, Schrift-Rendering, `hyphens: auto`).

## Behoben

- Schrift: Manrope wird nur noch als `latin` und `latin-ext` geladen (vorher alle Teilmengen
  mit Kyrillisch, Griechisch, Vietnamesisch), die `latin`-Datei wird per `<link rel="preload">`
  vorgeladen (`BaseLayout.astro`, `global.css`).
- Hero-Bild: `Photo` setzt bei `eager` jetzt `fetchpriority="high"` und `decoding="sync"`. Aktuell
  sind auf der Seite noch Platzhalter, die Wirkung zeigt sich mit den echten Fotos.
- Layout: Header-Navigation auf 768 bis 1023 px enger (kein Umbruch der Links), Tab-Leiste und
  Überschrift auf 320 px Breite ohne Überlauf, lange Wörter in Überschriften dürfen umbrechen.
- Kontrast: Copyright im Footer und Tab-Leiste nutzen `text-muted` statt `slate-500`
  (Barrierefreiheit 95 auf 100).

## Preload und Content-Security-Policy

Die vorgeladene Schrift liegt unter `/_astro/` auf derselben Domain. Die CSP in `netlify.toml`
erlaubt `font-src 'self'`, und der Preload enthält `crossorigin`, deshalb gibt es weder Konflikte
noch doppelte Downloads. Die `/_astro/*`-Dateien bekommen `immutable`-Caching.

## Nach dem ersten Deployment

1. https://pagespeed.web.dev mit der echten Adresse für Start, Leistungen und Kontakt
   (mobil und Desktop) ausführen, Ergebnisse mit der Tabelle oben vergleichen.
2. Mit Browser-Entwicklertools prüfen, dass keine CSP-Verstöße in der Konsole stehen.
3. Wenn echte Fotos eingebaut sind: LCP und CLS erneut messen.
