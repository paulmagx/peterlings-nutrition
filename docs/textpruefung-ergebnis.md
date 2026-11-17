# Ergebnis der abschließenden Textprüfung

Bezug: Issue #19 („Ansprache auf ‚du‘ vereinheitlichen“), erweitert um die Prüfung nach dem Formulierungsleitfaden aus `docs/textpruefung.md` (Issue #23). Stand: November 2026.

Geprüft wurden alle sichtbaren Texte in `src/pages/**`, `src/components/**`, `src/data/**` und `src/content/**` (ohne `legacy/` und `docs/`). Geändert wurden nur Texte, keine Struktur oder Gestaltung.

> Auch dieses Ergebnis ist **keine Rechtsberatung**. Impressum und Datenschutzerklärung bleiben Vorlagen und müssen vor dem Livegang rechtlich geprüft werden.

## Befund in Kürze

- **Ansprache:** Es gab keine „Sie/Ihr“-Anrede mehr in den neuen Seiten. Die gefundenen „Sie“ beziehen sich auf Sachen („Diese Website … Sie verwendet“, „Ballaststoffe … Sie gehören“) und sind korrekt.
- **Ich-Perspektive:** Drei Stellen sprachen von „unsere Leistungen“ bzw. „Unsere Leistungen“ (Screenreader-Label) – jetzt „meine“. Alle übrigen „wir“ meinen die Kundin bzw. den Kunden und Lea gemeinsam und bleiben.
- **Leitfaden:** „Anamnese“, „gesundheitliche Voraussetzungen“, „Wissenschaftlich“ (als unbelegtes Qualitätssiegel) und eine Wirkungsaussage („damit du dich in deinem Körper wohler fühlst“) ersetzt.
- **Unbelegte Tatsachen:** AV-Vertrag mit Zeeg, Logfile-Auswertung durch den Hoster, „vor Ort und online“, Verweise auf nicht vorhandene Angaben (Dauer, Formate bei den Leistungen) und „Erstgespräch“ (es gibt keine solche Leistung) korrigiert oder als `TODO(Lea)` markiert.
- **Begriffe:** Buttons zu `/termin` heißen jetzt überall „Termin buchen“; Leistungsnamen in der Seitenbeschreibung wie in `src/data/services.ts`; „Leistung“ statt „Paket“/„Angebot“ in der Auswahlhilfe.

## Änderungen

Kategorien: **A** = Ansprache, **I** = Ich-Perspektive, **L** = Formulierungsleitfaden, **T** = unbelegte Tatsachenbehauptung, **B** = einheitliche Begriffe, **R** = Rechtschreibung/Typografie/juristische Präzision.

