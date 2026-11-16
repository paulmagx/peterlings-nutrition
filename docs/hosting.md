# Hosting und Domain (Issue #32)

Ziel: Die Seite geht ohne Wartungsaufwand online, wird bei jedem Update aus GitHub automatisch veröffentlicht, läuft mit HTTPS auf der eigenen Domain und ist datenschutzrechtlich sauber (Art. 28 DSGVO). Konten anlegen und Domains verbinden kann nur Lea (bzw. der Betreiber); diese Anleitung ist so vorbereitet, dass es in etwa 30 Minuten erledigt ist.

**Hinweis zur Recherche (Stand 16.11.2026):** Die Anbieter-Websites waren aus der Entwicklungsumgebung nicht abrufbar (Netzwerksperre), nur eine Websuche mit Auszügen. Alle Angaben unten stammen aus Suchergebnissen und Drittquellen und sind mit **(zu prüfen)** markiert, wenn sie nicht an der Anbieter-Seite bestätigt sind. Bitte Preise, AV-Vertrag und Standortangaben vor dem Abschluss auf der Anbieter-Seite gegenprüfen.

## 1. Vergleich

| Kriterium                           | **Netlify**                                                                                                      | **Cloudflare Pages**                                                                   | **GitHub Pages**                                                                                        | **statichost.eu** (EU)                                                       | **Uberspace / Hetzner / netcup** (DE)                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Preis                               | Free-Plan: 300 Credits/Monat, harter Deckel, kein Überverbrauch [1][2]. Reicht für eine kleine Seite (zu prüfen) | Free-Plan; 500 Builds/Monat [5]                                                        | Kostenlos, aber im Gratis-Tarif muss das Repository öffentlich sein [6]                                 | „Hobby“ kostenlos, 10 GB Traffic, 100 Build-Minuten; „Starter“ 9 €/Monat [7] | Uberspace: Preis frei wählbar, Richtwert ca. 6 € [8][9]; netcup ab ca. 2 € [10]; Hetzner ab ca. 2 € [10] (alle zu prüfen) |
| Standort / Drittland                | US-Unternehmen, globales CDN, kein reiner EU-Betrieb belegt. DPF-zertifiziert, SCC im AVV [3][4]                 | US-Konzern, globales Netz; EU-Datenresidenz im Gratis-Produkt nicht belegt (zu prüfen) | US-Konzern (Microsoft); Absicherung über GitHubs DPA/SCC, nicht abschließend belegt (zu prüfen) [6][11] | Nach eigener Angabe vollständig europäische Infrastruktur [7] (zu prüfen)    | Deutschland (Uberspace: Firma in Mainz; Rechenzentrum zu prüfen) [8]; Hetzner/netcup Deutschland [10]                     |
| AV-Vertrag                          | Ja, DPA mit SCC zum Unterschreiben (zu prüfen, ob im Free-Plan) [3][4]                                           | Ja, DPA in den Vertragsbedingungen (zu prüfen)                                         | Ja, über GitHubs DPA (zu prüfen, ob für kostenlose Konten)                                              | Vorhanden laut Anbieterbeschreibung (zu prüfen) [7]                          | Bei den deutschen Hostern üblich und online abschließbar (zu prüfen)                                                      |
| Automatisches Deployment aus GitHub | Ja, Git-Anbindung, Deploy-Vorschau pro Pull Request                                                              | Ja, Git-Anbindung                                                                      | Ja, über GitHub Action                                                                                  | Ja, Git-Deploy [7]                                                           | Nur per SFTP/SSH; Automatisierung über eine eigene GitHub-Action mit Zugangsdaten nötig                                   |
| Formulare                           | **Netlify Forms** eingebaut, seit April 2026 unbegrenzte Einsendungen [1]                                        | Nein (nur mit eigener Funktion/Fremddienst)                                            | Nein                                                                                                    | Nein                                                                         | Nur mit eigenem Skript/PHP (bei reinem statischem Webspace nicht ohne Weiteres)                                           |
| Eigene Domain + HTTPS               | Ja, Zertifikat von Let's Encrypt automatisch                                                                     | Ja, automatisch                                                                        | Ja, automatisch                                                                                         | Ja                                                                           | Ja (Let's Encrypt, meist automatisch)                                                                                     |
| Server-Logs                         | IP-Adressen werden verarbeitet; Speicherdauer im AVV/Datenschutztext des Anbieters prüfen                        | Ebenso (zu prüfen)                                                                     | Ebenso (Logs nicht konfigurierbar, zu prüfen)                                                           | zu prüfen                                                                    | Logs konfigurierbar, bei vielen Hostern kürzbar/anonymisierbar [12]                                                       |
| Headers/CSP frei einstellbar        | Ja, `netlify.toml`                                                                                               | Ja, `_headers`                                                                         | **Nein** (keine eigenen HTTP-Header)                                                                    | Ja (zu prüfen)                                                               | Ja, über `.htaccess` bzw. Webserver-Konfiguration                                                                         |

