/**
 * Kundenstimmen als Daten. Wird von der Komponente `Testimonials.astro` gerendert.
 *
 * Regeln:
 * - Nur echte Stimmen, und nur mit schriftlicher Einwilligung der Person (Datum in `consentDate`).
 * - Keine Heilversprechen (z. B. „hat meine Krankheit geheilt“, „Darmprobleme gelöst“).
 *   Erlaubt sind Aussagen wie „hat mir geholfen“ oder „hat mich begleitet“.
 * - Keine erfundenen Stimmen, keine Sterne-Bewertungen.
 * - Vorlage für die Einwilligung: `docs/inhalte-von-lea.md`, Abschnitt 5.
 *
 * Beispiel (auskommentiert, so nicht veröffentlichen):
 * // {
 * //   quote: "Die Beratung hat mir geholfen, im Alltag besser auf meinen Körper zu achten.",
 * //   name: "Sabine M.",
 * //   context: "Kundin seit 2025",
 * //   consentDate: "2026-01-15",
 * // },
 */
export type Testimonial = {
  /** Das Zitat in der Originalformulierung der Person. */
  quote: string;
  /** Darstellung des Namens, wie in der Einwilligung gewählt, z. B. „Sabine M.“ oder „Kundin“. */
  name: string;
  /** Optionaler Zusatz, z. B. „Kundin seit 2025“. */
  context?: string;
  /** Datum der schriftlichen Einwilligung, Format JJJJ-MM-TT. Pflichtfeld. */
  consentDate: string;
};

export const testimonials: Testimonial[] = [];