| #   | Datei                                   | Vorher                                                                                                                                      | Nachher                                                                                                                                                                                             | Kat. | Grund                                                                                                                     |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/data/services.ts`                  | „Anamnese und Status quo“                                                                                                                   | „Kennenlernen und Ist-Stand“                                                                                                                                                                        | L    | „Anamnese“ ist ein ärztlicher Diagnostik-Begriff (Leitfaden).                                                             |
| 2   | `src/data/services.ts`                  | „… deine Essgewohnheiten, deine Ziele und deine gesundheitlichen Voraussetzungen und finden deinen Weg.“                                    | „… deine Essgewohnheiten, deinen Alltag und deine Ziele und finden einen Weg, der zu dir passt.“                                                                                                    | L    | „Gesundheitliche Voraussetzungen“ klingt nach Befunderhebung (Fundstellen-Tabelle `services.html`).                       |
| 3   | `src/data/services.ts`                  | „Zieldefinition“                                                                                                                            | „Ziele gemeinsam festlegen“                                                                                                                                                                         | L    | Verständlicher, beschreibt, was Lea tut.                                                                                  |
| 4   | `src/data/services.ts`                  | „Einzelberatung (60 Min)“ / Kommentar „TODO(Lea): Preis bestätigen“                                                                         | „Einzelberatung (60 Min.)“ / Kommentar „TODO(Lea): Preis und Dauer (60 Min.) bestätigen; Preise als Endpreise (ggf. inkl. USt)“                                                                     | R, T | Abkürzungspunkt; Dauer ist noch nicht bestätigt (vgl. FAQ-TODO), Preisangabe muss Endpreis sein (PAngV).                  |
| 5   | `src/data/site.ts`                      | „… – alltagstauglich, wissenschaftlich fundiert und ganzheitlich.“                                                                          | „… – alltagstauglich, persönlich und ganzheitlich.“                                                                                                                                                 | L    | „Wissenschaftlich fundiert“ ist ohne Beleg ein Qualitätssiegel (Leitfaden: nur mit konkreter Quelle wie DGE).             |
| 6   | `src/data/site.ts`                      | Kommentar „Beratung vor Ort, online oder beides – mit Lea klären.“                                                                          | „TODO(Lea): Beratung vor Ort, online oder beides? Bitte bestätigen …“                                                                                                                               | T    | Wird auf Start- und Kontaktseite als Tatsache angezeigt; offener Punkt war nicht als `TODO(Lea)` auffindbar.              |
| 7   | `src/data/booking.ts`                   | Kommentar „Laut Zeeg: Telekom-Rechenzentrum in Deutschland … – mit dem AVV abgleichen.“                                                     | „TODO(Lea): Serverstandort mit dem AVV abgleichen. …“                                                                                                                                               | T    | Serverstandort erscheint im Zwei-Klick-Hinweis und in der Datenschutzerklärung, ist aber noch nicht belegt.               |
| 8   | `src/data/faq.ts`                       | „… Welche Möglichkeiten es gibt, siehst du bei den einzelnen Leistungen. Wenn du dir unsicher bist, schreib mir einfach kurz.“              | „Das hängt vom Angebot ab. Schreib mir einfach kurz, dann sage ich dir, welche Möglichkeiten es für dein Anliegen gibt.“                                                                            | T    | Die Leistungskarten nennen gar kein Format – Verweis lief ins Leere.                                                      |
| 9   | `src/data/faq.ts`                       | „Die Dauer steht bei der jeweiligen Leistung. Lass dir für das Gespräch in Ruhe Zeit, wir hetzen nicht.“                                    | „Das hängt von der Leistung ab. Plane dir für das Gespräch genug Zeit ein, damit wir in Ruhe sprechen können.“                                                                                      | T    | Nur eine von drei Leistungen nennt eine Dauer; Aussage war falsch.                                                        |
| 10  | `src/data/faq.ts`                       | „… welche Qualifikation die Beraterin nachweisen kann.“                                                                                     | „… welche Qualifikation nachgewiesen werden kann.“                                                                                                                                                  | B    | Neutral statt einseitig weiblich in einer allgemeinen Aussage; Leas Qualifikation ist ohnehin noch offen.                 |
| 11  | `src/components/ServiceCard.astro`      | Button „Jetzt anfragen“                                                                                                                     | „Termin buchen“                                                                                                                                                                                     | B    | Button führt zu `/termin` bzw. zum Buchungslink; einheitlich mit Header und Startseite.                                   |
| 12  | `src/components/NewsletterSignup.astro` | Einwilligungstext „ca. einmal im Monat“ ohne Hinweis                                                                                        | Kommentar „TODO(Lea): Versandhäufigkeit … bestätigen“                                                                                                                                               | T    | Häufigkeit ist Teil der Einwilligung und muss stimmen (Komponente ist noch ausgeschaltet).                                |
| 13  | `src/pages/index.astro`                 | Meta-Beschreibung „… auf Augenhöhe – vor Ort und online.“                                                                                   | „… auf Augenhöhe.“                                                                                                                                                                                  | T    | Beratungsformate sind noch nicht bestätigt.                                                                               |
| 14  | `src/pages/index.astro`                 | „Im Erstgespräch schauen wir gemeinsam …“                                                                                                   | „Im ersten Termin schauen wir gemeinsam …“                                                                                                                                                          | T, B | Ein eigenes Erstgespräch gibt es (noch) nicht als Leistung; einheitlich mit FAQ „Wie läuft der erste Termin ab?“.         |
| 15  | `src/pages/leistungen.astro`            | Meta „Einzelberatung, individuelle Ernährungspläne und Einkaufstraining …“                                                                  | „Einzelberatung, individuelle Ernährungspläne sowie Einkaufstraining und Kühlschrank-Check …“                                                                                                       | B    | Leistungsname wie in `services.ts`.                                                                                       |
| 16  | `src/pages/leistungen.astro`            | „Professionelle Begleitung für deine Ernährung und deinen Lebensstil, mit Lea Petruschka.“                                                  | „Persönliche Begleitung für deine Ernährung und deinen Lebensstil – mit Lea Petruschka.“                                                                                                            | L, R | Unbelegte Qualitätsbehauptung vermieden; Gedankenstrich statt Komma.                                                      |
| 17  | `src/pages/leistungen.astro`            | `aria-label="Unsere Leistungen"`                                                                                                            | `aria-label="Meine Leistungen"`                                                                                                                                                                     | I    | Lea spricht als „ich“.                                                                                                    |
| 18  | `src/pages/leistungen.astro`            | Schritt „Anfrage – Du schickst mir deine Anfrage und sagst kurz, worum es dir geht.“                                                        | „Termin buchen – Du buchst einen Termin oder schreibst mir kurz, worum es dir geht.“                                                                                                                | B    | Passt zum Buchungsweg über `/termin`.                                                                                     |
| 19  | `src/pages/leistungen.astro`            | „Nicht sicher, welches Paket passt?“                                                                                                        | „Nicht sicher, welche Leistung passt?“                                                                                                                                                              | B    | Einheitlicher Begriff „Leistung“.                                                                                         |
| 20  | `src/pages/leistungen.astro`            | „… welches Angebot für dich sinnvoll ist.“                                                                                                  | „… welche Leistung für dich sinnvoll ist.“                                                                                                                                                          | B    | Wie oben.                                                                                                                 |
| 21  | `src/pages/404.astro`                   | „… über die Startseite oder unsere Leistungen …“                                                                                            | „… über die Startseite oder meine Leistungen …“                                                                                                                                                     | I    | Ich-Perspektive.                                                                                                          |
| 22  | `src/pages/ueber-mich.astro`            | „Wissenschaftlich – Was ich dir empfehle, stützt sich auf aktuelle Erkenntnisse der Ernährungswissenschaft. …“                              | „Fundiert – Ich orientiere mich an anerkannten Empfehlungen der Ernährungswissenschaft …“ + `TODO(Lea)` (DGE nennen, falls zutreffend)                                                              | L, T | Leitfaden: „Wissenschaftlich“ nur mit belegbarer Grundlage.                                                               |
| 23  | `src/pages/ueber-mich.astro`            | „Meine Mission: komplexe wissenschaftliche Erkenntnisse in alltagstaugliche … zu übersetzen, damit du dich in deinem Körper wohler fühlst.“ | „Mein Ziel: Ernährungswissen so zu übersetzen, dass daraus alltagstaugliche und genussvolle Gewohnheiten werden, die zu dir passen.“                                                                | L    | Wirkungsversprechen über den Körper ersetzt; beschreibt, was Lea tut.                                                     |
| 24  | `src/pages/ueber-mich.astro`            | „… Eine ärztliche Behandlung ersetze ich nicht.“                                                                                            | „… Meine Beratung ersetzt keine ärztliche Behandlung.“                                                                                                                                              | R    | Klarere, übliche Formulierung (wie FAQ und Wissen-Beiträge).                                                              |
| 25  | `src/pages/ueber-mich.astro`            | „Dieser Bereich wird vor dem Livegang von Lea ergänzt.“                                                                                     | „Diesen Bereich ergänze ich in Kürze.“                                                                                                                                                              | I    | Lea sprach hier in der dritten Person; interner Begriff „Livegang“ entfernt.                                              |
| 26  | `src/pages/ueber-mich.astro`            | „Lass uns kennenlernen“                                                                                                                     | „Lernen wir uns kennen“                                                                                                                                                                             | R    | „kennenlernen“ braucht ein Objekt („uns“).                                                                                |
| 27  | `src/pages/ueber-mich.astro`            | „Im Erstgespräch schauen wir gemeinsam …“                                                                                                   | „Im ersten Termin schauen wir gemeinsam …“                                                                                                                                                          | T, B | Wie Nr. 14.                                                                                                               |
| 28  | `src/pages/ueber-mich.astro`            | Button „Termin vereinbaren“                                                                                                                 | „Termin buchen“                                                                                                                                                                                     | B    | Einheitlicher Button-Text.                                                                                                |
| 29  | `src/pages/impressum.astro`             | „gemäß § 27 a Umsatzsteuergesetz“                                                                                                           | „gemäß § 27a Umsatzsteuergesetz (UStG)“                                                                                                                                                             | R    | Korrekte Paragrafenschreibweise.                                                                                          |
| 30  | `src/pages/impressum.astro`             | „TODO(Lea): Bestätigen, dass du nicht an Schlichtungsverfahren teilnehmen möchtest …“                                                       | „… teilnehmen möchtest und dazu nicht verpflichtet bist …“                                                                                                                                          | T    | Der Text behauptet beides („nicht bereit und nicht verpflichtet“) – beides muss bestätigt werden.                         |
| 31  | `src/pages/datenschutz.astro`           | „… Sie verwendet keine Cookies, kein Tracking …“                                                                                            | „… Sie selbst verwendet keine Cookies, kein Tracking …“                                                                                                                                             | R    | Juristisch präzise: Karte und Buchungskalender (nach Klick) sind Dritte.                                                  |
| 32  | `src/pages/datenschutz.astro`           | „Eine Datenschutzbeauftragte ist nicht bestellt, da hierzu keine gesetzliche Pflicht besteht.“                                              | „Eine Datenschutzbeauftragte bzw. ein Datenschutzbeauftragter ist nicht benannt.“ + TODO ergänzt                                                                                                    | T, R | Begründung war unbelegt (TODO darunter stellt genau das in Frage); Begriff „benennen“ wie Art. 37 DSGVO.                  |
| 33  | `src/pages/datenschutz.astro`           | „Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und nicht ausgewertet …“                                                 | „Ich führe diese Daten nicht mit anderen Datenquellen zusammen und werte sie nicht aus …“ + TODO (prüfen, ob der Hoster auswertet)                                                                  | T, I | Lea kann nur für sich selbst sprechen, der Hoster steht noch nicht fest.                                                  |
| 34  | `src/pages/datenschutz.astro`           | –                                                                                                                                           | Neuer TODO-Block: Abschnitt Kontaktformular ergänzen, sobald freigeschaltet                                                                                                                         | T    | Laut `docs/kontaktformular.md` muss der Formular-Dienst in der Datenschutzerklärung stehen.                               |
| 35  | `src/pages/datenschutz.astro`           | –                                                                                                                                           | Neuer TODO-Block: Angemessenheitsbeschluss Vereinigtes Königreich vor dem Livegang prüfen                                                                                                           | T    | Befristeter Beschluss, Tatsachenbehauptung muss zum Veröffentlichungszeitpunkt stimmen.                                   |
| 36  | `src/pages/datenschutz.astro`           | Karte: „… widerrufen, indem du die Karte nicht erneut lädst.“                                                                               | „… widerrufen, indem du die Seite neu lädst; die Karte wird dann erst nach einem erneuten Klick wieder geladen.“                                                                                    | R    | Widerrufsweg präzise und einheitlich mit dem Buchungskalender.                                                            |
| 37  | `src/pages/datenschutz.astro`           | „Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.“                                                         | Satz entfernt; TODO: „AVV abschließen. Erst danach hier ergänzen: ‚Mit dem Anbieter habe ich einen Vertrag … geschlossen.‘“                                                                         | T    | AV-Vertrag mit Zeeg ist noch nicht geschlossen.                                                                           |
| 38  | `src/pages/datenschutz.astro`           | Kalender: „Du kannst sie jederzeit widerrufen, indem du die Seite neu lädst.“                                                               | „Du kannst sie jederzeit mit Wirkung für die Zukunft widerrufen, indem du die Seite neu lädst; der Kalender wird dann erst nach einem erneuten Klick wieder geladen.“                               | R    | Art. 7 Abs. 3 DSGVO: Widerruf wirkt für die Zukunft.                                                                      |
| 39  | `src/pages/datenschutz.astro`           | „Über diese Website selbst werden keine Gesundheitsdaten erhoben.“                                                                          | „Über diese Website frage ich keine Gesundheitsdaten ab.“                                                                                                                                           | T    | Freitextfelder (Kontakt, Buchung) können Gesundheitsangaben enthalten; ausschließen lässt sich nur das gezielte Abfragen. |
| 40  | `src/pages/datenschutz.astro`           | TODO „… schriftlich vor dem Erstgespräch …“                                                                                                 | „… schriftlich vor dem ersten Termin …“                                                                                                                                                             | B    | Wie Nr. 14.                                                                                                               |
| 41  | `src/pages/datenschutz.astro`           | „Diese Website setzt keine Cookies …“                                                                                                       | „Diese Website selbst setzt keine Cookies … Lädst du per Klick die Karte oder den Buchungskalender, gelten dafür die Datenschutzbestimmungen des jeweiligen Anbieters …“                            | T, R | Nach Einwilligung können Dritte Cookies setzen; die pauschale Aussage war zu weit.                                        |
| 42  | `src/pages/datenschutz.astro`           | Widerspruch: „… es sei denn, es liegen zwingende schutzwürdige Gründe für die Verarbeitung vor.“                                            | „… es sei denn, ich kann zwingende schutzwürdige Gründe nachweisen, die deine Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung … von Rechtsansprüchen.“ | R    | Wortlaut von Art. 21 Abs. 1 DSGVO.                                                                                        |