## 2. Empfehlung

**Netlify (kostenloser Plan)**: Die Seite wird bei jedem Push automatisch gebaut, HTTPS und Domain sind in Minuten eingerichtet, die Sicherheits-Header liegen als `netlify.toml` im Repository, und mit **Netlify Forms** gibt es ein Kontaktformular ohne weiteren Anbieter (ein Auftragsverarbeiter weniger, kostenlos). Netlify ist ein US-Unternehmen: Es braucht den AV-Vertrag mit Standardvertragsklauseln (DPA) und einen Hinweis auf die Drittlandübermittlung in der Datenschutzerklärung. Das ist üblich und beherrschbar, bleibt aber ein Restrisiko, falls das Data Privacy Framework kippt (Quelle [4] weist darauf hin).

**Wenn Lea keine Übermittlung in die USA möchte:** statichost.eu (EU-Infrastruktur, Git-Deploy, kostenloser Einstieg [7]). Dann ändern sich nur zwei Dinge: Das Kontaktformular läuft über einen EU-Formulardienst (siehe `docs/kontaktformular.md`), und die Header kommen aus einer `_headers`-Datei bzw. den Einstellungen des Anbieters (Inhalte aus `netlify.toml` übernehmen). Das genaue Header-Verfahren bei statichost.eu bitte in dessen Dokumentation prüfen.

Nicht empfohlen: GitHub Pages (keine eigenen Header, Repository muss öffentlich sein, kein Formular). Klassischer Webspace (Hetzner/netcup/Uberspace) ist datenschutzfreundlich, aber ohne Git-Anbindung; jedes Update müsste per SFTP oder eine eigene GitHub-Action mit Zugangsdaten hochgeladen werden, das ist für den Betrieb aufwendiger.

## 3. Anleitung für Netlify (ca. 30 Minuten)

Voraussetzungen: GitHub-Zugang zum Repository, Zugang zur Domain-Verwaltung beim Registrar (dort, wo die Domain gekauft wurde).

### 3.1 Konto und Repository verbinden

1. Auf netlify.com mit „Sign up with GitHub“ ein Konto anlegen. E-Mail-Adresse der Betreiberin verwenden, Zwei-Faktor-Anmeldung aktivieren.
2. „Add new project“ → „Import an existing project“ → GitHub → Repository `peterlings-nutrition` auswählen (Netlify fragt nach Zugriff auf genau dieses Repository).
3. Die Einstellungen kommen aus `netlify.toml` und sollten schon vorausgefüllt sein. Zur Kontrolle:
   - Branch: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Umgebungsvariable `NODE_VERSION` = `22` (steht ebenfalls in `netlify.toml`)
4. „Deploy“. Nach etwa einer Minute ist die Seite unter `https://<name>.netlify.app` erreichbar. Dort alle Seiten durchklicken, eine nicht vorhandene Adresse aufrufen (404-Seite).
5. Optional unter „Project configuration → Project name“ den Namen ändern.

