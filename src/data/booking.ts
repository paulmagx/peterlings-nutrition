/**
 * Konfiguration des Online-Buchungstools für /termin.
 *
 * Auswahl, Vergleich und Einrichtungsanleitung: docs/buchungstool.md (Issue #25).
 * Alles mit "TODO(Lea)" liefert Lea nach der Einrichtung ihres Kontos (siehe Abschnitt 4.9 der Anleitung).
 * Solange eine URL noch mit "TODO(Lea)" beginnt, darf /termin das Tool nicht einbetten,
 * sondern zeigt einen Hinweis bzw. den Kontakt-Link (siehe `isBookingConfigured`).
 */

/** Kurzname des Anbieters, z. B. für Bedingungen im Code. */
export type BookingProvider = "zeeg" | "etermin";

/** Leistungen, für die es je eine eigene Buchungsseite beim Anbieter gibt. */
export type BookingService =
  "kennenlernen" | "einzelberatung" | "ernaehrungsplan" | "einkaufstraining";

export interface BookingConfig {
  /** Gewählter Anbieter (Empfehlung aus docs/buchungstool.md). */
  provider: BookingProvider;
  /** Name des Anbieters, wie er Besucherinnen angezeigt wird (Zwei-Klick-Hinweis, Datenschutz). */
  providerName: string;
  /** Firmierung und Anschrift des Anbieters für die Datenschutzerklärung. */
  providerLegal: string;
  /** Serverstandort laut Anbieter, für den Hinweistext der Zwei-Klick-Lösung. */
  serverLocation: string;
  /**
   * Öffentliche Buchungsseite mit allen Leistungen.
   * Wird als normaler Link verwendet (Fallback ohne Einwilligung, Buttons auf anderen Seiten).
   */
  bookingUrl: string;
  /**
   * URL für das iframe in `ConsentEmbed`. Wird erst nach Klick auf "Kalender laden" geladen.
   * Lea kopiert den Inline-Embed-Code aus Zeeg (Teilen → Zur Website hinzufügen → Inline-Embed);
   * der Entwickler übernimmt daraus die URL.
   */
  embedUrl: string;
  /** Mindesthöhe des iframes in Pixeln, damit der Kalender ohne innere Scrollleiste passt. */
  embedHeight: number;
  /** Datenschutzerklärung des Anbieters (verlinkt im Zwei-Klick-Hinweis und in /datenschutz). */
  privacyUrl: string;
  /** Optionale Direktlinks je Leistung, z. B. für Buttons auf der Leistungsseite. */
  serviceUrls: Partial<Record<BookingService, string>>;
}

export const booking: BookingConfig = {
  provider: "zeeg",
  providerName: "Zeeg",
  providerLegal: "Zeeg GmbH, Friedrichstr. 155, 10117 Berlin",
  // Laut Zeeg: Telekom-Rechenzentrum in Deutschland (Hilfe-Center nennt zusätzlich die Niederlande) – mit dem AVV abgleichen.
  serverLocation: "Deutschland",
  bookingUrl:
    "TODO(Lea): Link zu deiner Zeeg-Profilseite, z. B. https://zeeg.me/peterlings-nutrition",
  embedUrl:
    "TODO(Lea): Inline-Embed-Code aus Zeeg kopieren und dem Entwickler schicken",
  embedHeight: 760,
  // Abgeleitet aus der Struktur zeeg.me/<sprache>/legal/privacy (Recherche 16.11.2026) – vor dem Livegang einmal aufrufen und prüfen.
  privacyUrl: "https://zeeg.me/de/legal/privacy",
  serviceUrls: {
    // TODO(Lea): Direktlinks je Leistung, z. B. "https://zeeg.me/peterlings-nutrition/einzelberatung"
  },
};

/** true, sobald Buchungs- und Embed-URL echte Adressen sind (keine TODO-Platzhalter mehr). */
export const isBookingConfigured = [booking.bookingUrl, booking.embedUrl].every(
  (url) => url.startsWith("https://"),
);