### Anzahl je Kategorie

Mehrfachzuordnungen werden in jeder Kategorie gezählt.

| Kategorie                                    | Anzahl |
| -------------------------------------------- | ------ |
| A – Ansprache „du“                           | 0      |
| I – Ich-Perspektive                          | 4      |
| L – Formulierungsleitfaden                   | 7      |
| T – Unbelegte Tatsachenbehauptungen          | 18     |
| B – Einheitliche Begriffe                    | 10     |
| R – Rechtschreibung/Typografie/Rechtssprache | 11     |

## Bewusst nicht geändert

- **„Sie“ als Pronomen für Sachen** (Website, Ballaststoffe, Statistik-Kommentar) – grammatisch korrekt, keine Anrede.
- **„wir“ für Kundin/Kunde und Lea gemeinsam** („Wir schauen gemeinsam …“, „darüber sprechen wir im Termin“, „wählen wir Veränderungen“) – gewollt.
- **„Termin per Nachricht anfragen“** auf `/termin`: Dort ist die Online-Buchung noch nicht eingerichtet, es wird wirklich nur angefragt.
- **Preise 89 €, 129 €, 69 €** bleiben sichtbar, sind aber weiterhin mit `TODO(Lea)` markiert (siehe unten). Ohne Strukturänderung an `ServiceCard` lässt sich kein Platzhaltertext anzeigen.
- **„Ganzheitlich“** – kein Siegel und keine Wirkungsaussage; die Kachel auf „Über mich“ erklärt es konkret (Alltag, Bewegung, Stress, Schlaf).

