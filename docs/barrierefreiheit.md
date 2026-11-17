# Barrierefreiheit: Prüfbericht

Bericht zu Issue #30. Ziel: **WCAG 2.2, Stufe AA**. Stand: November 2026.

## Kurzfassung

- Die automatische Prüfung mit axe-core findet auf allen Seiten **keine Verstöße** (390 px und 1280 px, mit aufgeklappten FAQ, geöffneter Zwei-Klick-Box und testweise eingeschaltetem Kontakt- und Newsletterformular).
- Die manuelle Prüfung per Playwright (Tastatur, Fokus, Zoom, Überschriften, Landmarks, Zielgrößen …) hat einige Punkte gefunden. Sie sind behoben (siehe unten).
- **Noch offen:** ein Test mit echten Screenreadern (VoiceOver, NVDA) und mit echten Menschen. Automatische Werkzeuge finden erfahrungsgemäß nur einen Teil der Probleme.

## So prüfst du selbst

```bash
npm run build && npm run check:a11y
```

Das Skript `scripts/check-a11y.mjs` braucht Playwright (global installiert, wie bei `check:links`) und die Projektabhängigkeit `@axe-core/playwright`. Es läuft in zwei Durchgängen:

1. **Vorschau** (`astro preview`, die gebaute Seite aus `dist/`).
2. **Dev-Modus** (`astro dev`): zeigt zusätzlich die `/wissen`-Entwürfe und – über die Umgebungsvariable `A11Y_FORMS_PREVIEW=1` – das Kontakt- und das Newsletterformular, auch wenn sie noch nicht freigeschaltet sind. Diese Vorschau wirkt nur im Dev-Server, nie in der gebauten Seite.

Je Seite und Breite (390 px Handy, 1280 px Desktop):

- axe-core mit den Regeln `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, einmal im Ausgangszustand und einmal „interaktiv“ (alle `<details>` offen, alle Zwei-Klick-Boxen geladen; externe Anfragen werden dabei abgefangen),
- genau eine `<h1>`, keine übersprungenen Überschriftenebenen,
- jede sichtbare `<nav>` hat einen eindeutigen Namen, je ein `<header>`, `<main>`, `<footer>`,
- kein waagerechtes Scrollen bei 320 px Breite (entspricht 1280 px bei 400 % Zoom).

Optionen: `-- --preview-only`, `-- --dev-only`, `-- --url http://localhost:4321` (bereits laufender Server).

## Prüfumfang

Alle Seiten: Start, Leistungen, Wissen (inkl. Entwürfe im Dev-Modus), Über mich, Kontakt, Termin, Impressum, Datenschutz, 404-Seite. Dazu die gemeinsamen Bausteine Header, Tab-Leiste (Handy), Footer, Newsletter, Kontaktformular, FAQ, Zwei-Klick-Box.

Die Kalender-Box auf `/termin` erscheint erst, wenn das Buchungstool eingerichtet ist; sie wurde deshalb nicht im Browser geprüft (gleicher Baustein `ConsentEmbed` wie die Karte auf `/kontakt`).

Browser: Chromium (Playwright). Nicht geprüft: Safari/iOS, Firefox, echte Screenreader, Sprachsteuerung.

## Ergebnis je Kriterium

