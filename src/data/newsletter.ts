/**
 * Newsletter-Anmeldung (Issue #35).
 * Anbieter-Vergleich und Einrichtung: docs/newsletter.md
 *
 * Die Komponente `NewsletterSignup.astro` (im Footer) erscheint nur, wenn
 * `enabled` true ist UND `formAction` kein "TODO"-Platzhalter mehr ist.
 * Vor dem Einschalten: AV-Vertrag abschließen und die Datenschutzerklärung
 * ergänzen (Textbaustein in docs/newsletter.md).
 */
export const newsletter = {
  /** Schalter. Erst auf true stellen, wenn Dienst, AVV und Datenschutztext fertig sind. */
  enabled: false,
  /** Name des Dienstes, nur zur Dokumentation (z. B. "Brevo", "rapidmail"). */
  provider: "TODO(Lea): Newsletter-Dienst",
  /** Ziel des Anmeldeformulars (POST). Die Adresse liefert der Dienst im Formular-Editor. */
  formAction: "TODO(Lea): Formular-URL des Newsletter-Dienstes",
  /** Datenschutzerklärung, auf die der Einwilligungstext verlinkt. */
  privacyUrl: "/datenschutz",
};
