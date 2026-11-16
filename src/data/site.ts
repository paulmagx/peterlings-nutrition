/** Zentrale Angaben zur Website. Inhalte werden in Meilenstein 2 mit Lea final abgestimmt. */
export const site = {
  name: "Peterlings Nutrition",
  shortName: "Peterlings",
  tagline: "Ernährungsberatung mit Lea Petruschka",
  description:
    "Individuelle Ernährungsberatung mit Lea Petruschka – alltagstauglich, wissenschaftlich fundiert und ganzheitlich.",
};

export type NavItem = { label: string; href: string; icon: string };

/** Hauptnavigation: Header (Desktop) und Tab-Leiste (Handy). */
export const mainNav: NavItem[] = [
  { label: "Start", href: "/", icon: "home-outline-rounded" },
  {
    label: "Leistungen",
    href: "/leistungen",
    icon: "menu-book-outline-rounded",
  },
  { label: "Über mich", href: "/ueber-mich", icon: "person-outline-rounded" },
  { label: "Kontakt", href: "/kontakt", icon: "mail-outline-rounded" },
];

export const bookingLink: NavItem = {
  label: "Termin buchen",
  href: "/termin",
  icon: "calendar-today-outline-rounded",
};

export const legalNav = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];