### 3.2 Domain verbinden

Empfohlen ist `www.peterlings-nutrition.de` als Hauptadresse (so steht es in `astro.config.mjs`); die Adresse ohne `www` leitet Netlify dann automatisch weiter. Die Domain-Namen unten sind Beispiele und müssen zur tatsächlich gewählten Domain passen.

1. In Netlify: „Domain management“ → „Add a domain“ → `peterlings-nutrition.de` eintragen.
2. Als Hauptdomain (Primary domain) `www.peterlings-nutrition.de` festlegen.
3. Beim Registrar bzw. DNS-Anbieter die Einträge setzen, die Netlify im Dialog anzeigt. Üblicherweise (Werte in Netlify gegenprüfen):

   | Name                  | Typ     | Wert                              |
   | --------------------- | ------- | --------------------------------- |
   | `www`                 | `CNAME` | `<projektname>.netlify.app`       |
   | `@` (Domain ohne www) | `A`     | die IP-Adresse, die Netlify nennt |

   Alternativ kann man die Nameserver der Domain auf „Netlify DNS“ umstellen; das ist einfacher, legt aber die gesamte DNS-Verwaltung (auch E-Mail-Einträge wie MX, SPF) in Netlify. **Vorhandene MX-/TXT-Einträge für E-Mail nicht löschen.**

4. Warten (Minuten bis einige Stunden), bis Netlify die Domain als „verified“ anzeigt.

### 3.3 HTTPS

