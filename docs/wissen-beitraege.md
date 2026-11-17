# Neuen Beitrag schreiben (Bereich „Wissen“)

Beiträge sind Markdown-Dateien in `src/content/wissen/`. Der Dateiname wird zur Adresse: `overnight-oats.md` erscheint unter `/wissen/overnight-oats`.

## Schritte

1. Neue Datei `src/content/wissen/mein-beitrag.md` anlegen (Kleinbuchstaben, Bindestriche, keine Umlaute).
2. Kopf (Frontmatter) ausfüllen, siehe unten.
3. Darunter den Text in Markdown schreiben (`##` für Zwischenüberschriften, `-` für Listen, `1.` für Schritte).
4. Mit `npm run dev` unter <http://localhost:4321/wissen> ansehen.
5. Erst wenn der Beitrag freigegeben ist: `draft: false` setzen.

## Frontmatter

```yaml
---
title: "Titel des Beitrags"
description: "Ein bis zwei Sätze für Übersicht und Suchmaschinen."
pubDate: 2026-11-16
updatedDate: 2026-12-01 # optional
category: Rezept # oder: Wissen
image: ../../assets/images/mein-bild.jpg # optional
imageAlt: "Beschreibung des Bildes" # Pflicht, wenn ein Bild gesetzt ist
draft: true # true = nur im Dev-Server sichtbar
# Nur bei Rezepten (alle optional):
portions: "2 Portionen"
prepTime: "10 Minuten"
ingredients:
  - "100 g Haferflocken"
  - "1 Banane"
---
```

## Entwürfe

- `draft: true`: Der Beitrag erscheint nur im Dev-Server (mit „Entwurf“-Hinweis), nie im Produktions-Build.
- `draft: false` (oder weglassen): Der Beitrag ist öffentlich.
- Vorbereitete Beiträge tragen oben den Kommentar `<!-- TODO(Lea): Inhalt prüfen und freigeben, dann draft: false -->`. Beim Freigeben den Kommentar entfernen.

## Inhaltliche Regeln

- Du-Ansprache, warm und klar. Formulierungsleitfaden: `docs/textpruefung.md` (Abschnitt 4).
- Keine Heilversprechen („heilt“, „löst“, „entgiftet“), stattdessen „unterstützen“, „kann helfen“. Bei Beschwerden auf ärztliche Abklärung hinweisen.
- Keine Zahlen, Studien oder Quellen angeben, die nicht belegt sind. Fehlt etwas: `TODO(Lea): …` setzen.
- Bilder mit sinnvollem `imageAlt`. Bilddateien nach `src/assets/images/` legen, die Optimierung übernimmt Astro.

## Technik

- Schema der Sammlung: `src/content.config.ts`. Fehler im Frontmatter (z. B. falsche Kategorie) meldet `npm run check` bzw. der Build.
- Das Rezept-Markup (JSON-LD `Recipe`) entsteht automatisch aus `ingredients`, `portions` und dem Titel. Artikel erhalten `Article`.