## Hinweis außerhalb der Textprüfung

In `src/data/booking.ts` heißt die Leistung im Typ `BookingService` `"ernaehrungsplan"`, in `src/data/services.ts` ist die `id` aber `"ernaehrungsplaene"`. Die Direktlinks je Leistung (`serviceUrls`) würden für die Ernährungspläne deshalb nicht greifen. Das ist Code, nicht Text, und wurde hier nicht geändert.

## Verbleibende `TODO(Lea)`-Stellen

### Startseite (`src/pages/index.astro`)

- Titelbild als `src/assets/images/hero.jpg` ablegen.
- Porträtfoto als `src/assets/images/portrait.jpg` ablegen.
- Beratungsformate (vor Ort / online) bestätigen – Kachel kommt aus `src/data/site.ts`.

### Leistungen (`src/pages/leistungen.astro`, `src/data/services.ts`, `src/data/faq.ts`)

- Preise aller drei Leistungen bestätigen (Endpreise, ggf. inkl. USt) – Widerspruch 75 € / 89 € aus dem Prototyp klären.
- Dauer der Einzelberatung (60 Min.) und der übrigen Leistungen bestätigen.
- Ablauf der Beratung (drei Schritte) prüfen.
- Gibt es ein kostenloses Kennenlerngespräch? Falls ja, in der Auswahlhilfe erwähnen.
- FAQ: Ablauf des ersten Termins (Fragebogen, Zusammenfassung).
- FAQ: Unterlagen/Fragebogen vorab.
- FAQ: Format je Leistung (vor Ort, online, beides) und Praxisort.
- FAQ: Zahlungsarten und Rechnungsstellung.
- FAQ: Absagefrist und Kosten bei kurzfristiger Absage.
- FAQ: Krankenkassenzuschuss (Qualifikation, ZPP-Zertifizierung, Rechnung).
- Direktlinks je Leistung zu Zeeg (`src/data/booking.ts`).

