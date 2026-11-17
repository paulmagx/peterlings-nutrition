/** Ist `href` die aktuelle Seite (oder eine Unterseite davon)? */
export function isActive(currentPath: string, href: string): boolean {
  const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
  const current = normalize(currentPath);
  const target = normalize(href);
  return target === "/"
    ? current === "/"
    : current === target || current.startsWith(`${target}/`);
}
