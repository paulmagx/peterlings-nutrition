/**
 * Leistungen als Daten. Wird von der Leistungsseite und (als Kurzübersicht) von der Startseite genutzt.
 * Inhalte stammen aus dem Prototyp (legacy/services.html) und sind noch nicht mit Lea abgestimmt.
 */
export type Service = {
  id: string;
  category: string;
  title: string;
  /** Preis in Euro, ohne Währungszeichen. */
  price: number;
  /** Abrechnungshinweis, z. B. „einmalig“. */
  priceNote: string;
  summary: string;
  features: string[];
  /** Empfohlene Leistung, wird auf der Seite hervorgehoben. */
  highlighted: boolean;
  /** Material-Symbols-Name. */
  icon: string;
};

export const services: Service[] = [
  {
    id: "einzelberatung",
    category: "Einstieg",
    title: "Einzelberatung (60 Min)",
    // TODO(Lea): Preis bestätigen
    price: 89,
    priceNote: "einmalig",
    summary:
      "Gemeinsam schauen wir auf deine Essgewohnheiten, deine Ziele und deine gesundheitlichen Voraussetzungen und finden deinen Weg.",
    features: [
      "Anamnese und Status quo",
      "Zieldefinition",
      "Konkrete Handlungsempfehlungen",
    ],
    highlighted: false,
    icon: "chat-outline-rounded",
  },
  {
    id: "ernaehrungsplaene",
    category: "Maßgeschneidert",
    title: "Individuelle Ernährungspläne",
    // TODO(Lea): Preis bestätigen
    price: 129,
    priceNote: "pauschal",
    summary:
      "Keine Diät, sondern ein Lebensstil: Du bekommst Rezepte und Pläne, die zu deinem Alltag passen.",
    features: [
      "Auf dich abgestimmt",
      "Leckere Rezepte",
      "Einkaufsliste",
      "Alltagstauglich",
      "Nachhaltig",
    ],
    highlighted: true,
    icon: "restaurant-rounded",
  },
  {
    id: "einkaufstraining",
    category: "Praxis",
    title: "Einkaufstraining und Kühlschrank-Check",
    // TODO(Lea): Preis bestätigen
    price: 69,
    priceNote: "pauschal",
    summary:
      "Wir schauen uns deine Vorräte an oder gehen gemeinsam einkaufen. Du lernst, Etiketten zu lesen und passende Alternativen zu finden.",
    features: ["Vorräte-Check", "Gemeinsam einkaufen", "Etiketten verstehen"],
    highlighted: false,
    icon: "shopping-basket-outline-rounded",
  },
];

/** Kurzfassung für die Leistungsübersicht auf der Startseite. */
export const serviceTeasers = services.map(
  ({ id, title, summary, icon, price, priceNote }) => ({
    id,
    title,
    summary,
    icon,
    price,
    priceNote,
    href: `/leistungen#${id}`,
  }),
);
