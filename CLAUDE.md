# Projektregeln – Peterlings Nutrition

Website der Ernährungsberaterin Lea Petruschka. Astro 7 + Tailwind 4, rein statisch. Fahrplan: `PLANUNG.md`, Aufgaben: GitHub-Issues.

## Sprache und Ton

- Alle sichtbaren Texte auf Deutsch, Ansprache **„du“** (nie „Sie“).
- Warm, klar, alltagstauglich. Keine Heilversprechen („heilt“, „löst deine Darmprobleme“) – Heilmittelwerbegesetz. Stattdessen „unterstützen“, „begleiten“, „kann helfen“.
- Verbindlicher Formulierungsleitfaden: `docs/textpruefung.md` (Abschnitt „Formulierungsleitfaden“). Insbesondere: „Ernährungsberaterin“ statt „Therapeutin“, keine Diagnostik-Begriffe („Anamnese“, „Analyse“), keine unbelegten Siegel („zertifiziert“, „medizinisch“), keine Bewertungssterne.
- **Nichts erfinden**, was als Tatsache gelesen würde: keine Kundenstimmen, Qualifikationen, Adressen, Preise, Zahlen. Fehlt etwas, Platzhalter mit `TODO(Lea): …` setzen (im Code-Kommentar oder sichtbar in der Seite), damit es vor dem Livegang auffällt.

## Technik

- Seiten in `src/pages/`, immer über `src/layouts/BaseLayout.astro` (Props `title`, `description`).
- Wiederverwenden statt kopieren: `PageIntro`, `Button`, `Icon` (Material-Symbols-Namen, z. B. `eco-outline-rounded`) in `src/components/`.
- Stammdaten (Name, Navigation, Kontakt) nur in `src/data/site.ts`. Inhalte wie Leistungen als Daten in `src/data/` oder Content Collections, nicht hart in mehreren Seiten.
- Farben nur über die Tokens in `src/styles/global.css`: `sage-50` … `sage-950`, `surface`, `ink`, `muted`. Farbiger Text: `text-sage-700`; Buttons: `bg-sage-600`. `sage-400/500` nie für Text.
- Keine externen Ressourcen ohne Einwilligung (Fonts, Maps, Embeds, Tracker). Externe Embeds nur per Zwei-Klick-Lösung.
- Echte Links (`<a href>`) statt `onclick`. Bilder mit sinnvollem `alt`. Formulare mit `<label>`.
- Mobile-first, aber auf dem Desktop eine richtige Ansicht (`max-w-6xl`-Container, mehrspaltig ab `md:`). Die Tab-Leiste unten ist nur auf dem Handy sichtbar.
- `legacy/` ist der alte Prototyp – nur Referenz, nicht verändern.

## Vor jedem Commit

```bash
npm run format && npm run check && npm run build
```

Alle drei müssen fehlerfrei laufen.
