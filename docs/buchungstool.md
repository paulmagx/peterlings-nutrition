# Buchungstool für Peterlings Nutrition

Auswahl und Einrichtung des Online-Buchungstools für `/termin` (Issue #25, Meilenstein 3 in `PLANUNG.md`).

> **Kurzfassung:** Nimm **Zeeg** (Tarif _Professional_, ca. 10–12 € netto im Monat). Deutscher Anbieter aus Berlin, Daten auf Servern in Deutschland, AV-Vertrag für jeden Kunden, deutsche Oberfläche, Videolinks und Zahlung per Stripe. Als Alternative kommt **eTermin** infrage: Es ist stärker auf Praxen und Dienstleister zugeschnitten und kostet etwas mehr.
>
> Das Konto legst du selbst an (siehe [Einrichtung](#4-einrichtung-von-zeeg-schritt-für-schritt)). Danach schickst du dem Entwickler **drei Dinge**: den Buchungslink, den Einbettungscode und die Bestätigung, dass der AV-Vertrag abgeschlossen ist.

**Stand der Recherche:** 16.11.2026. Preise und Bedingungen ändern sich oft. Prüfe sie vor dem Abschluss auf der Seite des Anbieters. Dieses Dokument ist keine Rechtsberatung.

---

## 1. Anforderungen

| #   | Anforderung              | Warum                                                                                                                                                                                                                                  |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | **3–4 Leistungen**       | Jede mit eigener Dauer und eigenem Preis: Einzelberatung (60 Min), Ernährungsplan, Einkaufstraining, ggf. kostenloses Kennenlerngespräch. Dauer und Preise legst du fest: `TODO(Lea)`.                                                 |
| A2  | **Vor Ort und online**   | Ort pro Leistung wählbar (Praxisadresse oder Videolink). Der Videolink soll bei der Buchung automatisch erzeugt werden.                                                                                                                |
| A3  | **Automatische E-Mails** | Bestätigung, Erinnerung (z. B. 24 h vorher), Absage/Umbuchung per Link.                                                                                                                                                                |
| A4  | **Kalender-Sync**        | Google, Outlook/Microsoft 365 oder iCal. Belegte Zeiten aus deinem Kalender blockieren Buchungen.                                                                                                                                      |
| A5  | **Vorauszahlung**        | Optional, z. B. für Ernährungsplan oder als Schutz vor Nichterscheinen.                                                                                                                                                                |
| A6  | **Deutsch**              | Buchungsseite und E-Mails auf Deutsch. Texte anpassbar, damit die „du“-Ansprache passt.                                                                                                                                                |
| A7  | **DSGVO**                | Server in der EU (besser: Deutschland), AV-Vertrag nach Art. 28 DSGVO, möglichst keine Übermittlung in die USA.                                                                                                                        |
| A8  | **Datensparsamkeit**     | Im Buchungsformular **keine Gesundheitsdaten** (Art. 9 DSGVO) abfragen. Freitextfelder müssen sich entfernen lassen. Gesundheitsfragen gehören in das Erstgespräch oder einen eigenen, abgesicherten Anamnesebogen, nicht in das Tool. |
| A9  | **Einbettbar**           | Als iframe/Widget für die Zwei-Klick-Lösung auf `/termin` oder als normaler Link.                                                                                                                                                      |
| A10 | **Günstig**              | Für eine Einzelperson. Zielgröße: unter 20 € im Monat.                                                                                                                                                                                 |

---

## 2. Vergleich

**Hinweis zur Recherche:** Die Seiten der Anbieter ließen sich aus der Arbeitsumgebung nicht direkt abrufen. Die Angaben stammen aus Websuchen am 16.11.2026: aus Hilfeseiten und Dokumenten der Anbieter, wo verfügbar, sonst aus Vergleichsportalen. Viele dieser Portale gehören Mitbewerbern (zeeg, meetergo, Koalendar, Cal.com) und sind daher nicht neutral. Wo sich Quellen widersprechen, stehen beide Werte in der Tabelle. Die Ziffern in eckigen Klammern verweisen auf die [Quellen](#quellen).

Preise sind Netto-Monatspreise für eine Person. „Jährlich“ heißt: bei Jahreszahlung umgerechnet auf den Monat.

| Anbieter                            | Preis für 1 Person                                                                                                        | Hosting / EU                                                                                                                                               | AV-Vertrag                                                             | Deutsche Oberfläche | Einbettung                                                            | Online-Meeting                                      | Zahlung                                | Besonderheiten                                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zeeg** (Berlin)                   | Starter kostenlos (laut Drittquellen nur 2 Buchungsseiten); Professional 12 € monatlich / 10 € jährlich [1][2]            | Deutschland (Telekom-Rechenzentrum), laut Hilfe-Center auch Niederlande; kein US-Cloud-Anbieter [3][4]                                                     | Ja, mit jedem Kunden, PDF online [4][5]                                | Ja                  | Inline-Embed (iframe), Pop-up, Link; Ereignisse per `postMessage` [6] | Videokonferenz-Integration in allen Tarifen [2]     | Stripe ab Professional [1]             | Buchungsseite ohne Cookies nutzbar [4]; persönliche Daten lassen sich aus Kalendereinträgen und Benachrichtigungen ausblenden [7]; Calendly-ähnlich einfach. |
| **eTermin**                         | Lite ab 19 €, Pro 29 € (eine Quelle nennt 29 € für Lite) [8][9]; kein Gratistarif, 30 Tage Test                           | Laut AV-Vertrag Rechenzentrum in Frankfurt [10]; eine Drittquelle nennt Microsoft-Rechenzentrum Amsterdam [8]                                              | Ja, PDF online [10]                                                    | Ja                  | iframe (mit Skript), Modal, Link; Anleitungen im Support [11]         | Zoom (Link pro Buchung oder fest pro Leistung) [12] | Online-Zahlung ab Pro [13]             | Auf Praxen und Dienstleister ausgelegt (Leistungen mit Preis, Ressourcen); REST-API ab Pro [9].                                                              |
| **Terminland** (Wiesbaden)          | Easy ab 14,90 €, Profi ab 29,90 € pro Kalender (Capterra: 12,90/25,90 €) [14][15]                                         | Deutschland laut Drittquellen [16]                                                                                                                         | Nicht geprüft (deutscher Anbieter, vermutlich ja)                      | Ja                  | Ja (Online-Terminplaner)                                              | Nicht geprüft                                       | Nicht geprüft                          | Google- und Exchange-Sync laut Vergleich erst in Profi [16]; Oberfläche eher klassisch.                                                                      |
| **SimplyBook.me**                   | Gratis (50 Buchungen/Monat); Basic 13,90 € monatlich / 11,90 € jährlich; Standard 29,90 € / 24,90 € [17][18]              | Unklar: einige Quellen sagen EU, andere „nicht ausschließlich EU“ [19][20]                                                                                 | DPA nach Art. 28 vorhanden; erwähnt Verarbeitung außerhalb EU/EWR [21] | Ja                  | Widget, iframe, Link                                                  | Zoom, Teams u. a. als „Custom Features“             | Viele Zahlungsanbieter                 | Sehr viele Funktionen, aber Zusatzfunktionen („Custom Features“) zählen gegen das Kontingent des Tarifs.                                                     |
| **Cal.com**                         | Free: 1 Person, unbegrenzte Terminarten, Workflows, Stripe/PayPal [22][23]; Teams ca. 12–15 $/Nutzer                      | **USA**. Die EU-Instanz cal.eu wurde zum **01.11.2026 eingestellt**; EU-Hosting nur noch für Organisationen/Enterprise oder bei Selbsthosting [24][25][26] | Ja, Übermittlung über EU-US Data Privacy Framework [27]                | Ja                  | iframe, React, Pop-up                                                 | Cal Video, Zoom, Meet, Teams                        | Stripe, PayPal                         | Funktional stark und günstig, scheidet aber wegen US-Hosting aus (A7).                                                                                       |
| **Calendly**                        | Free: 1 Terminart, Erinnerungen fehlen laut einer Quelle; Standard ca. 10 $ jährlich / 12 $ monatlich [28]                | USA (Google Cloud), keine EU-Option veröffentlicht [29]                                                                                                    | DPA in den Nutzungsbedingungen, mit Standardvertragsklauseln [29][30]  | Ja                  | Inline, Pop-up, Link                                                  | Zoom, Meet, Teams                                   | Stripe, PayPal ab bezahltem Tarif [28] | Bekannt und ausgereift, aber US-Hosting (A7) und Kosten in Dollar.                                                                                           |
| **Acuity Scheduling** (Squarespace) | Starter ca. 20 $ monatlich / 16 $ jährlich; Standard ca. 34 $ [31]                                                        | USA                                                                                                                                                        | DPA vorhanden; HIPAA-BAA nur im teuersten Tarif [31][32]               | Teilweise           | Ja                                                                    | Zoom, Meet, Teams                                   | Stripe, Square, PayPal                 | Gute Formulare und Pakete, aber US-Hosting und Kosten in Dollar.                                                                                             |
| **Microsoft Bookings**              | Kein Einzelprodukt; in Microsoft 365 Business Basic enthalten (ca. 5–7 € pro Nutzer, Preiserhöhung ab Juli 2026) [33][34] | EU-Datengrenze von Microsoft möglich                                                                                                                       | Ja (Microsoft-DPA)                                                     | Ja                  | Link, iframe eingeschränkt                                            | Teams                                               | Keine eingebaute Zahlung               | Nur sinnvoll, wenn du ohnehin Microsoft 365 nutzt; Buchungsseite optisch kaum anpassbar.                                                                     |
| **Shore**                           | Booking ab 39,90–49,90 € jährlich, 59,90 € monatlich [35][36]                                                             | Deutscher Anbieter (München)                                                                                                                               | Ja                                                                     | Ja                  | Widget, Link                                                          | Nicht geprüft                                       | Ja                                     | Für Friseure, Kosmetik- und Ladengeschäfte gebaut [36]; für eine Person zu teuer.                                                                            |
| **Doctolib**                        | Preis nur auf Anfrage; laut GIGA Basisversion kostenlos, Zusatzmodule kostenpflichtig [37]                                | EU (laut Anbieter)                                                                                                                                         | Ja                                                                     | Ja                  | Eigenes Profil auf doctolib.de, Link                                  | Videosprechstunde                                   | Nein                                   | Für Ärzte, Therapeuten und Heilpraktiker gedacht; Patientinnen brauchen ein Doctolib-Konto, deine Kundinnen landen auf einer fremden Plattform.              |

### Zwischenfazit

- **US-Anbieter scheiden aus.** Cal.com (cal.eu ist geschlossen), Calendly und Acuity erfüllen A7 nur über das EU-US Data Privacy Framework bzw. Standardvertragsklauseln. Rechtlich ist das zulässig, aber du müsstest es in der Datenschutzerklärung erklären, und es wirkt bei einer Gesundheitsdienstleistung nicht vertrauensbildend.
- **Zu teuer oder unpassend:** Shore (für Ladengeschäfte, ab ca. 40 €), Doctolib (Plattform für Heilberufe, Kundinnen brauchen ein fremdes Konto), Microsoft Bookings (nur mit Microsoft-365-Abo, keine Zahlung).
- **SimplyBook.me** ist günstig und funktionsreich. Wo die Daten liegen, ist aber unklar, und der AV-Vertrag nennt Verarbeitung außerhalb der EU.
- **In der engeren Wahl:** Zeeg, eTermin, Terminland. Alle drei sind deutschsprachige Anbieter mit Servern in Deutschland.

---

## 3. Empfehlung

### Nummer 1: Zeeg (Tarif Professional)

- **Datenschutz am stärksten belegt:** deutsche GmbH, Daten im Telekom-Rechenzentrum in Deutschland, ausdrücklich ohne US-Cloud-Anbieter, AV-Vertrag als PDF zum Herunterladen [3][4][5]. Die Buchungsseite funktioniert ohne Cookies [4].
- **Datensparsam einstellbar:** Das Formular lässt sich auf Name und E-Mail reduzieren. Persönliche Angaben lassen sich aus Kalendereinträgen und Benachrichtigungen ausblenden [7].
- **Günstigster passender Tarif:** 10–12 € im Monat für Professional. Damit hast du mehrere Buchungsseiten (Leistungen), Stripe-Zahlung und eigene Farben. Mit dem Gratis-Tarif _Starter_ kannst du alles in Ruhe ausprobieren [1][2].
- **Sauber einbettbar:** Der Inline-Embed ist dokumentiert und meldet Buchungen an die Website zurück (`zeeg.booking_confirmed`). Damit kann `/termin` später z. B. eine Dankeseite zeigen [6].
- **Einfache Bedienung:** Calendly-ähnlich, für eine Einzelperson ohne Mitarbeitende und Räume genau richtig.
- **Schwächen:** Zeeg ist auf Terminbuchung ausgelegt, nicht auf einen Leistungskatalog. Preise werden je Buchungsseite eingestellt, nicht als Shop. Der Anbieter rückt derzeit seinen KI-Telefonassistenten in den Vordergrund, den du nicht brauchst und nicht aktivieren solltest.

### Alternative: eTermin (Tarif Lite oder Pro)

- **Wann wählen:** wenn du einen klassischen **Leistungskatalog** möchtest (Leistungen mit Preis, Gruppen wie „Beratung“ und „Training“), später Online-Zahlung brauchst oder Praxisräume und Termine für Mitarbeitende verwalten willst.
- **Plus:** Der AV-Vertrag nennt ein Rechenzentrum in Frankfurt [10]. Die iframe-Einbindung und die Zoom-Anbindung sind gut dokumentiert [11][12].
- **Minus:** teurer (19–29 € im Monat), kein dauerhafter Gratistarif, Oberfläche umfangreicher. Online-Zahlung gibt es erst in Pro [13].

**Terminland** wäre die dritte Wahl. Es ist deutsch und günstig im Einstieg, aber die Kalender-Synchronisierung mit Google/Exchange gibt es erst im Profi-Tarif (ab 29,90 €) [16].

---

## 4. Einrichtung von Zeeg Schritt für Schritt

> Menüpunkte können sich leicht anders nennen, die Reihenfolge bleibt gleich. Nimm dir etwa 1–2 Stunden Zeit.

### 4.1 Konto anlegen

1. Auf zeeg.me ein Konto erstellen, am besten mit deiner geschäftlichen E-Mail-Adresse (`TODO(Lea)@peterlings-nutrition.de`), nicht mit einer privaten.
2. Sprache **Deutsch** und Zeitzone **Europe/Berlin** einstellen.
3. **Benutzername/URL** wählen, z. B. `peterlings-nutrition` → `https://zeeg.me/peterlings-nutrition`. Kurz und ohne Sonderzeichen.
4. Profilbild/Logo und Anzeigename „Lea Petruschka – Peterlings Nutrition“ eintragen.
5. Erst im Tarif **Starter (gratis)** alles einrichten und testen. Vor dem Livegang auf **Professional** wechseln (mehr Buchungsseiten, eigene Farben, Stripe).
6. Eine **KI-Telefonassistenz** oder Ähnliches **nicht** aktivieren. Das brauchst du nicht, und es würde weitere Daten verarbeiten.

### 4.2 Kalender verbinden

1. Unter _Kalender_ deinen Arbeitskalender verbinden (Google, Outlook/Microsoft 365 oder iCloud).
2. Einstellen, dass **belegte Termine aus diesem Kalender Buchungen blockieren**.
3. Neue Buchungen **in diesen Kalender eintragen** lassen.
4. Videokonferenz verbinden: **Zoom**, **Google Meet** oder **Microsoft Teams**, je nachdem, was du nutzt. Dann bekommt jede Online-Buchung automatisch einen eigenen Link.

### 4.3 Leistungen anlegen (je eine Buchungsseite)

Lege für jede Leistung eine eigene Buchungsseite (Terminart) an. Dauer, Puffer und Preise sind Vorschläge, du legst die echten Werte fest: `TODO(Lea)`.

| Buchungsseite (Titel)          | URL-Kürzel          | Dauer (Vorschlag)          | Ort                         | Preis       | Hinweis                                                                |
| ------------------------------ | ------------------- | -------------------------- | --------------------------- | ----------- | ---------------------------------------------------------------------- |
| Kostenloses Kennenlerngespräch | `kennenlernen`      | 15–20 Min                  | Online (Video) oder Telefon | kostenlos   | Niedrige Hürde; dient auch zur Klärung, ob der Rest passt.             |
| Einzelberatung                 | `einzelberatung`    | 60 Min                     | Vor Ort **oder** online     | `TODO(Lea)` | Ort zur Auswahl anbieten (zwei Ortsoptionen).                          |
| Ernährungsplan – Erstgespräch  | `ernaehrungsplaene` | `TODO(Lea)`                | Vor Ort oder online         | `TODO(Lea)` | Gebucht wird das Gespräch; den Plan erstellst du danach.               |
| Einkaufstraining               | `einkaufstraining`  | `TODO(Lea)` (z. B. 90 Min) | Vor Ort (Treffpunkt)        | `TODO(Lea)` | Treffpunkt in der Bestätigungsmail nennen, nicht im Formular abfragen. |

Für jede Buchungsseite:

1. **Titel und Beschreibung** in „du“-Form, ohne Heilversprechen (siehe `CLAUDE.md`). Beispiel: „In 60 Minuten schauen wir gemeinsam auf deinen Alltag und entwickeln erste Schritte, die zu dir passen.“
2. **Dauer** und **Puffer** einstellen (z. B. 15 Min danach für Notizen).
3. **Ort:** „Persönlich“ mit Praxisadresse (`TODO(Lea)`) und/oder „Videokonferenz“ (automatischer Link).
4. **Vorlaufzeit:** z. B. frühestens 24 h im Voraus buchbar, höchstens 8 Wochen im Voraus.
5. **Tageslimit**, falls gewünscht (z. B. höchstens 4 Beratungen pro Tag).
6. **Zahlung (optional, ab Professional):** Stripe verbinden und bei kostenpflichtigen Leistungen Vorauszahlung aktivieren. Vorher klären: Kleinunternehmerregelung oder Umsatzsteuer, Stornobedingungen (`TODO(Lea)`). Die Stornoregel muss in der Beschreibung stehen.

### 4.4 Verfügbarkeiten

1. Einen **Zeitplan** „Beratungszeiten“ anlegen (z. B. Di–Do 9–17 Uhr, `TODO(Lea)`).
2. Für Vor-Ort-Termine bei Bedarf einen eigenen Zeitplan anlegen, z. B. nur an Praxistagen.
3. Feiertage und Urlaub als Abwesenheiten eintragen oder im verbundenen Kalender blockieren.

### 4.5 Formularfelder (datensparsam)

**Nur diese Felder:**

| Feld                       | Pflicht | Begründung                                                           |
| -------------------------- | ------- | -------------------------------------------------------------------- |
| Vorname und Nachname       | ja      | Ansprache, Rechnung                                                  |
| E-Mail                     | ja      | Bestätigung, Erinnerung, Videolink                                   |
| Telefonnummer              | nein    | Nur für kurzfristige Absagen. Weglassen, wenn du sie nicht brauchst. |
| Ort (vor Ort / online)     | ja      | Nur wenn die Buchungsseite beide Optionen anbietet                   |
| Checkbox „Hinweis gelesen“ | ja      | Siehe unten                                                          |

**Nicht abfragen:** Gesundheitsziele, Beschwerden, Diagnosen, Allergien, Gewicht, Medikamente, Schwangerschaft. Das sind Gesundheitsdaten nach Art. 9 DSGVO. Auch das **freie Notizfeld** („Möchtest du uns noch etwas mitteilen?“) **entfernen oder ausblenden**, denn dort schreiben Menschen erfahrungsgemäß genau solche Angaben hinein.

Text für die Pflicht-Checkbox (anpassen):

> Ich habe die [Datenschutzhinweise](https://peterlings-nutrition.de/datenschutz) gelesen. Bitte schreibe hier noch keine Angaben zu deiner Gesundheit hinein, darüber sprechen wir im Termin.

Weitere Einstellungen:

- In den Datenschutzoptionen **persönliche Daten in Kalendereinträgen und Benachrichtigungen ausblenden**, falls dein Kalender auch privat genutzt oder geteilt wird [7].
- **Tracking und Analytics** auf der Buchungsseite **aus** lassen.

### 4.6 E-Mail-Texte

Aktiviere Bestätigung, Erinnerung (24 h vorher) und Absage/Umbuchung. Vorschläge in „du“-Form:

**Bestätigung**

> Betreff: Dein Termin bei Peterlings Nutrition am {Datum}
>
> Hallo {Vorname},
>
> schön, dass du da bist! Dein Termin „{Terminart}“ ist bestätigt:
>
> {Datum}, {Uhrzeit} Uhr
> {Ort bzw. Videolink}
>
> Falls etwas dazwischenkommt, kannst du den Termin hier verschieben oder absagen: {Link}. Bitte sag bis spätestens `TODO(Lea)` Stunden vorher Bescheid.
>
> Ich freue mich auf dich!
> Lea Petruschka
> Peterlings Nutrition · `TODO(Lea)` Adresse · `TODO(Lea)` Telefon

**Erinnerung (24 h vorher)**

> Betreff: Erinnerung: morgen um {Uhrzeit} Uhr
>
> Hallo {Vorname},
>
> kurze Erinnerung an unseren Termin morgen, {Datum}, um {Uhrzeit} Uhr – {Ort bzw. Videolink}.
>
> Bei Online-Terminen: Am besten ein ruhiger Ort und ein paar Minuten vorher den Link testen.
>
> Bis morgen!
> Lea

**Absage**

> Hallo {Vorname},
>
> dein Termin am {Datum} um {Uhrzeit} Uhr ist abgesagt. Wenn du einen neuen Termin möchtest: https://peterlings-nutrition.de/termin
>
> Liebe Grüße
> Lea

Die Platzhalter in geschweiften Klammern heißen in Zeeg evtl. anders. Nimm die Variablen, die der Editor anbietet.

### 4.7 AV-Vertrag abschließen

1. In Zeeg unter _Einstellungen → Datenschutz / DSGVO_ (bzw. über den Support) den **Auftragsverarbeitungsvertrag** abschließen. Das Muster liegt unter <https://assets.zeeg.me/AVV.pdf> [5].
2. Prüfen: Liste der **Unterauftragsverarbeiter** (Hosting Telekom; E-Mail-Versand; Stripe nur bei Zahlung) und Serverstandort.
3. Den unterschriebenen bzw. bestätigten AVV als PDF **ablegen** (Ordner „Datenschutz“), zusammen mit dem Datum.
4. Zeeg in dein **Verzeichnis von Verarbeitungstätigkeiten** aufnehmen („Online-Terminbuchung“).
5. Wenn du Zoom/Meet/Teams und Stripe nutzt: Für diese Dienste gelten eigene Datenschutzbedingungen. Sie müssen ebenfalls in die Datenschutzerklärung (siehe Abschnitt 5.3).

### 4.8 Testen

1. Jede Leistung einmal selbst buchen, mit einer zweiten E-Mail-Adresse, am Handy und am Rechner.
2. Kommen Bestätigung und Erinnerung an? Stimmt der Videolink? Steht der Termin im Kalender?
3. Einmal umbuchen und einmal absagen.
4. Bei Zahlung: Stripe im Testmodus prüfen.

### 4.9 Was du dem Entwickler schickst

| Was                              | Wo du es findest                                                                                                          | Beispiel                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Buchungslink**                 | Deine Profilseite (Übersicht aller Leistungen)                                                                            | `https://zeeg.me/peterlings-nutrition`                |
| **Einbettungscode**              | Buchungs- oder Profilseite → _Teilen_ → _Zur Website hinzufügen_ → **Inline-Embed** → Farben wählen → _Code kopieren_ [6] | Den kompletten Code als Text, nicht als Screenshot    |
| **Links je Leistung** (optional) | Teilen-Dialog jeder Buchungsseite                                                                                         | `https://zeeg.me/peterlings-nutrition/einzelberatung` |
| **AVV erledigt**                 | Kurze Bestätigung mit Datum                                                                                               | „AVV am … abgeschlossen“                              |
| **Genutzte Zusatzdienste**       | Zoom/Meet/Teams? Stripe? Telefonnummer abgefragt?                                                                         | Für die Datenschutzerklärung                          |

Farben für den Embed, passend zur Website: Primärfarbe = Button-Grün `sage-600` aus `src/styles/global.css` (den Hex-Wert gibt dir der Entwickler).

---

## 5. Was in die Website kommt

### 5.1 Konfiguration

Alle Angaben stehen zentral in `src/data/booking.ts`. Seiten und Komponenten lesen nur von dort. Solange dort `TODO(Lea)` steht, zeigt `/termin` statt des Kalenders einen Hinweis bzw. den Kontakt-Link.

### 5.2 Einbindung auf `/termin`

**Standard: Zwei-Klick-Lösung mit `ConsentEmbed`** (Komponente wird parallel gebaut; Props hier sinngemäß, die genauen Namen richten sich nach der Komponente):

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PageIntro from "../components/PageIntro.astro";
import ConsentEmbed from "../components/ConsentEmbed.astro";
import Button from "../components/Button.astro";
import { booking } from "../data/booking";
---

<BaseLayout
  title="Termin buchen"
  description="Buche deinen Termin bei Lea Petruschka – vor Ort oder online."
>
  <PageIntro title="Termin buchen" />

  <ConsentEmbed
    src={booking.embedUrl}
    title={`Terminbuchung über ${booking.providerName}`}
    providerName={booking.providerName}
    privacyUrl={booking.privacyUrl}
    height={booking.embedHeight}
  />

  <!-- Alternative ohne Einwilligung: normaler Link zur Buchungsseite beim Anbieter -->
  <Button
    href={booking.bookingUrl}
    variant="secondary"
    icon="open-in-new-rounded"
  >
    Buchungsseite direkt öffnen
  </Button>
</BaseLayout>
```

Ablauf für Besucherinnen:

1. `/termin` lädt **nichts** von Zeeg. Zu sehen ist ein Platzhalter mit Text wie: „Für die Terminbuchung nutze ich Zeeg (Server in Deutschland). Wenn du auf ‚Kalender laden‘ klickst, wird eine Verbindung zu Zeeg aufgebaut. Mehr dazu in der [Datenschutzerklärung](/datenschutz) und bei [Zeeg](privacyUrl).“
2. Erst nach dem Klick setzt `ConsentEmbed` das `<iframe src={booking.embedUrl}>` ein.
3. Darunter steht immer der normale Link zur Buchungsseite, als Fallback und für alle, die lieber direkt bei Zeeg buchen.

**Hinweise für den Einbau:**

- Zeeg liefert den Inline-Embed als Skript plus Container. Für `ConsentEmbed` nehmen wir **nur die URL** aus dem Code (das ist `embedUrl`) und binden sie als einfaches `<iframe>` ein. So lädt die Seite **kein Fremd-Skript**, und die Zwei-Klick-Lösung bleibt einfach. Falls das reine iframe ohne Skript nicht sauber funktioniert (Höhe, Weiterleitung), lädt `ConsentEmbed` das Zeeg-Skript ebenfalls erst nach dem Klick.
- Die Buchungsseite kann intern auf eine Dankeseite weiterleiten. Mit `data-redirect-parent="true"` passiert das im Hauptfenster statt im iframe [6]. Das ist optional.
- Das Ereignis `zeeg.booking_confirmed` (per `postMessage`) könnte später eine Dankesmeldung auf `/termin` auslösen [6]. Das ist ebenfalls optional und kommt ohne Tracking aus.
- **Kein** Einbau auf anderen Seiten. Start- und Leistungsseite verlinken nur auf `/termin` (`bookingLink` in `src/data/site.ts`). Einzelne Leistungen können direkt auf `booking.serviceUrls.<leistung>` verlinken.

**Minimalvariante ohne Embed:** Ist der Embed noch nicht fertig oder soll gar kein Fremdinhalt auf die Seite, zeigt `/termin` nur die Leistungen mit je einem Button „Termin wählen“ auf `bookingUrl` (öffnet bei Zeeg). Dann braucht es keine Einwilligung. In der Datenschutzerklärung steht trotzdem ein kurzer Absatz, weil die Buchungsdaten bei Zeeg verarbeitet werden.

### 5.3 Textbausteine für die Datenschutzerklärung

> Entwurf, keine Rechtsberatung. Am besten in den Generator (z. B. eRecht24) übernehmen bzw. dort den passenden Baustein wählen und mit diesen Angaben abgleichen. Platzhalter vor dem Livegang ersetzen.

**Online-Terminbuchung mit Zeeg**

> Für die Online-Terminbuchung nutze ich den Dienst Zeeg der Zeeg GmbH, Friedrichstr. 155, 10117 Berlin. Wenn du einen Termin buchst, werden die von dir eingegebenen Daten (Name, E-Mail-Adresse, ggf. Telefonnummer), der gewählte Termin und die gewählte Leistung sowie technische Daten (z. B. IP-Adresse, Zeitpunkt der Buchung) an Zeeg übermittelt und dort gespeichert. Zeeg verarbeitet die Daten nach eigenen Angaben auf Servern in Deutschland [bzw. Deutschland und den Niederlanden – vor dem Livegang im AVV prüfen].
>
> Zweck der Verarbeitung ist die Vereinbarung und Durchführung des Termins. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag bzw. vorvertragliche Maßnahmen). Mit Zeeg habe ich einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO geschlossen.
>
> Bitte gib im Buchungsformular keine Angaben zu deiner Gesundheit an. Darüber sprechen wir im Termin.
>
> Die Buchungsdaten werden gelöscht, sobald sie für die Durchführung und Abrechnung des Termins nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten (z. B. für Rechnungen) entgegenstehen. Weitere Informationen: [Datenschutzerklärung von Zeeg](privacyUrl).

**Einbindung auf dieser Website (Zwei-Klick-Lösung)**

> Auf der Seite „Termin buchen“ kannst du den Buchungskalender von Zeeg direkt laden. Der Kalender wird erst angezeigt, wenn du auf „Kalender laden“ klickst. Erst dann wird eine Verbindung zu den Servern von Zeeg aufgebaut, und deine IP-Adresse und technische Browserdaten werden an Zeeg übermittelt. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Du kannst sie jederzeit widerrufen, indem du die Seite neu lädst [bzw. über den Link „Einwilligung zurücksetzen“ – je nachdem, wie `ConsentEmbed` umgesetzt ist].

**Nur falls genutzt: Videoberatung**

> Für Online-Termine nutze ich [Zoom / Google Meet / Microsoft Teams] von [Anbieter, Adresse]. Den Link erhältst du mit der Terminbestätigung. Dabei werden … verarbeitet. [Baustein aus dem Generator für den gewählten Dienst übernehmen, inkl. Drittlandübermittlung/Data Privacy Framework.]

**Nur falls genutzt: Online-Zahlung**

> Kostenpflichtige Termine kannst du bei der Buchung über Stripe bezahlen (Stripe Payments Europe Ltd., Dublin, Irland). Dabei werden deine Zahlungsdaten direkt an Stripe übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. [Baustein aus dem Generator übernehmen.]

---

## 6. Offene Punkte für Lea

- [ ] Leistungen, Dauer und Preise festlegen (auch für `src/data/` und die Leistungsseite).
- [ ] Vor Ort, online oder beides? Praxisadresse?
- [ ] Videodienst wählen (Zoom, Meet oder Teams).
- [ ] Vorauszahlung ja/nein? Stornoregel?
- [ ] Zeeg-Konto anlegen, einrichten, testen, AVV abschließen.
- [ ] Buchungslink und Einbettungscode an den Entwickler schicken (Abschnitt 4.9).

---

## Quellen

Alle abgerufen am **16.11.2026** per Websuche. Die Anbieterseiten selbst ließen sich aus der Arbeitsumgebung nicht direkt öffnen. Bitte vor Vertragsabschluss gegenprüfen. Mit (M) markierte Quellen stammen von Mitbewerbern bzw. Vergleichsportalen mit eigenem Produkt.

1. Zeeg-Hilfe: „Den richtigen Zeeg-Plan für dein Team wählen“ – <https://zeeg.me/de/help/articles/13868316-den-richtigen-zeeg-plan-fur-dein-team-wahlen>
2. Zeeg: Preise – <https://zeeg.me/en/pricing>; Zeeg vs. Cal.com – <https://zeeg.me/en/comparison/calcom-alternative>
3. Zeeg: Startseite und Kontakt (Sitz Berlin, Telekom-Server) – <https://zeeg.me/en>, <https://zeeg.me/en/contact>
4. Zeeg-Hilfe: GDPR Compliance – <https://zeeg.me/en/help/articles/12582752-gdpr-compliance>; Zeeg-Blog: Zeeg GDPR – <https://zeeg.me/en/blog/post/zeeg-gdpr>
5. Zeeg: Vereinbarung zur Auftragsverarbeitung (PDF) – <https://assets.zeeg.me/AVV.pdf>
6. Zeeg-Hilfe: Embedding Zeeg on your site – <https://zeeg.me/en/help/articles/12582767-embedding-zeeg-on-your-site>; Embed on WordPress – <https://zeeg.me/en/help/articles/13886561-how-to-embed-zeeg-on-wordpress>
7. Zeeg-Hilfe: Protecting personal information in email and calendar notifications – <https://zeeg.me/en/help/articles/14779650-protecting-personal-information-in-email-and-calendar-notifications>
8. trusted.de: eTermin Kosten – <https://trusted.de/etermin-kosten>, <https://trusted.de/etermin>
9. SoftGuide: eTermin – <https://www.softguide.de/programm/etermin>; Capterra: eTermin – <https://www.capterra.com.de/software/188696/etermin>
10. eTermin: AV-Vertrag (PDF) – <https://www.etermin.net/Downloads/eTermin-Online-Terminbuchung_ADV_DSGVO.pdf>
11. eTermin-Support: Einbindung in Ihre Webseite – <https://support.etermin.net/hc/de/articles/360023921732-eTermin-Einbindung-in-Ihre-Webseite>; Möglichkeiten der Einbindung – <https://support.etermin.net/hc/de/articles/360012662159>
12. eTermin-Support: Einbindung in Zoom – <https://support.etermin.net/hc/de/articles/360030074471-eTermin-Einbindung-in-Zoom>
13. Digistore24: eTermin Pro – <https://www.digistore24.com/product/327513>
14. GetApp: Terminland – <https://www.getapp.de/software/107897/terminland>
15. Capterra: Terminland – <https://www.capterra.com.de/software/184381/terminland>
16. Zeeg (M): Terminland-Alternative – <https://zeeg.me/de/vergleich/terminland-alternative>; europeanpurpose.com: Terminland – <https://europeanpurpose.com/tool/terminland>
17. SimplyBook.me: Vergleich mit Acuity (inkl. Preistabelle) – <https://simplybook.me/de/simplybook-me-vs-acuity-scheduling>
18. Zeeg (M): SimplyBook.me Preise – <https://zeeg.me/de/blog/content/simplybookme-preise>; Koalendar (M) – <https://koalendar.com/de/blog/simplybookme-preise>
19. meetergo (M): SimplyBook-Alternative DSGVO – <https://meetergo.com/blog/simplybook-alternative-dsgvo>
20. meetergo (M): Appointy-Alternative EU-Hosting – <https://www.meetergo.com/blog/appointy-alternative-eu-hosting>
21. SimplyBook: DPA v2.3 – <https://simplybook.asia/uk/legal/dpa/v2.3>; Privacy Policy – <https://simplybook.me/nl/policy/v2.0>
22. Cal.com: Preise – <https://cal.com/de/pricing>
23. Koalendar (M): Cal.com pricing – <https://koalendar.com/blog/cal-com-pricing>; Zeeg (M) – <https://zeeg.me/en/blog/post/cal-com-pricing>
24. Cal.com-Blog: Cal.eu to Cal.com Migration – <https://cal.com/blog/cal.eu-to-cal.com-migration>
25. DEV Community: „Cal.eu is closing on Nov 1“ – <https://dev.to/shockalotti/caleu-is-closing-on-nov-1-here-is-your-migration-playbook-26la>
26. meetergo (M): Cal.com EU Hosting – <https://meetergo.com/en/magazine/cal-com-eu-hosting>
27. Cal.com: DPF / Data Privacy Framework – <https://cal.com/dpf-data-privacy-framework>
28. Zeeg (M): Calendly Pricing – <https://zeeg.me/en/blog/post/calendly-standard-plan>; schedulingkit – <https://www.schedulingkit.com/pricing-guides/calendly-pricing>
29. Calendly: Data Processing Addendum – <https://calendly.com/dpa>; complydog: Is Calendly GDPR compliant – <https://complydog.com/blog/is-calendly-gdpr-compliant>
30. Calendly-Hilfe: Datenspeicherung und internationale Übermittlung – <https://calendly.com/pt/help/data-storage-and-international-data-transfers.html>
31. Pabau (M): Acuity Scheduling Price – <https://pabau.com/blog/acuity-scheduling-price/>; Koalendar (M) – <https://koalendar.com/de/blog/acuity-scheduling-preise>
32. AccountableHQ: Is Acuity Scheduling HIPAA compliant – <https://www.accountablehq.com/post/is-acuity-scheduling-hipaa-compliant-baa-and-plan-requirements-explained>
33. meetergo (M): Microsoft Bookings Kosten – <https://meetergo.com/blog/microsoft-bookings-kosten>
34. heise: Microsoft 365 Preiserhöhung ab Juli 2026 – <https://heise.de/-11103991>
35. trusted.de: Shore Kosten – <https://trusted.de/shore-kosten>
36. Pabau (M): Shore Preise – <https://pabau.com/de/blog/shore-preise/>
37. GIGA: Was kostet Doctolib? – <https://www.giga.de/tech/was-kostet-doctolib-diese-preise-und-tarife-gibt-es-aktuell--01KPN5Y6VMKWGMSGVS4BDCZ046>
