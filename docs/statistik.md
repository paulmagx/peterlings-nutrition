# Besucherstatistik ohne Cookies – Auswahl und Empfehlung (Issue #36)

Stand der Recherche: **16.11.2026**. Alle Preise, Serverstandorte und Cookie-Aussagen stammen aus Drittquellen (Vergleichsportalen, Blogs) und **nicht** aus den Anbieter-Seiten. Die Anbieter-Seiten waren in der Recherche-Umgebung nicht erreichbar. **Vor der Entscheidung bitte auf den jeweiligen Seiten gegenprüfen**, besonders Preise und Serverstandort.

## 1. Anforderungen

- Keine Cookies, kein Speichern auf dem Gerät der Besucherin.
- Server in der EU, möglichst in Deutschland, Auftragsverarbeitungsvertrag (AVV) verfügbar.
- Bezahlbar für eine kleine Praxis-Website.
- Einfaches Script mit `data-domain`, damit der Code in `src/components/Analytics.astro` passt.
- Kein Einwilligungsbanner nötig (siehe Abschnitt 3 zur Rechtslage).

## 2. Vergleich

| Dienst                       | Hosting laut Quellen                                                         | Cookies laut Anbieter/Quellen                                                                 | Preis (Drittquellen, widersprüchlich)                              | Einwilligungsbanner nötig?                                                                                                     | Hinweis                                                                                                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plausible Cloud**          | EU; Berichte nennen Hetzner, Firmensitz Estonia                              | Nein, keine Cookies, keine personenbezogenen Daten                                            | ab ca. 9 USD/Monat (10 000 Seitenaufrufe); Angaben schwanken stark | Nach Anbieteraussage nein                                                                                                      | Bekanntester Dienst dieser Art, gute Dokumentation, Script nutzt `data-domain`. Auch selbst hostbar (AGPL).                                                                                                                                         |
| **Pirsch**                   | Mehrere Quellen: Server in Deutschland                                       | Nein, laut Anbieter/Quellen mit täglich wechselndem Hash statt Cookies                        | ab ca. 4–6 €/Monat (10 000 Seitenaufrufe); Angaben widersprüchlich | Nach Anbieteraussage nein                                                                                                      | Deutscher Anbieter, Server in DE. Script weicht von Plausible ab, Anpassung in `Analytics.astro` nötig.                                                                                                                                             |
| **Simple Analytics**         | EU; Quellen nennen Leaseweb, Niederlande                                     | Nein, laut Anbieter keine Cookies                                                             | ab ca. 9–20 €/Monat; Angaben widersprüchlich                       | Nach Anbieteraussage nein                                                                                                      | Anbieter weist selbst darauf hin, dass EU-Hosting allein keinen Schutz vor US-Zugriff (CLOUD Act) bietet.                                                                                                                                           |
| **Matomo Cloud**             | Eigene Aussage laut Quellen: Server in Deutschland (Frankfurt)               | Konfigurierbar; mit Konfiguration ohne Cookies möglich                                        | ab ca. 19–29 €/Monat (50 000 Hits); Angaben widersprüchlich        | Ohne Cookies und mit passender Konfiguration laut Quellen möglich; Ausnahmen je nach Aufsichtsbehörde (CNIL-Leitfaden genannt) | Umfangreich und mächtig. Die Ausnahme vom Einwilligungserfordernis hängt an einer genau passenden Konfiguration (keine User-ID, kein Geräteübergreifendes Tracking, Plugins wie Heatmaps können Einwilligung nötig machen). Mehr Aufwand als nötig. |
| **Cloudflare Web Analytics** | USA-Konzern; EU-Datenresidenz im Gratis-Produkt laut Quellen nicht vorhanden | Umstritten: Anbieter sagt keine Cookies, eine Kritik nennt aber eine Kennung pro Seitenaufruf | Kostenlos                                                          | Unklar, Quellen widersprechen sich                                                                                             | Datenübermittlung in die USA (Standardvertragsklauseln). Für eine Praxis-Website mit Datenschutzanspruch nicht empfohlen.                                                                                                                           |

Ausgeschlossen: Google Analytics (Cookies, Übermittlung in die USA, Einwilligung nötig).

## 3. Rechtlicher Rahmen (Einschätzung, keine Rechtsberatung)

- **§ 25 TDDDG** (früher § 25 TTDSG): Speichern von Informationen auf dem Endgerät oder Zugriff darauf braucht grundsätzlich Einwilligung, außer die Speicherung ist unbedingt erforderlich. Ein Dienst ohne Cookies und ohne Zugriff auf Gerätedaten fällt nach überwiegender Auffassung nicht unter § 25. **Wichtig:** Das ist eine Einschätzung und muss gegen den Originaltext von § 25 TDDDG geprüft werden. Die Quelle war nicht abrufbar.
- **DSGVO Art. 6 Abs. 1 lit. f** (berechtigtes Interesse): Cookieloses Messen wird meist darauf gestützt. Dafür braucht es eine dokumentierte Interessenabwägung und einen Eintrag in der Datenschutzerklärung mit Widerspruchshinweis.
- **Auftragsverarbeitung**: Mit dem Anbieter einen AVV abschließen, Link zum AVV ins Konto-Dashboard prüfen.
- **Pflicht**: Die Datenschutzerklärung (`src/pages/datenschutz.astro`, Abschnitt-Array `sections`) muss den Dienst nennen, bevor die Statistik live geht. Der Hinweis dort betrifft genau diesen Schritt.

