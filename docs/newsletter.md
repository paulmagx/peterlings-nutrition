# Newsletter mit Double-Opt-in (Issue #35)

Die Website ist statisch. Das Anmeldeformular (`src/components/NewsletterSignup.astro`, im Footer) schickt per normalem `POST` an ein Anmeldeformular eines externen Newsletter-Dienstes. Der Dienst versendet die Bestätigungsmail (Double-Opt-in), verwaltet die Liste und den Abmeldelink. Im Code steht alles in `src/data/newsletter.ts`.

Solange dort `enabled: false` steht oder `formAction` ein `TODO`-Platzhalter ist, rendert die Komponente nichts.

**Hinweis zur Recherche (Stand 16.11.2026):** Die Anbieter-Websites (brevo.com, rapidmail.de, cleverreach.com) waren aus der Entwicklungsumgebung nicht abrufbar (Netzwerksperre). Die Angaben stammen aus Websuche-Ergebnissen und Vergleichsportalen und sind mit **„zu prüfen“** markiert, wenn sie nicht an der Quelle belegt sind. Bitte Preise, Standort und AVV vor der Entscheidung direkt beim Anbieter ansehen. Nicht recherchiert bzw. nicht belegt: MailerLite (EU-Hosting unklar, deshalb nicht empfohlen), Buttondown (US-Dienst), Sendinblue (heißt inzwischen Brevo).

## Vergleich

| Dienst                    | Sitz / Hosting                              | Preis (Einstieg)                                                                                                                      | Double-Opt-in / AVV                                     | Einschätzung                                                                                                   |
| ------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Brevo** (ex Sendinblue) | Französisches Unternehmen, EU-Hosting [3]   | Free-Plan: 300 Mails/Tag, bis 100.000 Kontakte, aber „Sent with Brevo“-Hinweis in jeder Mail [1]. Bezahltarife ab ca. 7 € (zu prüfen) | DOI laut Quellen vorhanden [3]; AVV zu prüfen           | **Empfehlung** wegen Preis. Oberfläche teils englisch, Funktionsumfang groß.                                   |
| **rapidmail**             | Freiburg (D), Server in Deutschland [2][4]  | Kein dauerhafter Gratis-Tarif; ab 15 €/Monat bis 500 Empfänger [2] (Quellen widersprüchlich, zu prüfen)                               | DOI im Funktionsumfang [4]; deutscher AVV laut Test [5] | **Alternative**, wenn ein deutscher Anbieter mit deutscher Oberfläche und Support wichtiger ist als der Preis. |
| **CleverReach**           | Deutschland (Rastede), Server D/IRL [4]     | Gratis-Tarif bis 250 Empfänger, Basic ab ca. 15 €/Monat [4][6] (zu prüfen)                                                            | DOI und AVV üblich (zu prüfen)                          | Solide Alternative; Gratis-Tarif hat oft Einschränkungen (zu prüfen).                                          |
| MailerLite                | Litauen (EU), Hosting laut Suche nicht klar | Gratis-Einstieg laut Vergleichsportalen [4] (zu prüfen)                                                                               | zu prüfen                                               | Nicht empfohlen, solange Hosting-Standort und AVV nicht belegt sind.                                           |
| Buttondown                | USA                                         | zu prüfen                                                                                                                             | Drittlandübermittlung                                   | Nicht empfohlen (Daten in den USA).                                                                            |

## Empfehlung

**Brevo (Free-Plan)** für den Start: kostenlos, bis 300 Mails/Tag reicht für einen kleinen Verteiler locker (z. B. 150 Abonnent:innen = ein Versand), Double-Opt-in, EU-Hosting. Nachteile: Hinweis „Sent with Brevo“ in jeder Mail (nur durch Bezahltarif entfernbar) [1], und bei mehr als 300 Empfänger:innen läuft der Versand über mehrere Tage [1].

Wenn Lea lieber einen deutschen Anbieter mit deutscher Oberfläche möchte: **rapidmail** (ca. 15 €/Monat, zu prüfen).

Bevor gesendet wird: Newsletter ist Werbung im Sinne von § 7 UWG, die Einwilligung muss nachweisbar sein (siehe unten). Inhalte bitte nach `docs/textpruefung.md` (keine Heilversprechen).

## Pflichtangaben und Pflichtfunktionen

1. **Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 7 Abs. 2 Nr. 3 UWG):** freiwillig, aktiv (nicht vorangekreuzt), informiert. Der Text im Formular nennt: worum es geht, wie oft, jederzeit abmeldbar, Link zur Datenschutzerklärung. Wenn Lea häufiger als „ca. einmal im Monat“ schreibt, den Text in `NewsletterSignup.astro` anpassen.
2. **Double-Opt-in:** Der Dienst schickt nach der Anmeldung eine Bestätigungsmail; erst nach Klick auf den Link ist die Adresse aktiv. Im Dienst aktivieren (bei Brevo/rapidmail Standard bzw. Einstellung „Double-Opt-in“ im Formular).
3. **Protokollierung:** Zeitpunkt der Anmeldung, Zeitpunkt der Bestätigung, IP-Adresse (je nach Dienst) und der Wortlaut des Einwilligungstextes müssen gespeichert werden. Den Einwilligungstext im Dienst mit Datum hinterlegen und bei jeder Textänderung eine neue Version sichern (Screenshot/Export).
4. **Abmeldelink:** In jeder Mail ein funktionierender Abmeldelink (Dienst fügt ihn automatisch ein; nicht entfernen). Abmeldung muss ohne Anmeldung und ohne Kosten möglich sein.
5. **Impressum im Newsletter:** Impressumspflicht (§ 5 DDG) gilt auch für Newsletter. In die Fußzeile der Mail: Name, ladungsfähige Anschrift, E-Mail, ggf. Berufsangaben, oder ein Link zu `/impressum`. Die Angaben aus `src/data/site.ts` verwenden; Platzhalter `TODO(Lea)` dort vorher ausfüllen.
6. **AV-Vertrag (Art. 28 DSGVO):** Im Kundenkonto des Dienstes abschließen/annehmen und ablegen.
7. **Keine Tracking-Pixel ohne Einwilligung:** Öffnungs- und Klick-Tracking im Dienst abschalten oder im Einwilligungstext und in der Datenschutzerklärung erwähnen (zu prüfen: Rechtsberatung).
8. **Kein Newsletter an Kontaktformular-Absender** ohne eigene Einwilligung.