| Kriterium (WCAG 2.2)                               | Ergebnis                                                                                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.1 Nicht-Text-Inhalte                           | Erfüllt. Icons sind dekorativ (`aria-hidden`), Logo-Link hat einen Namen, Foto-Platzhalter nur mit Alt-Text als Bild ausgezeichnet. Echte Fotos fehlen noch (siehe offene Punkte). |
| 1.3.1 Info und Beziehungen                         | Erfüllt. Überschriften lückenlos (h1 → h2 → h3), Listen als Listen, Formularfelder mit `<label>`, Hinweise über `aria-describedby`.                                                |
| 1.3.5 Zweck von Eingabefeldern                     | Erfüllt (`autocomplete="name"`, `"email"`).                                                                                                                                        |
| 1.4.1 Benutzung von Farbe                          | Erfüllt. Aktive Seite in den Navigationen zusätzlich unterstrichen bzw. fett, Links im Text unterstrichen.                                                                         |
| 1.4.3 Kontrast (Text)                              | Erfüllt (axe). Fließtext `ink`/`muted`, farbiger Text `sage-700`, Buttons Weiß auf `sage-600` (4,88:1).                                                                            |
| 1.4.4 Textgröße / Zoom 200 %                       | Erfüllt. Bei 640 px Breite (= 1280 px bei 200 %) bleibt alles lesbar und bedienbar.                                                                                                |
| 1.4.10 Umbruch (Reflow)                            | Erfüllt bei 320 px, kein waagerechtes Scrollen (nach Behebung, siehe unten).                                                                                                       |
| 1.4.11 Nicht-Text-Kontrast                         | Erfüllt nach Behebung: Rahmen der Eingabefelder jetzt `sage-600` (4,9:1), Fokusrahmen `sage-600`.                                                                                  |
| 1.4.12 Textabstände / 1.4.13 Inhalte bei Hover     | Erfüllt. Keine festen Höhen für Text, keine Tooltips oder Hover-Einblendungen.                                                                                                     |
| 2.1.1 Tastatur / 2.1.2 Keine Tastaturfalle         | Erfüllt. Alle Links, Buttons, Formularfelder, FAQ und Zwei-Klick-Box per Tab, Enter und Leertaste bedienbar; keine Falle.                                                          |
| 2.3.3 Animationen / `prefers-reduced-motion`       | Erfüllt. Bei „Bewegung reduzieren“ kein weiches Scrollen, keine Übergänge, kein „Eindrücken“ der Buttons.                                                                          |
| 2.4.1 Bereiche überspringen                        | Erfüllt. „Zum Inhalt springen“ ist das erste Tab-Ziel, wird beim Fokus sichtbar und führt in `<main>`.                                                                             |
| 2.4.2 Seitentitel                                  | Erfüllt. Jede Seite hat einen eigenen Titel.                                                                                                                                       |
| 2.4.3 Fokusreihenfolge                             | Erfüllt. Reihenfolge folgt dem Lesefluss: Skip-Link, Logo, Navigation, Termin buchen, Inhalt, Footer, Tab-Leiste.                                                                  |
| 2.4.4 Linkzweck                                    | Erfüllt. Links in neuem Tab sagen das jetzt für Screenreader an.                                                                                                                   |
| 2.4.6 Überschriften und Beschriftungen             | Erfüllt.                                                                                                                                                                           |
| 2.4.7 Fokus sichtbar                               | Erfüllt. Jedes Tab-Ziel zeigt einen 2-px-Rahmen in `sage-600`.                                                                                                                     |
| 2.4.11 Fokus nicht verdeckt                        | Erfüllt. `scroll-padding` hält fokussierte Elemente frei von Sticky-Header und Tab-Leiste.                                                                                         |
| 2.5.3 Beschriftung im Namen                        | Erfüllt. Sichtbarer Text steckt im zugänglichen Namen (z. B. Logo-Link).                                                                                                           |
| 2.5.8 Zielgröße (Minimum, 24 × 24 px)              | Erfüllt nach Behebung (Checkboxen 24 px, Footer-Links 24 px hoch). Links im Fließtext sind ausgenommen.                                                                            |
| 3.1.1 Sprache der Seite                            | Erfüllt (`<html lang="de">`).                                                                                                                                                      |
| 3.2.3/3.2.4 Konsistente Navigation und Bezeichnung | Erfüllt. Header, Tab-Leiste und Footer auf allen Seiten gleich.                                                                                                                    |
| 3.3.1 Fehlererkennung / 3.3.2 Beschriftungen       | Erfüllt. Pflichtfelder sind als „Pflichtfeld“ beschriftet, der Browser meldet Fehler am Feld; Sende-Status über `role="status"`.                                                   |
| 4.1.2 Name, Rolle, Wert                            | Erfüllt. Native Elemente, `aria-current="page"` in allen Navigationen, iframe der Zwei-Klick-Box mit `title`.                                                                      |
| Landmarks                                          | Erfüllt. „Hauptnavigation“ (Header, Desktop), „Hauptnavigation (Tab-Leiste)“ (Handy), „Seiten“ und „Rechtliches“ (Footer), „Inhalt“ (Datenschutz), „Abschnitte“ (Wissen).          |
| Tab-Leiste verdeckt keinen Inhalt                  | Erfüllt. Footer hat auf dem Handy unten genug Abstand; Fokusziele werden über `scroll-padding-bottom` freigehalten.                                                                |

## Gefunden und behoben

