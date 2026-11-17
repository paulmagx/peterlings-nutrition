# Peterlings Nutrition

Website für die Ernährungsberatung von Lea Petruschka, gebaut mit [Astro](https://astro.build) und [Tailwind CSS](https://tailwindcss.com).

Fahrplan und offene Aufgaben: [`PLANUNG.md`](PLANUNG.md) und die GitHub-Issues.

## Loslegen

Voraussetzung: [Node.js](https://nodejs.org) ab Version 22.

```bash
npm install
```

```bash
npm run dev
```

Die Seite läuft dann unter http://localhost:4321 und lädt sich bei Änderungen automatisch neu.

## Befehle

| Befehl                 | Was er tut                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`          | Entwicklungsserver starten                                                                                                                 |
| `npm run build`        | Fertige Website nach `dist/` bauen                                                                                                         |
| `npm run preview`      | Gebaute Website lokal ansehen                                                                                                              |
| `npm run check`        | Typprüfung                                                                                                                                 |
| `npm run format`       | Code einheitlich formatieren (Prettier)                                                                                                    |
| `npm run format:check` | Prüfen, ob alles formatiert ist (läuft auch in CI)                                                                                         |
| `npm run check:links`  | Tote Links und Attrappen finden (nach `npm run build`; braucht Playwright, `-- --dev` prüft den Dev-Modus mit Entwürfen)                   |
| `npm run check:a11y`   | Barrierefreiheit mit axe prüfen (WCAG 2.2 AA, 390 und 1280 px; nach `npm run build`; braucht Playwright, siehe `docs/barrierefreiheit.md`) |

## Aufbau

```
src/
├── layouts/BaseLayout.astro   # Grundgerüst jeder Seite: <head>, Header, Footer, Navigation
├── components/                # Wiederverwendbare Bausteine (Header, Footer, Icon …)
├── data/site.ts               # Name, Beschreibung, Navigation – an einer Stelle
├── pages/                     # Jede Datei ist eine Seite (index.astro = Startseite)
└── styles/global.css          # Tailwind + Design-Tokens (Farben, Schrift)
legacy/                        # Ursprünglicher HTML-Prototyp, nur noch als Design-Referenz
```

- **Farben und Schrift** werden nur in `src/styles/global.css` festgelegt (Salbeigrün-Skala `sage-50` bis `sage-950`).
- **Icons**: `<Icon name="…" />` mit Namen aus [Material Symbols](https://icon-sets.iconify.design/material-symbols/). Sie werden beim Bauen als SVG eingebettet.
- **Schrift** (Manrope) wird lokal ausgeliefert, es werden keine Google-Server angefragt.
