# Peterlings Nutrition – Neuplanung der Website

Stand: November 2026 · Ausgangslage: Commit `435ec17` („Add files via upload“)

Dieses Dokument ist der Fahrplan, um die Website strukturiert weiterzubauen. Es beschreibt den Ist-Zustand, die offenen Entscheidungen, eine Zielstruktur und die Arbeitspakete in sinnvoller Reihenfolge. Die Checkboxen werden beim Abarbeiten abgehakt.

---

## Stand (16.11.2026)

Die Website ist technisch fertig gebaut. Was fehlt, sind fast nur noch **Inhalte und Entscheidungen von Lea** – überall dort steht im Code `TODO(Lea)`.

| Issue              | Thema                                                      | Stand                                                                              |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| #7–#10, #17, #18   | Fundament (Astro, Tokens, Fonts, Layout, CI)               | ✅ fertig                                                                          |
| #11–#16            | Startseite, Leistungen, Über mich, Kontakt, 404, Attrappen | ✅ fertig                                                                          |
| #19, #23           | „du“, Formulierungsleitfaden, Textprüfung                  | ✅ fertig (`docs/textpruefung*.md`)                                                |
| #29, #30, #31, #33 | SEO, Barrierefreiheit, Lighthouse, Favicon                 | ✅ fertig (`docs/barrierefreiheit.md`, `docs/qualitaet.md`)                        |
| #34, #37           | Wissen/Rezepte-Blog, FAQ                                   | ✅ gebaut – Beispielbeiträge sind Entwürfe, FAQ-Antworten teils `TODO(Lea)`        |
| #20                | Echte Texte, Leistungen, Preise                            | ⏳ wartet auf Lea – Fragebogen: `docs/inhalte-von-lea.md`                          |
| #21, #22           | Fotos, Kundenstimmen                                       | ⏳ wartet auf Lea – Technik fertig, Inhalte fehlen                                 |
| #24                | Impressum, Datenschutz                                     | ⏳ Vorlage fertig – Daten von Lea + rechtliche Prüfung nötig                       |
| #25, #26, #28      | Buchungstool, /termin, Testplan                            | ⏳ Seite fertig – Konto bei Zeeg anlegen (`docs/buchungstool.md`), dann testen     |
| #27                | Kontaktformular                                            | ⏳ Formular fertig – Formular-Dienst wählen (`docs/kontaktformular.md`)            |
| #32                | Hosting & Domain                                           | ⏳ `netlify.toml` fertig – Konto + Domain einrichten (`docs/hosting.md`)           |
| #35, #36           | Newsletter, Statistik                                      | ⏳ eingebaut, aber aus – Dienst wählen (`docs/newsletter.md`, `docs/statistik.md`) |

Prüfungen: `npm run check:links` und `npm run check:a11y` (lokal, mit Playwright).

## 1. Ist-Zustand (Ausgangslage)

Das Repository enthält einen **klickbaren Mobile-Prototyp**, noch keine einsatzfähige Website:

| Datei              | Inhalt                                                                                                  | Zustand                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `index.html`       | Startseite: Hero mit Lea Petruschka, Über-mich-Teaser, 3 Leistungen, 1 Kundenstimme, Newsletter, Footer | Optik fertig, Funktionen sind Attrappen                           |
| `services.html`    | 3 Pakete mit Preisen (89 €, 129 €, 69 €), Tab „Preise/Übersicht“                                        | Tabs ohne Funktion                                                |
| `booking.html`     | Kalender (fest: Oktober 2024), Uhrzeiten, Formular, Kundenstimmen, „Jetzt verbindlich buchen“           | Reine Demo (`alert(...)`), nichts wird gespeichert oder versendet |
| `start_server.ps1` | Lokaler Webserver für Windows/PowerShell                                                                | Funktioniert nur unter Windows                                    |

### Festgestellte Probleme

**Technik & Struktur**