1. „Domain management → HTTPS → Verify DNS configuration“, dann „Provision certificate“ (Let's Encrypt). Läuft in der Regel automatisch.
2. „Force HTTPS“ aktivieren, sofern angeboten.
3. Prüfen: `http://…` leitet auf `https://…` um, kein Zertifikatshinweis im Browser. Den Header-Test unter securityheaders.com durchführen (Ziel: gute Bewertung, CSP und HSTS vorhanden).

### 3.4 AV-Vertrag (Art. 28 DSGVO)

1. Auf netlify.com/gdpr den Link zum „Data Processing Addendum (DPA)“ öffnen. Laut Quelle [3] ist es von Netlify bereits unterschrieben; die Kundin füllt es aus und schickt es zurück **(zu prüfen, ob der Ablauf unverändert ist und ob er im Free-Plan möglich ist)**.
2. Das unterschriebene Dokument dauerhaft ablegen (Vertragsordner).
3. In Netlify unter „Team settings“ die Rechnungs-/Kontaktadresse mit der Firmierung der Betreiberin hinterlegen.
4. Falls Netlify den AV-Vertrag im Free-Plan nicht anbietet: auf einen bezahlten Plan wechseln oder zu statichost.eu (Abschnitt 2) gehen. Ohne AV-Vertrag nicht live gehen.

### 3.5 Kontaktformular mit Netlify Forms (optional, empfohlen)

Wird in Abschnitt 4 als Code-Änderung beschrieben. In Netlify danach unter „Forms → Form notifications“ eine E-Mail-Benachrichtigung an Leas Adresse einrichten und einmal eine Testnachricht senden.

### 3.6 Automatische Veröffentlichung

Jeder Push auf `main` löst einen neuen Build aus (Netlify baut selbst, die GitHub-Action `build.yml` prüft zusätzlich Format und Typen). Für Pull Requests erzeugt Netlify eine Vorschau-Adresse. Für Vorschauen sollte das Netlify-Konto nur das eine Repository sehen. Eine eigene Deployment-Action ist nicht nötig; es werden keine Zugangsdaten in GitHub abgelegt.

## 4. Was danach im Code anzupassen ist

- [ ] **`astro.config.mjs`**: `site` auf die endgültige Hauptadresse setzen (aktuell `https://www.peterlings-nutrition.de`). Das TODO-Kommentar entfernen.
- [ ] **`public/robots.txt`**: Sitemap-Zeile auf dieselbe Domain setzen.
- [ ] **`netlify.toml`**: Content-Security-Policy anpassen, sobald sich externe Dienste ändern. Die Zeile `frame-src` erlaubt nur `zeeg.me` (Buchung, `src/data/booking.ts`) und `www.openstreetmap.org` (Karte, `src/pages/kontakt.astro`). Bei einem anderen Buchungsanbieter, Statistik (z. B. `script-src` und `connect-src` für den Plausible-Host aus `src/data/analytics.ts`) oder Newsletter (`form-action`) die jeweilige Domain ergänzen und danach neu testen (siehe Abschnitt 5). Die URL aus `booking.embedUrl` muss unter `frame-src` fallen; zeeg.me-Subdomains sind schon abgedeckt, das tatsächliche Embed-Host (aus dem Zeeg-Code) vor dem Livegang prüfen.
- [ ] **`src/pages/datenschutz.astro`, Abschnitt „Hosting“**: das `todo` ersetzen durch Angaben zum Anbieter (für Netlify: Netlify, Inc., Anschrift laut Impressum/Datenschutzerklärung des Anbieters; Verarbeitung auch in den USA; Grundlage: Vertrag zur Auftragsverarbeitung mit Standardvertragsklauseln und Zertifizierung unter dem EU-US Data Privacy Framework; Link zur Datenschutzerklärung von Netlify). Außerdem im Abschnitt „Server-Logfiles“ die Speicherdauer laut Anbieter nennen. Wird Netlify Forms genutzt: Formularversand ebenfalls dort als Auftragsverarbeitung aufführen (Nachrichten werden bei Netlify gespeichert, bis sie gelöscht werden).
- [ ] **Formular (nur bei Netlify Forms)**: In `src/components/ContactForm.astro` am `<form>` `name="contact"`, `data-netlify="true"` und `netlify-honeypot="website"` ergänzen sowie ein verstecktes Feld `<input type="hidden" name="form-name" value="contact" />` einfügen. In `src/data/forms.ts` `contactFormEndpoint` auf `"/"` setzen (POST an dieselbe Adresse; `connect-src 'self'` und `form-action 'self'` in der CSP sind darauf vorbereitet). Das vorhandene Honeypot-Feld heißt bereits `website`. Der JavaScript-Versand per `fetch` mit `Accept: application/json` kann bleiben; ohne JavaScript leitet Netlify auf eine eigene Dankeseite um (optional `action="/kontakt/"` bzw. eine eigene Dankeseite ergänzen). Nach dem ersten Deploy prüfen, dass das Formular unter „Forms“ in Netlify auftaucht. Bei Anbieterwechsel (EU-Formulardienst): URL in `contactFormEndpoint` und in der CSP unter `connect-src` und `form-action` eintragen.
- [ ] **`docs/kontaktformular.md`**: Entscheidung (Netlify Forms oder anderer Dienst) dort vermerken.
- [ ] **Impressum und Datenschutz** noch einmal gegenlesen, ob alle Dienste (Hoster, Formular, Buchung, Karte) aufgeführt sind.
- [ ] **Suchmaschinen**: Nach dem Livegang die Sitemap (`/sitemap-index.xml`) in der Google Search Console und den Bing Webmaster Tools einreichen.

## 5. Konfiguration und Test

- `netlify.toml` im Projektstamm enthält Build-Einstellungen (`npm run build`, `dist`, Node 22), Sicherheits-Header und Cache-Regeln.
  - **Content-Security-Policy**: `default-src 'self'`, Skripte und Styles nur von der eigenen Domain, `style-src-attr 'unsafe-inline'` nur für `style="…"`-Attribute (Höhe der Einbettungen), `frame-src` nur für Zeeg und OpenStreetMap, `frame-ancestors 'none'`, `object-src 'none'`.
  - **Referrer-Policy** `strict-origin-when-cross-origin`, **X-Content-Type-Options** `nosniff`, **Permissions-Policy** (Kamera, Mikrofon, Standort usw. aus), **HSTS** ein Jahr.
  - **Cache**: `/_astro/*` mit `immutable` (ein Jahr), HTML immer neu prüfen.
  - **404**: Netlify liefert `dist/404.html` automatisch bei unbekannten Adressen.
- Damit die CSP ohne `'unsafe-inline'` für Skripte auskommt, erzeugt der Build keine Inline-Skripte und -Stylesheets (`build.inlineStylesheets: "never"` und `vite.build.assetsInlineLimit: 0` in `astro.config.mjs`). Die JSON-LD-Blöcke (`<script type="application/ld+json">`) sind Daten und von der CSP nicht betroffen.
- **Lokaler Test (16.11.2026)**: `npm run build`, `dist` mit einem kleinen Server ausgeliefert, der die Header aus `netlify.toml` setzt, und alle acht Seiten (Start, Leistungen, Über mich, Termin, Kontakt inkl. Klick auf „Karte laden“, Impressum, Datenschutz, 404) in Chrome geöffnet. Ergebnis: keine CSP-Verstöße in der Konsole; ein eingeschleustes Inline-Skript wurde blockiert, `/_astro/*` lieferte `public, max-age=31536000, immutable`. **Nicht getestet:** der Zeeg-Kalender (noch nicht konfiguriert), Analytics (aus) und das echte Netlify-Verhalten (Header-Auslieferung dort bitte nach dem ersten Deploy mit securityheaders.com und der Browser-Konsole gegenprüfen).

## Quellen (Abruf 16.11.2026, über Websuche, Anbieter-Seiten nicht direkt abrufbar)

1. Netlify, Changelog „Free unlimited seats on Pro, unlimited form submissions, & updated credit rates“ (14.04.2026): https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/
2. netli.fyi, „Netlify Free Plan Limits in 2026: Credits, Bandwidth, Builds“ (Drittquelle): https://netli.fyi/blog/netlify-free-plan-limits-2026
3. Netlify, „Netlify’s commitment to protect your data“ (GDPR/DPF, DPA): https://netlify.com/gdpr-ccpa/ und DPA-PDF: https://www.netlify.com/pdf/netlify-dpa.pdf
4. sota.io, „Netlify Alternative for EU Developers 2026“ (Wettbewerber, nur als Kritikpunkt zur DPF-Rechtslage): https://sota.io/blog/netlify-alternative-eu-developers-2026-gdpr-cloud-act-paas
5. Cloudflare, „Pages Limits“: https://developers.cloudflare.com/pages/platform/limits
6. StackShare, „Cloudflare Pages vs GitHub Pages“ (öffentliches Repository, Nutzungsbedingungen; Drittquelle): https://stackshare.io/cloudflare-pages/vs/github-pages
7. statichost.eu, Preise und Startseite: https://statichost.eu/pricing, https://statichost.eu/ sowie european-alternatives.eu: https://european-alternatives.eu/de/produkt/statichost
8. Uberspace, Handbuch Abrechnung: https://manual.uberspace.de/billing-general/ und https://uberspace.de/tech
9. europeanpurpose.com, Uberspace-Eintrag (Drittquelle): https://europeanpurpose.com/tool/uberspace
10. OMR, „netcup vs. Hetzner“: https://omr.com/de/reviews/vs/netcup-versus-hetzner und HOSTtest: https://www.hosttest.de/vs/netcup-hetzner
11. Datenschutzerklärungen Dritter zu GitHub Pages (nur Hinweis auf Praxis, keine Rechtsauskunft), z. B. https://smo.leibniz-hbi.de/privacy
12. e-recht24, „Datenschutzerklärung für Server-Log-Dateien“: https://www.e-recht24.de/dsg/12725-server-log-dateien.html

Offen / selbst zu prüfen: aktuelle Preise und Limits auf netlify.com/pricing, ob der AV-Vertrag im Free-Plan abgeschlossen werden kann, Speicherdauer der Logs, DNS-Werte im Netlify-Dialog, Embed-Host von Zeeg, Rechenzentrum von Uberspace/statichost.eu.