### Termin buchen (`src/pages/termin.astro`, `src/data/booking.ts`)

- Absagehinweis ergänzen.
- Zeeg-Buchungslink und Inline-Embed-URL eintragen.
- Serverstandort mit dem AVV abgleichen (Deutschland/Niederlande).

### Über mich (`src/pages/ueber-mich.astro`)

- Porträtfoto ablegen.
- „Fundiert“: Falls zutreffend, Grundlage konkret nennen (z. B. Empfehlungen der DGE).
- Sichtbare Platzhalter: Ausbildung/Studium, Zertifizierungen und Weiterbildungen, Berufserfahrung, Schwerpunkte.

### Kontakt (`src/pages/kontakt.astro`, `src/data/site.ts`, `src/data/forms.ts`)

- E-Mail-Adresse, Telefonnummer, Straße und Hausnummer, PLZ und Ort.
- Kartenausschnitt durch den echten Praxisstandort ersetzen.
- Endpunkt des Kontaktformulars eintragen.
- Beratungsformate (vor Ort / online) bestätigen.
- Social-Media-Profile (nur echte) eintragen.

### Wissen (`src/content/wissen/*.md`)

- „Ballaststoffe im Alltag“: Inhalt prüfen und freigeben (`draft: false`).
- „Overnight Oats“: Inhalt prüfen und freigeben (`draft: false`).

