/**
 * Konfiguration der datenschutzfreundlichen Besucherstatistik (Issue #36).
 *
 * Auswahl, Quellen und Textbaustein für die Datenschutzerklärung: docs/statistik.md.
 * Die Statistik ist bewusst AUS (`enabled: false`). Sie wird nur im Produktions-Build
 * ausgegeben, und nur wenn `enabled` true ist und `scriptSrc` kein Platzhalter mehr ist
 * (siehe `src/components/Analytics.astro`).
 */

export const analytics = {
  /** Erst auf true setzen, wenn Konto und Script-URL eingetragen und die Datenschutzerklärung angepasst ist. */
  enabled: false,

  /**
   * Gewählter Dienst (Empfehlung aus docs/statistik.md, vorbehaltlich Lea's Entscheidung).
   * Nur zur Dokumentation; das Script-Tag hängt an `scriptSrc`.
   */
  provider: "plausible",

  /**
   * URL des Tracking-Scripts, z. B. "https://plausible.io/js/script.js" (Standard bei Plausible Cloud).
   * TODO(Lea): Script-URL aus dem Konto-Dashboard des Anbieters eintragen,
   * sobald das Konto angelegt ist. Bei Plausible kann das Script-Tag ggf. eine
   * abweichende Variante (z. B. mit Erweiterungen) enthalten, dann genau diese URL nehmen.
   */
  scriptSrc: "TODO(Lea): Script-URL des Statistik-Dienstes eintragen",

  /**
   * Domain, unter der die Website im Statistik-Dienst geführt wird (wird als `data-domain` ausgegeben).
   * TODO(Lea): Live-Domain eintragen, z. B. "peterlings-nutrition.de" (ohne https://).
   */
  domain: "TODO(Lea): Live-Domain eintragen",
} as const;
