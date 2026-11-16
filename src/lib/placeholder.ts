/** Platzhalter aus `src/data/site.ts` beginnen mit "TODO" (z. B. "TODO(Lea) …") und dürfen nie als echte Daten erscheinen. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.trim().startsWith("TODO");
}
