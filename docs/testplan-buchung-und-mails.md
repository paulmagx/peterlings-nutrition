# Testplan: Buchung, Bestätigungsmails und Formulare (Issue #28)

Dieser Plan prüft alles, was Besucherinnen sehen und erleben: die Terminbuchung über `/termin`, die Mails des Buchungstools, das Kontaktformular, die Newsletter-Anmeldung, die Zustellbarkeit der Mails und das Layout auf Handy und Desktop.

Geh die Schritte der Reihe nach durch. Hake jeden Schritt ab, trag das Ergebnis in die Spalte **Ergebnis** ein und schreib bei Abweichungen eine kurze Notiz. Bei einem Fehler folgst du dem Abschnitt [Fehler gefunden – was tun?](#fehler-gefunden--was-tun).

**Wichtig:** Teste mit eigenen Test-Adressen (z. B. eine zweite E-Mail-Adresse von dir), nie mit echten Daten von Kundinnen. Stripe und Zahlungen nur im Testmodus. Alle Testbuchungen am Ende im Buchungstool wieder löschen.

---

## Vorbedingungen

Diese Punkte müssen erfüllt sein, bevor du mit den Tests anfängst.

| Nr  | Vorbedingung                                                                                                                                                            | Erledigt |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| V1  | Das Zeeg-Konto ist eingerichtet (Tarif Professional oder Starter zum Testen), Kalender verbunden, Leistungen angelegt (siehe `docs/buchungstool.md`, Abschnitt 4).      | ☐        |
| V2  | Der AV-Vertrag mit Zeeg ist abgeschlossen und abgelegt (Datum notiert).                                                                                                 | ☐        |
| V3  | `src/data/booking.ts`: `bookingUrl` und `embedUrl` stehen auf echten `https://`-Adressen, kein `TODO(Lea)` mehr. Dann zeigt `/termin` den Kalender statt des Hinweises. | ☐        |
| V4  | `src/data/booking.ts`: `serviceUrls` ist für jede Leistung ausgefüllt (sofern genutzt), `serverLocation` stimmt mit dem AV-Vertrag überein.                             | ☐        |
| V5  | `src/data/forms.ts`: `contactFormEndpoint` enthält die echte Formular-URL des Dienstes (nicht mehr `TODO(Lea): …`).                                                     | ☐        |
| V6  | `src/data/newsletter.ts`: Dienst, AV-Vertrag und Datenschutztext sind fertig. `formAction` ist eingetragen und `enabled: true` gesetzt.                                 | ☐        |
| V7  | Dienst im Kontaktformular bzw. Newsletter-Dienst: Empfänger ist Leas E-Mail-Adresse, Dankeseite und Bestätigungsseite sind auf Deutsch eingerichtet.                    | ☐        |
| V8  | Die Seite ist veröffentlicht (Produktionsstand, nicht nur `npm run dev`). Die Adresse ist notiert: `____________________`                                               | ☐        |
| V9  | Die Platzhalter in `src/data/site.ts` (Adresse, Telefon, E-Mail) und in der Datenschutzerklärung sind ersetzt. Impressum ist vollständig.                               | ☐        |
| V10 | Du hast zwei Test-Adressen zur Verfügung: `____________________` (Kundin) und `____________________` (Gmail, Outlook, GMX/Web.de, je nach Test).                        | ☐        |
| V11 | Du hast Zugang zu deinem Kalender (Google, Outlook oder iCloud) und zum Zeeg-Konto.                                                                                     | ☐        |

**Testgeräte:** Notiere, was du nutzt.

| Gerät / Browser                 | Version | Testdatum |
| ------------------------------- | ------- | --------- |
| Desktop: `____________________` |         |           |
| iPhone: `____________________`  |         |           |
| Android: `____________________` |         |           |

---

## Test 1: Terminbuchung über `/termin`

> **Hinweis:** Umbuchen und Absagen (1.8 und 1.9) hängen davon ab, welche Funktionen dein Zeeg-Tarif bietet. Ist eine Funktion nicht verfügbar, notiere das im Ergebnis und prüfe, ob der Text auf `/termin` und in `docs/buchungstool.md` dann angepasst werden muss.

### 1.1 Zwei-Klick-Lösung: vor dem Klick lädt nichts

Ziel: Der Kalender von Zeeg wird erst nach dem Klick geladen (Datenschutz, Art. 6 Abs. 1 lit. a DSGVO und § 25 TDDDG).

| Nr   | Schritt                                                                                                                              | Erwartetes Ergebnis                                                                                                                     | Ergebnis      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.1a | Öffne `/termin` in einem **neuen privaten Fenster**. Öffne die Entwicklerwerkzeuge (F12), Reiter „Netzwerk“, und lade die Seite neu. | Im Reiter „Netzwerk“ taucht **keine** Anfrage an `zeeg.me` oder einen anderen Fremddienst auf. Kein `iframe` von Zeeg im DOM.           | ☐ OK ☐ Fehler |
| 1.1b | Lies den Platzhalter im Kalenderbereich.                                                                                             | Der Platzhalter nennt „Zeeg“, den Serverstandort „Deutschland“ und enthält Links zur Datenschutzerklärung (`/datenschutz`) und zu Zeeg. | ☐ OK ☐ Fehler |
| 1.1c | Klicke auf „Kalender laden“.                                                                                                         | Der Kalender erscheint. Im Netzwerk-Reiter erscheinen jetzt Anfragen an Zeeg. Der Fokus springt auf das neue Fenster.                   | ☐ OK ☐ Fehler |
| 1.1d | Lade die Seite neu.                                                                                                                  | Der Kalender ist wieder weg, der Platzhalter steht erneut da. Das ist so gewollt: Die Einwilligung gilt nur für den einzelnen Aufruf.   | ☐ OK ☐ Fehler |

### 1.2 Buchung je Leistung

Mache diesen Test für **jede Leistung** (Kennenlerngespräch, Einzelberatung, Ernährungsplan, Einkaufstraining). Trag die Leistung hier ein: `____________________`

| Nr   | Schritt                                                                                                                                                      | Erwartetes Ergebnis                                                                                                                                               | Ergebnis      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.2a | Wähle die Leistung im Kalender, dann einen freien Termin.                                                                                                    | Nur freie Zeiten sind wählbar. Belegte Zeiten aus deinem Kalender erscheinen nicht.                                                                               | ☐ OK ☐ Fehler |
| 1.2b | Prüfe Titel, Dauer und Preis.                                                                                                                                | Titel und Dauer stimmen mit `docs/buchungstool.md` (Abschnitt 4.3) und der Leistungsliste auf `/termin` überein. Preis stimmt mit `src/data/services.ts` überein. | ☐ OK ☐ Fehler |
| 1.2c | Fülle das Formular aus. Nur Vorname, Nachname, E-Mail (Test-Adresse), ggf. Telefon und Ort. Setze den Haken bei der Datenschutz-Checkbox. Klicke auf Buchen. | Die Buchung wird abgeschlossen. Eine Bestätigungsseite erscheint (oder es erscheint die Dankesmeldung von Zeeg).                                                  | ☐ OK ☐ Fehler |
| 1.2d | Prüfe die Pflichtfelder: Versuche zu buchen, ohne die Checkbox zu setzen.                                                                                    | Die Buchung wird nicht abgeschickt. Es erscheint ein Hinweis zur Pflichtangabe.                                                                                   | ☐ OK ☐ Fehler |
| 1.2e | Prüfe den Ort: Bei Leistungen mit „vor Ort“ und „online“ kannst du wählen.                                                                                   | Beide Optionen sind verfügbar. Die gewählte Option erscheint in der Bestätigung.                                                                                  | ☐ OK ☐ Fehler |

### 1.3 Bestätigungsmail an die Kundin

Teste mit der Test-Adresse aus V10.

| Nr   | Schritt                                                                                                 | Erwartetes Ergebnis                                                                                                                                                                                                                 | Ergebnis      |
| ---- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.3a | Warte auf die Bestätigungsmail (Posteingang und Spam prüfen). Zeit notieren: `______`                   | Die Mail kommt innerhalb weniger Minuten an.                                                                                                                                                                                        | ☐ OK ☐ Fehler |
| 1.3b | Prüfe **Absender** (Name und Adresse).                                                                  | Der Absendername enthält „Lea Petruschka“ oder „Peterlings Nutrition“. Die Absenderadresse ist eine der in V7 bzw. Test 5 geprüften Adressen. Keine unbekannte Adresse.                                                             | ☐ OK ☐ Fehler |
| 1.3c | Prüfe **Betreff**.                                                                                      | Der Betreff entspricht dem Vorschlag aus `docs/buchungstool.md` (Abschnitt 4.6), z. B. „Dein Termin bei Peterlings Nutrition am {Datum}“. Der Betreff enthält keinen Gesundheitsbezug.                                              | ☐ OK ☐ Fehler |
| 1.3d | Prüfe den **Inhalt**: Anrede „Hallo {Vorname}“, Datum, Uhrzeit, Terminart, Ort bzw. Videolink.          | Alle Angaben sind richtig. Anrede in „du“-Form. Keine Platzhalter wie `{Vorname}` oder `TODO` sichtbar.                                                                                                                             | ☐ OK ☐ Fehler |
| 1.3e | Prüfe **Impressum- und Datenschutzlink** in der Fußzeile der Mail.                                      | Die Mail enthält einen Link zu `/impressum` **oder** die Angaben zum Impressum (Name, Anschrift, E-Mail). Ein Link zu `/datenschutz` ist vorhanden. Falls Zeeg die Fußzeile nicht erlaubt, notiere das hier: `____________________` | ☐ OK ☐ Fehler |
| 1.3f | Prüfe, ob die Mail **keine Gesundheitsdaten** enthält und keine Angaben, die du nicht eingetragen hast. | Es stehen nur die Buchungsdaten darin.                                                                                                                                                                                              | ☐ OK ☐ Fehler |

### 1.4 Benachrichtigung an Lea

| Nr   | Schritt                                  | Erwartetes Ergebnis                                                                                                                                                                    | Ergebnis      |
| ---- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.4a | Prüfe Leas Posteingang (Adresse aus V1). | Eine Benachrichtigung über die neue Buchung ist angekommen, mit Name, Terminart und Zeit. Die Benachrichtigung enthält keine Freitext-Gesundheitsangaben (es gibt keine Felder dafür). | ☐ OK ☐ Fehler |

### 1.5 Kalendereintrag

| Nr   | Schritt                                                          | Erwartetes Ergebnis                                                                                                                      | Ergebnis      |
| ---- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.5a | Öffne deinen verbundenen Kalender (Google, Outlook oder iCloud). | Der Termin steht im Kalender zur richtigen Zeit mit der richtigen Terminart.                                                             | ☐ OK ☐ Fehler |
| 1.5b | Prüfe, ob der Termin im Kalender **Kundinnen-Angaben** enthält.  | Nur die nötigen Angaben (Name, Terminart). Persönliche Daten sind ausgeblendet, wie in `docs/buchungstool.md` (Abschnitt 4.5) empfohlen. | ☐ OK ☐ Fehler |
| 1.5c | Prüfe, ob der Termin **belegte Zeiten** blockiert.               | Derselbe Zeitraum ist im Kalender der Buchungsseite jetzt nicht mehr wählbar.                                                            | ☐ OK ☐ Fehler |

### 1.6 Videolink bei Online-Terminen

Nur für Leistungen mit „Online“.

| Nr   | Schritt                                 | Erwartetes Ergebnis                                                                               | Ergebnis      |
| ---- | --------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| 1.6a | Buche einen Online-Termin.              | Die Bestätigungsmail enthält einen Videolink (Zoom, Google Meet oder Teams, je nach Einstellung). | ☐ OK ☐ Fehler |
| 1.6b | Klicke auf den Videolink in der Mail.   | Der Link öffnet die Videokonferenz. Der Link ist für den gebuchten Termin eindeutig.              | ☐ OK ☐ Fehler |
| 1.6c | Prüfe den Videolink im Kalendereintrag. | Derselbe Link steht im Kalendereintrag.                                                           | ☐ OK ☐ Fehler |

### 1.7 Erinnerungsmail (24 h vorher)

Die Erinnerung muss 24 Stunden vor dem Termin kommen. Am schnellsten: Buche einen Termin, der etwas mehr als 24 Stunden in der Zukunft liegt, und warte. Alternativ die Erinnerungszeit in Zeeg prüfen, falls das Tool eine Einstellung dafür hat.

| Nr   | Schritt                                                                                                           | Erwartetes Ergebnis                                                                                                 | Ergebnis      |
| ---- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.7a | Buche einen Termin für morgen (mindestens 25 h ab jetzt). Notiere Termin: `______` und Erinnerungszeit: `______`. | Die Erinnerung kommt etwa 24 h vor dem Termin an.                                                                   | ☐ OK ☐ Fehler |
| 1.7b | Prüfe Betreff, Anrede, Datum und Uhrzeit, Ort bzw. Videolink in der Erinnerung.                                   | Angaben stimmen. Betreff z. B. „Erinnerung: morgen um {Uhrzeit} Uhr“ (siehe `docs/buchungstool.md`, Abschnitt 4.6). | ☐ OK ☐ Fehler |
| 1.7c | Prüfe Absender, Impressum- und Datenschutzlink wie in 1.3b und 1.3e.                                              | Wie in 1.3b und 1.3e.                                                                                               | ☐ OK ☐ Fehler |

### 1.8 Umbuchen

| Nr   | Schritt                                                            | Erwartetes Ergebnis                                                                                                 | Ergebnis      |
| ---- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.8a | Öffne in der Bestätigungsmail den Link zum Umbuchen (Verschieben). | Die Seite zeigt den bestehenden Termin und lässt einen neuen Termin wählen.                                         | ☐ OK ☐ Fehler |
| 1.8b | Wähle einen neuen Termin und bestätige.                            | Der neue Termin wird bestätigt. Es kommt eine neue Bestätigungsmail (oder eine Umbuchungsmail) mit dem neuen Datum. | ☐ OK ☐ Fehler |
| 1.8c | Prüfe den Kalendereintrag.                                         | Der alte Termin ist verschwunden, der neue steht im Kalender. Der alte Zeitraum ist wieder frei.                    | ☐ OK ☐ Fehler |
| 1.8d | Prüfe, ob Lea über die Umbuchung benachrichtigt wurde.             | Benachrichtigung über die Umbuchung ist in Leas Postfach.                                                           | ☐ OK ☐ Fehler |

### 1.9 Absagen

| Nr   | Schritt                                                                                                    | Erwartetes Ergebnis                                                                                                             | Ergebnis      |
| ---- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.9a | Buche einen weiteren Testtermin. Öffne den Absage-Link aus der Bestätigungsmail und sage ihn ab.           | Die Absage wird bestätigt (Seite oder Mail). Der Termin ist abgesagt.                                                           | ☐ OK ☐ Fehler |
| 1.9b | Prüfe den Kalender.                                                                                        | Der Termin ist aus dem Kalender entfernt (oder als abgesagt markiert). Der Zeitraum ist wieder frei.                            | ☐ OK ☐ Fehler |
| 1.9c | Prüfe, ob eine Absagemail mit Absender, Betreff und Datenschutzlink (wie 1.3b, 1.3c, 1.3e) angekommen ist. | Absagemail ist angekommen, mit den Pflichtangaben. Der Text entspricht dem Vorschlag in `docs/buchungstool.md` (Abschnitt 4.6). | ☐ OK ☐ Fehler |

### 1.10 Keine Gesundheitsdaten im Formular

| Nr    | Schritt                                                                                                    | Erwartetes Ergebnis                                                                                                                                                                                       | Ergebnis      |
| ----- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.10a | Geh alle Formularfelder im Buchungsablauf durch (Name, E-Mail, Telefon, Ort, Checkbox, ggf. Zusatzfelder). | Nur die Felder aus `docs/buchungstool.md`, Abschnitt 4.5: Name, E-Mail, optional Telefon, Ort, Pflicht-Checkbox. Kein Feld für Gesundheitsziele, Beschwerden, Diagnosen, Allergien, Gewicht, Medikamente. | ☐ OK ☐ Fehler |
| 1.10b | Prüfe, ob es ein **freies Notizfeld** gibt.                                                                | Ein freies Notizfeld ist entfernt oder ausgeblendet. Falls doch vorhanden: Fehler (siehe Abschnitt „Fehler gefunden“).                                                                                    | ☐ OK ☐ Fehler |
| 1.10c | Prüfe die Checkbox-Texte.                                                                                  | Der Hinweistext bittet, keine Gesundheitsangaben einzutragen. Der Link zur Datenschutzerklärung funktioniert.                                                                                             | ☐ OK ☐ Fehler |

---

## Test 2: Direktlink „Buchungsseite in neuem Tab öffnen“

Auf `/termin`, direkt unter dem Kalender.

| Nr  | Schritt                                                                                   | Erwartetes Ergebnis                                                                                           | Ergebnis      |
| --- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------- |
| 2.1 | Klicke auf „Buchungsseite in neuem Tab öffnen“ (ohne vorher „Kalender laden“ zu klicken). | Die Buchungsseite bei Zeeg öffnet sich **in einem neuen Tab**. Die Seite `/termin` bleibt im alten Tab offen. | ☐ OK ☐ Fehler |
| 2.2 | Prüfe die Adresse im neuen Tab.                                                           | Die Adresse entspricht `booking.bookingUrl` aus `src/data/booking.ts`.                                        | ☐ OK ☐ Fehler |
| 2.3 | Prüfe, ob die Buchungsseite ohne Umwege erreichbar ist (Weiterleitung, Fehlermeldung).    | Die Seite lädt ohne Fehler und zeigt die Leistungen.                                                          | ☐ OK ☐ Fehler |

**Bekannter Befund vor dem Test:** Der Button ist ein Link (`src/components/Button.astro`), und dort gibt es kein `target="_blank"`. Die Komponente öffnet den Link daher voraussichtlich im **selben** Tab. Schritt 2.1 wird deshalb ohne Korrektur vermutlich fehlschlagen. Notiere das Ergebnis trotzdem. Die Korrektur kommt in einen eigenen Issue.

---

## Test 3: Kontaktformular auf `/kontakt`

| Nr   | Schritt                                                                                                                                                                                         | Erwartetes Ergebnis                                                                                                                                                                                 | Ergebnis      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 3.1  | Öffne `/kontakt`. Prüfe, dass das Formular sichtbar ist (und nicht der Hinweis „noch nicht freigeschaltet“).                                                                                    | Das Formular mit den Feldern Name, E-Mail, Anliegen, Nachricht, Datenschutz-Checkbox und Button „Nachricht senden“ ist sichtbar.                                                                    | ☐ OK ☐ Fehler |
| 3.2  | Pflichtfelder prüfen: Sende das leere Formular ab.                                                                                                                                              | Der Browser zeigt bei jedem Pflichtfeld einen Hinweis. Es wird nichts gesendet.                                                                                                                     | ☐ OK ☐ Fehler |
| 3.3  | Gib eine ungültige E-Mail (z. B. `test@`) ein und sende ab.                                                                                                                                     | Der Browser meldet die ungültige Adresse. Es wird nichts gesendet.                                                                                                                                  | ☐ OK ☐ Fehler |
| 3.4  | Nachricht mit weniger als 10 Zeichen eingeben und absenden.                                                                                                                                     | Der Browser verlangt mindestens 10 Zeichen. Es wird nichts gesendet.                                                                                                                                | ☐ OK ☐ Fehler |
| 3.5  | Datenschutz-Checkbox **nicht** setzen, alle anderen Felder ausfüllen, absenden.                                                                                                                 | Es wird nichts gesendet. Der Hinweis zur Checkbox erscheint.                                                                                                                                        | ☐ OK ☐ Fehler |
| 3.6  | Prüfe den Link „Datenschutzerklärung“ neben der Checkbox.                                                                                                                                       | Der Link öffnet `/datenschutz`.                                                                                                                                                                     | ☐ OK ☐ Fehler |
| 3.7  | Vollständig ausfüllen (Anliegen „Terminanfrage“, Test-Adresse, Nachricht ab 10 Zeichen, Checkbox gesetzt) und absenden.                                                                         | Der Button wird kurz deaktiviert, es erscheint „Wird gesendet …“. Danach erscheint „Danke für deine Nachricht! Ich melde mich so bald wie möglich bei dir.“ Das Formular ist leer.                  | ☐ OK ☐ Fehler |
| 3.8  | Prüfe Leas Posteingang.                                                                                                                                                                         | Die Nachricht ist angekommen. Name, E-Mail, Anliegen und Nachricht stimmen. Die Zustimmung zum Datenschutz ist mitgeliefert (Feld `privacy`).                                                       | ☐ OK ☐ Fehler |
| 3.9  | Antworte in deinem Mailprogramm auf die Nachricht. **Prüfe die Empfängeradresse der Antwort.**                                                                                                  | Die Antwort geht an die E-Mail-Adresse der Absenderin, die im Formular eingetragen wurde (Reply-To). Nicht an den Dienst oder an eine Platzhalteradresse.                                           | ☐ OK ☐ Fehler |
| 3.10 | Spam-Schutz (Honeypot): Öffne die Entwicklerwerkzeuge und fülle das versteckte Feld `website` aus (Element suchen, Wert setzen), dann sende ab.                                                 | Die Nachricht wird nicht zugestellt oder als Spam markiert. Lea erhält sie nicht. Das Feld darf für echte Besucherinnen nicht sichtbar sein (Tab-Reihenfolge prüfen: Fokus springt nicht hinein).   | ☐ OK ☐ Fehler |
| 3.11 | Ohne JavaScript: Deaktiviere JavaScript (Entwicklerwerkzeuge → Einstellungen → „JavaScript deaktivieren“ oder Browser-Einstellung). Lade `/kontakt` neu und sende das vollständige Formular ab. | Das Formular wird direkt an den Dienst geschickt (klassisches POST). Der Dienst zeigt eine Dankeseite (oder Weiterleitung). Lea bekommt die Nachricht. Die JS-Meldung entfällt, das ist in Ordnung. | ☐ OK ☐ Fehler |
| 3.12 | Prüfe die Dankeseite und ihre Sprache.                                                                                                                                                          | Die Dankeseite des Dienstes ist auf Deutsch und hat einen Weg zurück zur Website.                                                                                                                   | ☐ OK ☐ Fehler |
| 3.13 | Simuliere einen Fehler: Trenne die Verbindung (Entwicklerwerkzeuge → Netzwerk → „Offline“) und sende ab.                                                                                        | Es erscheint „Das Senden hat leider nicht geklappt. …“ in roter Schrift. Der Button wird wieder aktiv. Die Eingaben bleiben erhalten.                                                               | ☐ OK ☐ Fehler |

---

## Test 4: Newsletter-Anmeldung

Der Newsletter-Block erscheint im Footer, sobald `newsletter.enabled` auf `true` steht und `formAction` eingetragen ist. Prüfe zuerst, ob er zu sehen ist.

| Nr   | Schritt                                                                                                                                                                   | Erwartetes Ergebnis                                                                                                                                                | Ergebnis      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| 4.1  | Prüfe, ob der Newsletter-Block im Footer sichtbar ist.                                                                                                                    | Der Block „Newsletter“ mit E-Mail-Feld und Anmelde-Button steht im Footer.                                                                                         | ☐ OK ☐ Fehler |
| 4.2  | Prüfe den Einwilligungstext: Die Checkbox ist **nicht** vorangekreuzt. Der Text nennt Häufigkeit („ca. einmal im Monat“), Abmeldung und Datenschutzlink.                  | Die Checkbox ist leer. Der Text entspricht `NewsletterSignup.astro`. Häufigkeit passt zu dem, was Lea tatsächlich versendet.                                       | ☐ OK ☐ Fehler |
| 4.3  | Sende das Formular mit der Test-Adresse ohne Checkbox ab.                                                                                                                 | Es wird nichts gesendet. Hinweis zur Pflicht-Checkbox.                                                                                                             | ☐ OK ☐ Fehler |
| 4.4  | Melde dich mit der Test-Adresse an (Checkbox gesetzt, „Anmelden“).                                                                                                        | Eine Bestätigungsseite des Dienstes erscheint („Bitte bestätige deine Anmeldung“). Der Text ist auf Deutsch.                                                       | ☐ OK ☐ Fehler |
| 4.5  | Prüfe die **Double-Opt-in-Mail** (Posteingang und Spam). Zeit notieren: `______`.                                                                                         | Die Mail kommt an. Sie enthält einen Bestätigungslink. Absender, Betreff und Anrede sind auf Deutsch und im „du“-Ton. Die Adresse ist noch **nicht** im Verteiler. | ☐ OK ☐ Fehler |
| 4.6  | Prüfe, dass in der Liste **noch keine** Adresse steht (Dashboard des Dienstes).                                                                                           | Die Adresse ist als „ausstehend“ oder „nicht bestätigt“ markiert.                                                                                                  | ☐ OK ☐ Fehler |
| 4.7  | Klicke auf den Bestätigungslink.                                                                                                                                          | Bestätigungsseite erscheint (Danke). Die Adresse ist jetzt in der Liste aktiv.                                                                                     | ☐ OK ☐ Fehler |
| 4.8  | Sende einen Testversand an die Test-Adresse.                                                                                                                              | Die Mail kommt an. Absender ist Lea. Fußzeile enthält Impressum (oder Link zu `/impressum`), Abmeldelink und einen Hinweis, warum die Mail ankommt.                | ☐ OK ☐ Fehler |
| 4.9  | Klicke im Testversand auf den **Abmeldelink**.                                                                                                                            | Abmeldung ohne Anmeldung möglich, ohne Kosten. Die Bestätigung der Abmeldung erscheint. Die Adresse ist aus der Liste entfernt (oder als abgemeldet markiert).     | ☐ OK ☐ Fehler |
| 4.10 | Prüfe, ob die Einwilligung **protokolliert** ist: Im Dienst Zeitpunkt der Anmeldung, Zeitpunkt der Bestätigung, IP (je nach Dienst) und Wortlaut des Einwilligungstextes. | Alle Angaben sind im Profil der Adresse gespeichert. Der Wortlaut ist mit Datum als Version abgelegt (Screenshot oder Export, siehe `docs/newsletter.md`).         | ☐ OK ☐ Fehler |
| 4.11 | Versuche eine Anmeldung **ohne** Bestätigung (Mail nicht bestätigen).                                                                                                     | Die Adresse erhält keine Newsletter-Mails.                                                                                                                         | ☐ OK ☐ Fehler |
| 4.12 | Ohne JavaScript: Newsletter-Anmeldung abschicken.                                                                                                                         | Das Formular funktioniert klassisch, der Dienst zeigt die Bestätigungsseite.                                                                                       | ☐ OK ☐ Fehler |

---

## Test 5: Zustellbarkeit (Spam-Ordner und Authentifizierung)

Ziel: Die Mails von Zeeg, vom Kontaktformular und vom Newsletter landen im Posteingang und nicht im Spam.

### 5.1 Was du dafür wissen solltest

- **SPF (Sender Policy Framework):** Eine DNS-Eintragung legt fest, welche Server im Namen deiner Domain Mails versenden dürfen. Der Eintrag ist ein TXT-Record, der mit `v=spf1` beginnt.
- **DKIM (DomainKeys Identified Mail):** Der Versender signiert jede Mail mit einem privaten Schlüssel. Der öffentliche Schlüssel steht als DNS-Eintrag bereit. So lässt sich prüfen, dass die Mail unterwegs nicht verändert wurde.
- **DMARC:** Legt fest, was Empfänger tun, wenn SPF oder DKIM fehlschlagen (z. B. „nichts tun“, „in den Spam“ oder „ablehnen“). Der Eintrag steht unter `_dmarc.deinedomain.de` und beginnt mit `v=DMARC1`.

Die Dienste (Zeeg, Formular-Dienst, Newsletter-Dienst) versenden die Mails in der Regel nicht direkt von deiner Domain, sondern über eigene Server. Deshalb gilt:

1. Notiere für jeden Dienst die **tatsächliche Absenderdomain** der Mails (steht im Header, siehe 5.3). Häufig ist das eine Domain des Dienstes und nicht `peterlings-nutrition.de`.
2. Für diese Domain müssen SPF und DKIM stimmen. Die Einrichtung macht meist der Dienst (Anleitung im Kundenkonto), manchmal braucht es einen Eintrag bei deinem DNS-Anbieter.
3. Für `peterlings-nutrition.de` selbst (deine eigene Mail) empfiehlt sich ebenfalls ein DMARC-Eintrag, damit niemand unter deinem Namen Mails verschicken kann.

Tabelle für die Absenderdomains:

| Dienst                  | Absenderdomain (aus Header) | SPF | DKIM | DMARC | Notiz |
| ----------------------- | --------------------------- | --- | ---- | ----- | ----- |
| Zeeg (Buchungsmails)    | `____________________`      | ☐   | ☐    | ☐     |       |
| Kontaktformular-Dienst  | `____________________`      | ☐   | ☐    | ☐     |       |
| Newsletter-Dienst       | `____________________`      | ☐   | ☐    | ☐     |       |
| peterlings-nutrition.de | `peterlings-nutrition.de`   | ☐   | ☐    | ☐     |       |

### 5.2 Posteingang und Spam bei den Anbietern

Schick jede Testmail (Bestätigung, Erinnerung, Newsletter-Testversand, Kontaktformular-Antwort) an die folgenden Adressen. Prüfe danach, wo sie gelandet ist.

| Nr   | Anbieter (Test-Konto)         | Bestätigungsmail     | Erinnerung           | Newsletter-Testversand | Kontaktformular-Nachricht | Ergebnis      |
| ---- | ----------------------------- | -------------------- | -------------------- | ---------------------- | ------------------------- | ------------- |
| 5.2a | Gmail                         | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam   | ☐ Posteingang ☐ Spam      | ☐ OK ☐ Fehler |
| 5.2b | Outlook / Hotmail (Microsoft) | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam   | ☐ Posteingang ☐ Spam      | ☐ OK ☐ Fehler |
| 5.2c | GMX                           | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam   | ☐ Posteingang ☐ Spam      | ☐ OK ☐ Fehler |
| 5.2d | Web.de                        | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam | ☐ Posteingang ☐ Spam   | ☐ Posteingang ☐ Spam      | ☐ OK ☐ Fehler |

Wenn eine Mail im Spam landet: Markiere sie **nicht** als Spam, sondern als „Kein Spam“ (das hilft künftig) und notiere den Fundort.

### 5.3 Authentifizierung im Mail-Header prüfen

So prüfst du den Header einer Mail:

- **Gmail:** Mail öffnen → Drei-Punkte-Menü → „Original anzeigen“. Suche nach `SPF:`, `DKIM:` und `DMARC:`. Alle drei sollen `PASS` sein.
- **Outlook:** Mail öffnen → „…“ → „Nachrichtenoptionen anzeigen“ (bzw. „Eigenschaften“). Suche nach `Authentication-Results`.
- **GMX / Web.de:** Mail öffnen → Kopfzeilen anzeigen (oft im Menü „Mehr“ oder unter „Quelltext“).

| Nr   | Prüfung                                            | Erwartet                                     | Ergebnis      |
| ---- | -------------------------------------------------- | -------------------------------------------- | ------------- |
| 5.3a | Bestätigungsmail (Zeeg): SPF, DKIM, DMARC          | Alle drei `PASS`.                            | ☐ OK ☐ Fehler |
| 5.3b | Kontaktformular-Nachricht an Lea: SPF, DKIM, DMARC | Alle drei `PASS` (bzw. Angabe des Dienstes). | ☐ OK ☐ Fehler |
| 5.3c | Newsletter-Testversand: SPF, DKIM, DMARC           | Alle drei `PASS`.                            | ☐ OK ☐ Fehler |

### 5.4 Prüfwerkzeuge

Diese Werkzeuge kannst du nutzen, ohne etwas zu installieren:

- **Mail-Tester** (mail-tester.com): Du schickst eine Testmail an die angezeigte Adresse und bekommst eine Bewertung mit Punkten und Hinweisen.
- **MXToolbox** (mxtoolbox.com): Prüft SPF-, DKIM- und DMARC-Einträge einer Domain (Suchfunktionen „SPF Record Lookup“, „DKIM Lookup“, „DMARC Lookup“).
- **Google Admin Toolbox** (toolbox.googleapps.com/apps/checkmx): Prüft DNS und Mail-Einstellungen.
- **Entwicklerwerkzeuge der Dienste:** Viele Newsletter-Dienste zeigen SPF- und DKIM-Status direkt im Konto an.

Notiere die Ergebnisse: Mail-Tester-Punktzahl `______`, MXToolbox-Befund `______`.

---

## Test 6: Mobil (iPhone und Android) und Desktop

Prüfe jede Seite auf dem Handy **und** am Rechner. Notiere das Gerät in der Spalte „Gerät“.

| Nr   | Seite / Element                   | Was prüfen                                                                                                                                    | Gerät | Ergebnis      |
| ---- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------------- |
| 6.1  | `/termin` (gesamt)                | Die Seite lässt sich ohne seitliches Scrollen bedienen. Kein Element ragt über den Rand.                                                      |       | ☐ OK ☐ Fehler |
| 6.2  | `/termin`: Kalender               | Der Kalender ist vollständig sichtbar, ohne innere Scrollleiste (Mindesthöhe 760 px). Der Kalender-Button ist gut tippbar (mindestens 44 px). |       | ☐ OK ☐ Fehler |
| 6.3  | `/termin`: Buttons                | „Kalender laden“ und „Buchungsseite in neuem Tab öffnen“ sind untereinander, nicht nebeneinander abgeschnitten.                               |       | ☐ OK ☐ Fehler |
| 6.4  | `/kontakt`: Formular              | Alle Felder sind breit genug. Die Checkbox ist gut antippbar. Der Button „Nachricht senden“ ist sichtbar, auch wenn die Tastatur offen ist.   |       | ☐ OK ☐ Fehler |
| 6.5  | Tab-Leiste unten                  | Auf dem Handy ist die Tab-Leiste unten sichtbar, auf dem Desktop nicht. Die Einträge entsprechen `mainNav` in `src/data/site.ts`.             |       | ☐ OK ☐ Fehler |
| 6.6  | Desktop: Layout                   | Auf `/termin` und `/kontakt` gibt es mehrspaltige Ansicht ab `md:` (Breite ca. 768 px). Der Inhalt ist auf maximal 6xl-Breite begrenzt.       |       | ☐ OK ☐ Fehler |
| 6.7  | Footer: Newsletter                | Auf dem Handy untereinander, auf dem Desktop nebeneinander sinnvoll angeordnet.                                                               |       | ☐ OK ☐ Fehler |
| 6.8  | Hochformat und Querformat (Handy) | Beide Ausrichtungen zeigen alle Inhalte ohne Abschneiden.                                                                                     |       | ☐ OK ☐ Fehler |
| 6.9  | Zoom (200 %) im Browser           | Texte bleiben lesbar, nichts überlagert sich.                                                                                                 |       | ☐ OK ☐ Fehler |
| 6.10 | Zeeg-Kalender auf dem Handy       | Die Buchung lässt sich auf dem Handy vollständig abschließen (Uhrzeit wählen, Formular, Bestätigung).                                         |       | ☐ OK ☐ Fehler |

---

## Fehler gefunden – was tun?

Wenn ein Schritt nicht das erwartete Ergebnis liefert, geh so vor:

1. **Ruhig bleiben und den Fehler genau beschreiben.** Notiere die Testnummer (z. B. „3.10“), das Gerät, den Browser und die Uhrzeit.
2. **Screenshot oder kurzes Video machen.** Wenn es eine Mail betrifft: Screenshot vom Absender, Betreff und Inhalt. Die Header-Zeile (Original anzeigen) mit abfotografieren. **Keine echten Kundendaten** in den Screenshot aufnehmen, nur deine Test-Daten.
3. **Zuordnen, wer zuständig ist:**

   | Problem betrifft                                       | Zuständig                                                                     |
   | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
   | Buchung, Kalender, Buchungsmails, Videolinks           | Zeeg-Support (über das Hilfe-Center im Konto) oder die Einstellungen im Konto |
   | Kontaktformular, Newsletter, Mail-Zustellbarkeit       | Anbieter des Dienstes (Support) und Lea (DNS-Einträge)                        |
   | Anzeige der Website, Texte, Buttons, Layout            | Entwickler (GitHub-Issue)                                                     |
   | Datenschutzrisiko (z. B. Gesundheitsdaten im Formular) | Lea sofort informieren, Test stoppen                                          |

4. **GitHub-Issue anlegen** (für alles, was die Website betrifft):
   - Titel: „Testfehler #28: [Kurzbeschreibung]“.
   - Text: Testnummer, Schritte, erwartetes Ergebnis, tatsächliches Ergebnis, Gerät, Browser, Screenshot.
   - Label bzw. Verweis auf Issue #28.
5. **Test nicht weiterführen, wenn ein Datenschutzproblem auftaucht.** Melde es zuerst bei Lea.
6. **Nach der Behebung:** Den Test wiederholen und das Ergebnis neu eintragen. Notiere das Datum der Korrektur.

---

## Abschluss

- [ ] Alle Testfälle sind ausgefüllt.
- [ ] Alle Testbuchungen sind im Buchungstool gelöscht.
- [ ] Alle Test-Newsletter-Adressen sind abgemeldet.
- [ ] Offene Fehler sind als GitHub-Issue angelegt.
- [ ] Lea hat den ausgefüllten Plan erhalten.

Testdatum: `____________________` Getestet von: `____________________`