1. **Kontaktformular, Datenschutz-Checkbox:** Um den Link „Datenschutzerklärung“ fehlten die Leerzeichen („…die**Datenschutzerklärung**gelesen…“). Das war falsch vorgelesen und hat auf 320 px die Seite um 30 px zu breit gemacht. → Leerzeichen ergänzt.
2. **Kontaktseite:** Das zweispaltige Raster hat sich auf schmalen Bildschirmen nicht verkleinert. → `grid-cols-1`.
3. **Startseite:** Die lange Überschrift („Ernährungsberatung …“) lief bei 320 px über den Rand. → Überschriften trennen und umbrechen (`hyphens: auto`).
4. **Eingabefelder** (Kontakt, Newsletter): Rahmen in `sage-300` hatten nur 1,8:1 Kontrast. → `sage-600`.
5. **Zielgrößen:** Checkboxen 20 px → 24 px; Footer-Links 19 px hoch → 24 px.
6. **Footer-Copyright** in `slate-500` auf `sage-50` lag knapp unter 4,5:1. → `muted`.
7. **Tab-Leiste (Handy):** Text in `slate-500` → `muted`; aktive Seite nicht nur farbig, sondern mit Hintergrund und Unterstreichung; eigener Name „Hauptnavigation (Tab-Leiste)“.
8. **`aria-current`:** fehlte im Footer (Impressum, Datenschutz) und beim „Termin buchen“-Link. → ergänzt. Aktive Seite im Header zusätzlich unterstrichen.
9. **Leistungen:** Die Leistungskarten (h3) folgten direkt auf die h1. → unsichtbare Überschrift „Meine Leistungen“ (h2).
10. **Links in neuem Tab** (Datenschutz von OpenStreetMap/Zeeg, `Button` mit `newTab`): → Zusatz „(öffnet in neuem Tab)“ für Screenreader.
11. **Foto-Platzhalter** ohne Alt-Text wurden als leeres Bild vorgelesen. → dann `aria-hidden`.
12. **Fokus und Bewegung:** `scroll-padding` für Sticky-Header und Tab-Leiste (2.4.11), `prefers-reduced-motion` respektiert.

## Offene Punkte – bitte noch von Hand testen

Mit **VoiceOver** (iPhone/Safari und Mac) und **NVDA** (Windows/Firefox oder Chrome):

- [ ] Startseite einmal komplett vorlesen lassen: Reihenfolge sinnvoll, nichts doppelt (Icons stumm)?
- [ ] Rotor/Elementliste: Überschriften und Landmarks („Hauptnavigation“, „Seiten“, „Rechtliches“) gut zu finden?
- [ ] Aktive Seite wird als „aktuelle Seite“ angesagt?
- [ ] FAQ: wird „ausgeklappt/eingeklappt“ angesagt?
- [ ] Zwei-Klick-Box: nach „Karte laden“ bzw. „Kalender laden“ landet der Fokus in der Karte/dem Kalender und wird angesagt. Der Buchungskalender des Anbieters selbst (Zeeg) liegt nicht in unserer Hand – bitte einmal damit buchen.
- [ ] Kontakt- und Newsletterformular (sobald freigeschaltet): Pflichtfelder, Fehlermeldungen des Browsers und die Erfolgs-/Fehlermeldung nach dem Senden werden vorgelesen?
- [ ] iPhone: Tab-Leiste mit VoiceOver bedienbar, verdeckt beim Wischen keinen Inhalt; Textgröße in iOS auf das Maximum stellen.
- [ ] Sobald echte Fotos da sind: aussagekräftige Alt-Texte (`TODO(Lea)`), rein dekorative Bilder mit leerem `alt`.
- [ ] Neue Wissen-Beiträge: Bilder mit Alt-Text, Überschriften ab `##` (h2) ohne Sprünge.

## Barrierefreiheitsstärkungsgesetz (BFSG) – vorsichtige Einordnung

> **Keine Rechtsberatung.** Bitte im Zweifel mit einer Anwältin, der IHK oder dem Berufsverband klären.

- Das BFSG gilt seit dem **28. Juni 2025**. Es betrifft unter anderem **Dienstleistungen im elektronischen Geschäftsverkehr** für Verbraucher – also Websites, über die ein Vertrag online geschlossen wird (z. B. eine Online-Terminbuchung mit Bezahlung).
- **Kleinstunternehmen**, die Dienstleistungen anbieten, sind nach § 3 Abs. 3 BFSG ausgenommen: weniger als **10 Beschäftigte** und höchstens **2 Mio. € Jahresumsatz oder Jahresbilanzsumme**. Eine Einzelberaterin fällt nach heutigem Stand sehr wahrscheinlich darunter.
- Eine reine Informationsseite (Angebot vorstellen, Kontakt aufnehmen) ist ohnehin kein Vertragsschluss im elektronischen Geschäftsverkehr. Die Online-Buchung läuft über ein externes Tool (Zeeg); für dessen Barrierefreiheit ist in erster Linie der Anbieter zuständig.
- **Trotzdem lohnt sich WCAG 2.2 AA:** Die Seite wird für mehr Menschen nutzbar (auch ältere Menschen, Menschen mit Sehschwäche oder am Handy in der Sonne), Suchmaschinen verstehen sie besser, und sollte das Geschäft wachsen, ist die Grundlage schon da.
- Eine **Barrierefreiheitserklärung** ist für Kleinstunternehmen nicht vorgeschrieben. Freiwillig kann eine kurze Seite „Barrierefreiheit“ mit Kontaktmöglichkeit für Hinweise sinnvoll sein – `TODO(Lea)`: entscheiden, ob gewünscht.