## 4. Empfehlung

**Plausible Cloud** als erste Wahl: EU-Hosting laut Quellen, cookielos, Script mit `data-domain` (passt zur vorbereiteten Konfiguration), gute Dokumentation, und bei Bedarf Umstieg auf Self-Hosting möglich.

**Pirsch** als Alternative, falls Lea einen deutschen Anbieter mit Serverstandort Deutschland bevorzugt. Dann `scriptSrc` und Einbindung in `Analytics.astro` anpassen.

Nicht empfohlen: Cloudflare Web Analytics (USA, Cookie-Frage ungeklärt), Google Analytics.

Vor der Entscheidung zu prüfen: aktuelle Preise, Serverstandort und AVV auf der Anbieter-Seite; ob der Dienst im Konto tatsächlich ohne Cookies läuft (Browser-Entwicklertools, Reiter „Anwendung/Speicher“, nach Aufruf der Seite).

## 5. Einrichtung (nach Entscheidung)

1. Konto beim gewählten Dienst anlegen (Lea), Domain eintragen.
2. Script-URL in `src/data/analytics.ts` (`scriptSrc`) und Live-Domain (`domain`) eintragen.
3. Datenschutzerklärung mit dem Textbaustein unten ergänzen.
4. `enabled: true` setzen. Nur im Produktions-Build wird das Script ausgegeben.
5. Im Produktions-Build prüfen, dass das Script-Tag im HTML erscheint, und im Dev-Modus, dass es fehlt.

## 6. Textbaustein für die Datenschutzerklärung

Für `src/pages/datenschutz.astro` als neuer Abschnitt. Platzhalter in eckigen Klammern ausfüllen.

> **Reichweitenmessung**
>
> Wir messen die Zugriffe auf diese Website mit [Name des Dienstes], einem Dienst des Anbieters [Firmenname, Anschrift des Anbieters]. Dabei werden keine Cookies gesetzt und keine Daten auf deinem Gerät gespeichert. Erfasst werden u. a. aufgerufene Seiten, ungefähres Land, Herkunft des Aufrufs (Referrer) und Browsertyp in aggregierter Form. Die Daten werden laut Anbieter auf Servern in [Serverstandort, z. B. Deutschland / EU] verarbeitet. Eine Zuordnung zu einzelnen Personen findet nicht statt. Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO) an einer Auswertung der Nutzung unseres Angebots. Du kannst dieser Verarbeitung widersprechen [Hinweis zum Widerspruch, z. B. per Kontakt oder über die Option des Anbieters]. Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). Weitere Informationen: [Link zur Datenschutzerklärung des Anbieters].

Hinweis: Der Textbaustein ist ein Entwurf. Vor Veröffentlichung rechtlich prüfen lassen oder mit einem Generator abgleichen (wie in `datenschutz.astro` vermerkt).

## 7. Quellen (Abrufdatum 16.11.2026)

Drittquellen aus Suchergebnissen, nicht von den Anbietern selbst:

- Plausible: Vergleichsportale europeanstack.pages.dev/software/plausible, eupicks.pages.dev/blog/plausible-vs-google-analytics/, europeanpurpose.com/tool/plausible
- Pirsch: eupicks.pages.dev/blog/best-eu-analytics-tools-2026/, europeanstack.pages.dev/software/pirsch, euro-stack.com/solutions/pirsch
- Simple Analytics: simpleanalytics.com/pricing (Suchergebnis, Seite nicht abrufbar), europeanstack.pages.dev/software/simple-analytics, simpleanalytics.com/eu-hosted-analytics (Suchergebnis)
- Matomo: matomo.org/get/gdpr-alternative-google-analytics-no-2x/ (Suchergebnis), site-freelance-3ls.pages.dev/en/blog/matomo-exemption-cnil-guide/ (CNIL-Leitfaden-Zusammenfassung)
- Cloudflare: ctrl.blog/entry/review-cloudflare-analytics/ (Kritik), blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web/ (Anbieter-Ankündigung)
- Rechtstext: gesetze-im-internet.de/ttdsg/__25.html (**nicht abrufbar**, Inhalt aus Erinnerung, zu prüfen)

**Nicht abrufbar in der Recherche-Umgebung:** plausible.io, pirsch.io, simpleanalytics.com, matomo.org, gesetze-im-internet.de. Diese Domains müssen für eine Nachprüfung im Netzwerk freigegeben werden.
