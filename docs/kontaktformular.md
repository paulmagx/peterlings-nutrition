# Kontaktformular: Versand-Optionen (Issue #27)

Die Website ist statisch, deshalb braucht das Formular einen externen Dienst, der die Nachrichten annimmt und per E-Mail weiterleitet. Im Code steht der Endpunkt in `src/data/forms.ts` (`contactFormEndpoint`). Solange dort `TODO(Lea): Formular-Endpunkt` steht, zeigt `/kontakt` nur einen Hinweis mit E-Mail-Link.

**Wichtiger Hinweis zur Recherche:** Beim Erstellen waren die Anbieter-Websites aus der Entwicklungsumgebung nicht erreichbar (Netzwerksperre), und die Websuche lieferte nur Vergleichsblogs. Preise, Limits und AVV-Details unten sind deshalb teils **nicht an der Quelle geprüft** (mit „zu prüfen“ markiert). Vor der Entscheidung bitte direkt auf der Anbieter-Seite nachsehen. Das Formular enthält bewusst keine Gesundheitsdaten-Felder, trotzdem kann in Freitext etwas Persönliches stehen, daher ist ein AV-Vertrag (Art. 28 DSGVO) Pflicht.

## Optionen

| Option               | Hosting / Datenschutz                                                                                        | Preis                                                            | Einschätzung                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Formbricks Cloud** | Cloud in Deutschland, Open Source, auch selbst hostbar [1][2]                                                | Free-Plan laut Vergleich 500 Einreichungen/Monat [1] (zu prüfen) | **Empfehlung** (EU-Hosting, Open Source). Ist eher ein Umfrage-Tool; Einbindung per API-Endpunkt oder eigenes Formular prüfen.                  |
| **Tally**            | Datenhosting in Belgien [3]                                                                                  | Kostenlose Formulare laut Borncity [3] (zu prüfen)               | Gut für DSGVO, aber Tally liefert ein eigenes Formular (Embed/Link) und keinen reinen POST-Endpunkt. Passt weniger zu unserem eigenen Formular. |
| **Formspree**        | Verarbeitung in den USA; ein (konkurrierender) Vergleich rät EU-Firmen ab [1]. Free: nur 30 Tage Verlauf [1] | Free-Plan klein (zu prüfen)                                      | Technisch am einfachsten (reiner POST-Endpunkt), datenschutzrechtlich aber schwächer. Nur mit Drittland-Garantien/AVV.                          |
| **Netlify Forms**    | Anbieter USA/EU-Infrastruktur, AVV verfügbar (zu prüfen)                                                     | Free-Kontingent (zu prüfen)                                      | Funktioniert nur, wenn die Seite bei Netlify gehostet wird. Hosting ist noch offen, daher erst danach relevant.                                 |

Nicht empfohlen: Typeform/Jotform (EU-Hosting meist erst in Enterprise-Tarifen, 25–99 €/Monat laut [3]) und meetergo (EU-Hosting laut [4] nur im Enterprise-Tarif).

## Empfehlung

**Formbricks (Cloud, Rechenzentrum Deutschland)** oder, falls ein reiner POST-Endpunkt wichtiger ist, ein EU-gehosteter Formular-Backend-Dienst mit AVV. Falls die Seite ohnehin bei Netlify gehostet wird, ist Netlify Forms die einfachste Lösung (kein Endpunkt, nur das Attribut `data-netlify="true"` am Formular, dazu AVV prüfen).

## Einrichtungsschritte (allgemein)

1. Dienst auswählen, Konto anlegen, AV-Vertrag abschließen und in der Datenschutzerklärung (`src/pages/datenschutz.astro`) den Dienst als Auftragsverarbeiter nennen.
2. Formular/Endpunkt im Dienst anlegen; Empfänger-E-Mail (Leas Adresse) hinterlegen.
3. Den Endpunkt (URL) in `src/data/forms.ts` bei `contactFormEndpoint` eintragen. Dann sendet das Formular per `POST` (auch ohne JavaScript); mit JavaScript per `fetch` mit Erfolgs- oder Fehlermeldung.
4. Im Dienst den Honeypot-Feldnamen `website` als Spam-Feld eintragen (falls unterstützt) und ggf. die Weiterleitung nach dem Senden (Danke-Seite) einstellen. Der JSON-Header `Accept: application/json` wird mitgeschickt.
5. Testnachricht senden; prüfen, dass sie bei Lea ankommt und die Datenschutz-Checkbox mitgeliefert wird.
6. Bei Netlify Forms: stattdessen `data-netlify="true"` und `name` am `<form>` ergänzen (Code-Anpassung nötig, da dort kein externer Endpunkt eingetragen wird).

## Quellen

1. Formbricks, „Open source Formspree alternative“: https://formbricks.com/vs-formspree
2. Hashnode, „Formspree Alternatives in 2026“: https://hashnode.com/posts/formspree-alternatives-in-2026-open-source-cheaper-and-self-hostable/69bbd0138c55d6eefbcd7d26
3. Borncity, „Google Forms-Alternative: Deutsche Anbieter mit DSGVO-Hosting“: https://borncity.com/news/google-forms-alternative-deutsche-anbieter-mit-dsgvo-hosting/
4. meetergo, „Google Forms Alternative“: https://meetergo.com/blog/google-forms-alternative

Offen / selbst zu prüfen: Netlify-Forms-Preise und AVV (docs.netlify.com und netlify.com/legal), aktuelle Preise der genannten Anbieter.
