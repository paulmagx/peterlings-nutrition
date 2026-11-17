/** Zentrale Angaben zur Website. Inhalte werden in Meilenstein 2 mit Lea final abgestimmt. */
export const site = {
  name: "Peterlings Nutrition",
  shortName: "Peterlings",
  tagline: "Ernährungsberatung mit Lea Petruschka",
  description:
    "Individuelle Ernährungsberatung mit Lea Petruschka – alltagstauglich, persönlich und ganzheitlich.",
};

export type NavItem = { label: string; href: string; icon: string };

/** Hauptnavigation: Kopfzeile (Desktop) und Menü (Handy). */
export const mainNav: NavItem[] = [
  { label: "Start", href: "/", icon: "home-outline-rounded" },
  {
    label: "Leistungen",
    href: "/leistungen",
    icon: "handshake-outline-rounded",
  },
  { label: "Wissen", href: "/wissen", icon: "menu-book-outline-rounded" },
  { label: "Über mich", href: "/ueber-mich", icon: "person-outline-rounded" },
  { label: "Kontakt", href: "/kontakt", icon: "mail-outline-rounded" },
];

export type SocialLink = { label: string; href: string; icon: string };

/**
 * Social-Media-Profile für den Footer. Leer = keine Icon-Leiste.
 * TODO(Lea): Nur echte Profile eintragen. Material Symbols hat keine Marken-Logos,
 * deshalb neutrale Icons nutzen (z. B. "photo-camera-outline-rounded" oder "link-rounded").
 * Beispiel:
 * { label: "Instagram", href: "https://www.instagram.com/DEIN_PROFIL", icon: "photo-camera-outline-rounded" },
 */
export const socialLinks: SocialLink[] = [];

export const bookingLink: NavItem = {
  label: "Termin buchen",
  href: "/termin",
  icon: "calendar-today-outline-rounded",
};

export const legalNav = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

/**
 * Kontakt- und Praxisdaten.
 * Alles mit "TODO(Lea)" ist ein Platzhalter und muss vor dem Livegang ersetzt werden (Issue #20).
 * Hier niemals erfundene Daten als echt ausgeben.
 */
export const contact = {
  owner: "Lea Petruschka",
  email: "TODO(Lea)@peterlings-nutrition.de",
  phone: "TODO(Lea)",
  street: "TODO(Lea) Straße und Hausnummer",
  city: "TODO(Lea) PLZ Ort",
  /** TODO(Lea): Beratung vor Ort, online oder beides? Bitte bestätigen (wird auf Start- und Kontaktseite angezeigt). */
  formats: ["vor Ort", "online"],
};