- Tailwind wird über das Play-CDN (`cdn.tailwindcss.com`) geladen – laut Tailwind ausdrücklich nicht für den Produktivbetrieb gedacht (langsam, Layoutsprung beim Laden).
- Jede Seite hat ihre **eigene Tailwind-Konfiguration** mit unterschiedlichem Grün: `#8fae90` (Start), `#7ba37b` (Leistungen), `#8ca68e` (Buchung).
- Header, Navigation und Footer sind auf jeder Seite von Hand kopiert und **weichen voneinander ab** (Start: „Start/Termine/Wissen/Profil“, Leistungen: „Home/Pakete/Rezepte/Profil“, Buchung: keine Navigation).
- Layout ist fest auf Handybreite (`max-w-md`) – auf dem Desktop wirkt die Seite wie eine schmale Spalte.
- Bilder werden direkt von `lh3.googleusercontent.com/aida-public/...` geladen (vermutlich aus einem KI-Design-Tool). Diese Links können jederzeit verschwinden, und das Porträt ist nicht Lea selbst.
- Navigation über `onclick="window.location.href=..."` auf Buttons statt echter Links (schlecht für Barrierefreiheit und SEO).
- Doppelter `<style>`-Block in `index.html`, Copyright „2024“.

**Inhalte**

- Ansprache uneinheitlich: Startseite „Sie“, Leistungen und Buchung „du“.
- Preise widersprechen sich: Buchung zeigt 75 €, Einzelberatung kostet 89 €.
- Leistungen auf der Startseite (Darmgesundheit, Stoffwechsel, Mentale Klarheit) passen nicht zu den Paketen auf der Leistungsseite.
- Kundenstimmen sind Platzhalter (z. B. „Sarah Jenkins, Marathonläuferin“).
- Tote Elemente: Profil, Rezepte, „…“-Menüs, Social-Icons, Newsletter, „Kostenloses Kennenlerngespräch“-Link, Kalenderpfeile.

**Rechtliches (Deutschland) – vor einem Livegang zwingend**

- Kein **Impressum** und keine **Datenschutzerklärung** (Links zeigen auf `#`).
- **Google Fonts** werden von Google-Servern geladen → ohne Einwilligung datenschutzrechtlich angreifbar; Schriften lokal einbinden.
- Buchungsformular fragt Gesundheitsziele ab → das sind **Gesundheitsdaten** (Art. 9 DSGVO), die besonders geschützt werden müssen.
- Erfundene Kundenstimmen sind als Werbung unzulässig – nur echte Stimmen mit Einwilligung verwenden.
- Heilversprechen vermeiden (z. B. „Endlich konnte ich meine Darmprobleme lösen“) – Heilmittelwerbegesetz beachten; Berufsbezeichnung „Therapeutin“ prüfen.

**Fazit:** Das Design ist eine gute Grundlage (ruhiges Salbeigrün, Manrope, klare Karten). Es lohnt sich, die Optik zu behalten, aber den Code auf ein sauberes Fundament zu stellen statt die drei Dateien weiter zu flicken.

---

## 2. Entscheidungen

Entschieden (November 2026): Es gelten die fett markierten Empfehlungen. Ansprache: **„du“**. Offen sind nur noch Hosting/Domain (Meilenstein 4) und die Inhalte von Lea (Meilenstein 2).

1. **Ziel der Website** – Visitenkarte + Terminanfrage, oder auch Wissen/Rezepte-Bereich und Kundenkonto („Profil“)?
   → **Phase 1: Visitenkarte + Terminbuchung. Rezepte/Blog später. Kundenkonto streichen** (hoher Aufwand, Datenschutzrisiko, wenig Nutzen).
2. **Technik** – weiter reines HTML oder ein Generator für statische Seiten?
   → **Astro + Tailwind (Build-Version)**: wiederverwendbare Bausteine (Header, Footer, Navigation), eine zentrale Farbdefinition, Inhalte als Markdown, Ausgabe bleibt schnelles statisches HTML.