### Impressum (`src/pages/impressum.astro`)

- Berufs- bzw. Firmenbezeichnung.
- Umsatzsteuer-ID oder Hinweis auf Kleinunternehmerregelung (§ 19 UStG).
- Genaue Berufsbezeichnung/Abschluss, Staat der Verleihung, Berufsverband/Kammer – oder Abschnitt entfernen.
- Teilnahme an Verbraucherschlichtung: bestätigen, dass Lea nicht bereit **und** nicht verpflichtet ist – sonst Schlichtungsstelle nennen.
- (Anschrift, E-Mail, Telefon aus `src/data/site.ts`, siehe Kontakt.)

### Datenschutz (`src/pages/datenschutz.astro`)

- Pflicht zur Benennung einer bzw. eines Datenschutzbeauftragten prüfen lassen (Gesundheitsdaten).
- Hosting-Anbieter, Serverstandort, AVV, Drittlandübermittlung, Link zur Datenschutzerklärung.
- Speicherdauer der Logfiles; prüfen, ob der Hoster die Logfiles selbst auswertet.
- E-Mail-Anbieter als Auftragsverarbeiter nennen (falls nötig).
- Abschnitt zum Kontaktformular ergänzen, sobald es freigeschaltet ist.
- Angemessenheitsbeschluss Vereinigtes Königreich (OpenStreetMap) vor dem Livegang prüfen.
- AV-Vertrag mit Zeeg abschließen, erst dann den Satz zum AVV einfügen; Serverstandort abgleichen.
- Speicherdauer der Buchungsdaten; ggf. Videodienst und Online-Zahlung ergänzen.
- Einholung der Einwilligung für Gesundheitsdaten, Speicherort und Aufbewahrungsdauer der Beratungsunterlagen.
- Zuständige Landesdatenschutzbehörde.
- Stand (Monat und Jahr).

### Website-weit, derzeit ausgeschaltet

- Newsletter (`src/data/newsletter.ts`, `src/components/NewsletterSignup.astro`): Dienst, Formular-URL, Versandhäufigkeit bestätigen.
- Besucherstatistik (`src/data/analytics.ts`): Script-URL und Live-Domain.
