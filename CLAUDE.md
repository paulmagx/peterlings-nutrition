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
- Farben nur über die Tokens in `src/styles/global.css`: `ink`, `muted`, `surface` (Weiß), `canvas` (helles Grau für Bänder), `line` (Haarlinien) und `sage-50` … `sage-950`. Farbiger Text/Links: `text-sage-700` (auf dunklen Flächen `text-sage-300`); Buttons: `bg-sage-700`. `sage-400/500` nie für Text.
- Keine externen Ressourcen ohne Einwilligung (Fonts, Maps, Embeds, Tracker). Externe Embeds nur per Zwei-Klick-Lösung.
- Echte Links (`<a href>`) statt `onclick`. Bilder mit sinnvollem `alt`. Formulare mit `<label>`.
- Mobile-first, aber auf dem Desktop eine richtige Ansicht (`max-w-6xl`-Container, mehrspaltig ab `md:`). Auf dem Handy gibt es ein Menü in der Kopfzeile (keine Tab-Leiste mehr).

## Design (ruhiger Premium-Stil, angelehnt an große Produktseiten)

Vorbild ist die Startseite `src/pages/index.astro` – neue Seiten daran ausrichten.

- **Weißraum:** Abschnitte großzügig (`py-20 md:py-32`), Container `mx-auto max-w-6xl px-5 sm:px-6`. Lieber weniger Elemente, dafür größer.
- **Abschnitte als Vollbreiten-Bänder** im Wechsel: Weiß (`bg-surface`), Hellgrau (`bg-canvas`), selten dunkel (`bg-ink text-white`). Zwei gleichfarbige Bänder hintereinander mit `border-t border-line` trennen.
- **Typografie:** Utilities aus `global.css` nutzen: `text-display` (h1), `text-headline` (h2), `text-title` (h3/Kachel-Titel), `text-lead` (Einleitung, `text-muted`), `text-eyebrow` (kleine Überzeile in `text-sage-700`, **nicht** in Großbuchstaben). Gewichte `font-semibold`/`font-medium`, nie `font-extrabold`/`font-black`, keine `uppercase tracking-widest`-Überzeilen.
- **Ausrichtung:** Abschnittsköpfe zentriert (Überzeile, Überschrift, ggf. Link „… ›“). Fließtext-Seiten (Impressum, Datenschutz, Artikel) linksbündig, max. `max-w-3xl`.
- **Kacheln:** `rounded-tile` (1,75 rem), weiß auf `bg-canvas` bzw. `bg-canvas` auf Weiß, ohne Rahmen und ohne Schatten im Ruhezustand; Hover höchstens leicht anheben. Innenabstand `p-8 md:p-10`.
- **Buttons:** `Button` mit `variant="primary"` (Pille), `"secondary"` (umrandete Pille), `"link"` (Textlink mit ›) und `"light"` (helle Pille auf dunklem Grund); `size="lg"` für Hauptaktionen. Neben einer Pille steht meist ein `link`.
- **Linien statt Kästen:** Listen, FAQ, Schritte mit Haarlinien (`border-line`) statt umrandeter Boxen.
- **Icons** sparsam, in `text-sage-700`, eher groß und einzeln (`size-9`/`size-10`) als viele kleine.
- **Bewegung:** Klasse `reveal` für sanftes Einblenden beim Scrollen (reines CSS, respektiert „Bewegung reduzieren“). Nicht auf das h1 oder Inhalte über dem Falz anwenden.
- **Formulare:** Felder `rounded-xl border border-line bg-white px-4 py-3`, Fokus `focus:border-sage-700 focus:ring-2 focus:ring-sage-700/20`; Kontrast der Rahmen mind. 3:1 zum Hintergrund (ggf. `border-muted`).
- `legacy/` ist der alte Prototyp – nur Referenz, nicht verändern.

## Vor jedem Commit

```bash
npm run format && npm run check && npm run build
```

Alle drei müssen fehlerfrei laufen.