3. **Terminbuchung** – eigener Kalender oder fertiges Tool?
   → **Fertiges Tool einbetten** (z. B. Cal.com, SimplyBook.me oder Calendly; bevorzugt mit EU-Hosting und AV-Vertrag). Alternativ als Minimalvariante ein Anfrageformular, Lea bestätigt den Termin per Mail.
4. **Hosting & Domain** – wo läuft die Seite, welche Domain?
   → **Netlify oder Cloudflare Pages** (kostenlos, automatische Veröffentlichung aus GitHub) bzw. ein deutscher Hoster, falls gewünscht.
5. **Ansprache** – „du“ oder „Sie“? → Einheitlich festlegen (Zielgruppe entscheidet).
6. **Inhalte von Lea** – echte Fotos, Werdegang/Qualifikationen, finale Leistungen und Preise, Kontaktdaten, Praxisadresse bzw. Online-Beratung, Krankenkassen-Bezuschussung (§ 20 SGB V) ja/nein.

---

## 3. Zielbild

### Seitenstruktur (Phase 1)

| Seite                      | Zweck                                                   |
| -------------------------- | ------------------------------------------------------- |
| Start (`/`)                | Wer, was, für wen – mit klarem Aufruf „Termin buchen“   |
| Leistungen (`/leistungen`) | Pakete, Ablauf, Preise, FAQ                             |
| Über mich (`/ueber-mich`)  | Lea, Qualifikationen, Arbeitsweise                      |
| Termin (`/termin`)         | Eingebettetes Buchungstool oder Anfrageformular         |
| Kontakt (`/kontakt`)       | Adresse, E-Mail, Telefon, ggf. Karte (mit Einwilligung) |
| Impressum, Datenschutz     | Pflichtseiten                                           |
| 404                        | Fehlerseite                                             |

Später (Phase 2): Wissen/Rezepte als Blog, Newsletter.

### Ordnerstruktur (Astro)

```
peterlings-nutrition/
├── src/
│   ├── layouts/BaseLayout.astro      # <head>, SEO-Meta, Header, Footer
│   ├── components/                   # Header, MobileNav, Footer, ServiceCard, Testimonial, CTA …
│   ├── pages/                        # index, leistungen, ueber-mich, termin, kontakt, impressum, datenschutz, 404
│   ├── content/                      # Leistungen, Kundenstimmen, (später) Rezepte als Markdown/JSON
│   └── styles/global.css             # Tailwind + Design-Tokens
├── public/
│   ├── fonts/                        # Manrope + Material Symbols lokal
│   └── images/                       # eigene, optimierte Bilder
├── legacy/                           # die bisherigen 3 HTML-Dateien als Referenz
├── .github/workflows/                # Build-Prüfung
├── PLANUNG.md
└── README.md
```

### Design-System (aus dem Prototyp übernommen, vereinheitlicht)

- **Primärfarbe:** ein Salbeigrün festlegen (Vorschlag `#7ba37b`, dunkel `#5a7a5a`) – Kontrast für Text auf Weiß prüfen (WCAG AA), ggf. dunklere Variante für Schrift.
- **Schrift:** Manrope (lokal), Icons: nur Material Symbols statt zwei Icon-Sets.
- **Layout:** Mobile-first, aber echte Desktop-Ansicht (Navigation oben, mehrspaltige Inhalte); untere Tab-Leiste nur auf dem Handy.
- **Dark Mode:** vorerst weglassen oder automatisch über Systemeinstellung – nicht halb umgesetzt lassen.

---

## 4. Arbeitspakete

### Meilenstein 0 – Aufräumen & Fundament