## Einrichtung (Schritt für Schritt)

1. Konto beim gewählten Dienst anlegen (Absenderadresse = Leas E-Mail, Name „Lea Petruschka, Peterlings Nutrition“), Absenderadresse bestätigen, ggf. SPF/DKIM der Domain einrichten (Anleitung des Dienstes).
2. AV-Vertrag abschließen.
3. Kontaktliste anlegen (z. B. „Newsletter“).
4. Anmeldeformular mit **Double-Opt-in** anlegen. Felder: E-Mail (Feldname `email`). Bestätigungsmail auf Deutsch und im Du-Ton formulieren (kurz: „Bitte bestätige deine Anmeldung“). Danke-/Bestätigungsseiten des Dienstes ebenfalls auf Deutsch.
5. Die **Formular-URL** (Ziel des `POST`) aus dem Dienst kopieren und in `src/data/newsletter.ts` bei `formAction` eintragen, `provider` setzen. Falls der Dienst andere Feldnamen verlangt (z. B. `EMAIL`), in `NewsletterSignup.astro` `name="email"` anpassen. Das Honeypot-Feld heißt `website`; falls der Dienst ein eigenes Honeypot-Feld nennt, den Namen angleichen.
6. Fußzeile der Mail-Vorlage: Impressum, Abmeldelink, Hinweis, warum die Mail ankommt.
7. Textbaustein unten in `src/pages/datenschutz.astro` einfügen und den Dienst mit Namen und Anschrift nennen.
8. In `src/data/newsletter.ts` `enabled: true` setzen. Mit einer eigenen Adresse testen: Anmeldung, Bestätigungsmail, Bestätigung, Testversand, Abmeldung.

## Textbaustein für die Datenschutzerklärung

> **Newsletter**
>
> Wenn du dich für meinen Newsletter anmeldest, verarbeite ich deine E-Mail-Adresse, um dir den Newsletter zuzusenden (ca. einmal im Monat, Tipps und Neuigkeiten rund um Ernährung und meine Angebote). Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit mit Wirkung für die Zukunft widerrufen, zum Beispiel über den Abmeldelink in jeder E-Mail oder per Nachricht an TODO(Lea): E-Mail-Adresse.
>
> Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach der Anmeldung bekommst du eine E-Mail mit einem Bestätigungslink. Erst nach der Bestätigung trage ich dich in den Verteiler ein. Zum Nachweis deiner Einwilligung speichere ich Zeitpunkt der Anmeldung und der Bestätigung, deine IP-Adresse und den Wortlaut der Einwilligung (Art. 6 Abs. 1 lit. c DSGVO, Art. 7 Abs. 1 DSGVO). Deine Daten speichere ich, bis du dich abmeldest; die Nachweise bewahre ich danach noch bis zum Ablauf der Verjährungsfristen auf (zu prüfen).
>
> Für Versand und Verwaltung nutze ich den Dienst TODO(Lea): Anbieter, Anschrift (Server in TODO(Lea): Land). Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. TODO(Lea): Hinweis auf Reichweitenmessung (Öffnungs-/Klickraten) ergänzen oder streichen, je nach Einstellung im Dienst.

Das ist ein Entwurf, keine Rechtsberatung. Vor dem Livegang von Datenschutzbeauftragter/Anwältin gegenlesen lassen.

## Quellen (abgerufen am 16.11.2026 über Websuche)

1. Brevo Hilfe, „What are the limits of the Free plan?“: https://help.brevo.com/hc/en-us/articles/208580669 (300 Versände/Tag, bis 100.000 Kontakte; „Sent with Brevo“ im Free-Plan laut Suchergebnis)
2. EmailToolTester, „Rapidmail Kosten: Alle Preise für 2026“: https://www.emailtooltester.com/de/newsletter-tools/rapidmail/kosten
3. Brevo, „Newsletter Tool“: https://www.brevo.com/de/newsletter-tool/ (Double-Opt-in, EU-Hosting laut Suchergebnis, Seite selbst nicht abrufbar)
4. Mailjet, „rapidmail Alternative“ (Wettbewerberseite, Vorsicht): https://www.mailjet.com/de/vergleiche/rapidmail-alternative/
5. Fastlancer, „rapidmail: Das DSGVO-Newsletter-Tool aus Freiburg im Test“: https://www.fastlancer.org/fastlancer-blog/rapidmail-review/
6. SumUp, „E-Mail-Marketing“: https://www.sumup.com/de-de/wachsen/marketing/e-mail-marketing/

Offen, selbst zu prüfen: aktuelle Preise und Limits aller Dienste, AVV-Text und Rechenzentrumsstandort bei Brevo, rapidmail und CleverReach.