- [x] Bisherige HTML-Dateien nach `legacy/` verschieben (als Design-Referenz)
- [x] Astro-Projekt mit Tailwind anlegen, `README.md` mit Startanleitung (`npm install`, `npm run dev`) – ersetzt `start_server.ps1`
- [x] Design-Tokens zentral definieren (Farben, Radien, Schrift)
- [x] Manrope und Material Symbols lokal einbinden
- [x] `BaseLayout` mit Header, Footer, mobiler Navigation – **eine** Navigation für alle Seiten
- [x] `.gitignore`, Prettier, GitHub-Action, die bei jedem Push den Build prüft

### Meilenstein 1 – Seiten nachbauen

- [ ] Startseite aus `legacy/index.html` übertragen, responsive für Desktop
- [ ] Leistungsseite aus `legacy/services.html`, Leistungen als Daten (eine Quelle für Start- und Leistungsseite)
- [ ] Über-mich-Seite
- [ ] Kontaktseite
- [ ] 404-Seite
- [ ] Alle Attrappen entfernen oder funktionsfähig machen (Profil, Rezepte, „…“-Menüs, Tabs)

### Meilenstein 2 – Inhalte & Recht

- [ ] Ansprache vereinheitlichen
- [ ] Echte Texte, Leistungen und Preise von Lea einpflegen (Preis-Widerspruch 75 €/89 € auflösen)
- [ ] Eigene Fotos (Porträt, Praxis/Food), komprimiert als WebP/AVIF
- [ ] Platzhalter-Kundenstimmen durch echte ersetzen oder Bereich vorerst entfernen
- [ ] Texte auf Heilversprechen prüfen, Berufsbezeichnung klären
- [ ] Impressum und Datenschutzerklärung (z. B. mit Generator von eRecht24 o. Ä., Dienste wie Buchungstool/Hosting aufnehmen)

### Meilenstein 3 – Terminbuchung & Kontakt

- [ ] Buchungstool auswählen und Konto einrichten (Leistungen, Dauer, Preise, Verfügbarkeiten)
- [ ] Auf `/termin` einbetten – erst nach Einwilligung laden (Zwei-Klick-Lösung) oder als Link
- [ ] Alternativ/zusätzlich Kontaktformular (z. B. Netlify Forms, Formspree) mit Datenschutzhinweis, ohne unnötige Gesundheitsdaten
- [ ] Buchungs- und Bestätigungsmails testen

### Meilenstein 4 – Qualität & Livegang

- [ ] SEO: Titel/Beschreibung je Seite, Open-Graph-Bild, `sitemap.xml`, `robots.txt`, strukturierte Daten (`LocalBusiness`)
- [ ] Barrierefreiheit: echte Links statt `onclick`, Alt-Texte, Fokus-Stile, Kontrast, Formular-Labels
- [ ] Lighthouse-Check (Ziel: ≥ 90 in allen Kategorien), Test auf Handy und Desktop
- [ ] Hosting einrichten, Domain verbinden, HTTPS
- [ ] Favicon, Social-Media-Links (nur echte Profile)

### Meilenstein 5 – Ausbau (nach dem Livegang)

- [ ] Bereich „Wissen/Rezepte“ als Blog mit Markdown-Beiträgen
- [ ] Newsletter mit Double-Opt-in (z. B. Brevo, CleverReach)
- [ ] Datenschutzfreundliche Besucherstatistik (z. B. Plausible, ohne Cookies)
- [ ] Optional: Hinweis auf Krankenkassen-Zuschuss, FAQ erweitern

---

## 5. Arbeitsweise

- **Ein Meilenstein nach dem anderen**, jeweils auf eigenem Branch, Zusammenführung über Pull Request.
- Jedes Arbeitspaket ist ein GitHub-Issue. Je Meilenstein gibt es ein Sammel-Issue (#1–#6) mit den Einzelaufgaben als Sub-Issues und ein Label `meilenstein-N`.
- Inhalte (Texte, Preise, Kundenstimmen) liegen getrennt vom Layout in `src/content/`, damit sie ohne Code-Kenntnisse angepasst werden können.

**Nächster konkreter Schritt:** Meilenstein 1 – Seiten nachbauen.
