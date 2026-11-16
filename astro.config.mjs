// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO (Meilenstein 4): echte Domain eintragen, sobald sie feststeht.
  // Bei Domainwechsel auch public/robots.txt anpassen.
  site: "https://www.peterlings-nutrition.de",
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  vite: {
    plugins: [tailwindcss()],
  },
});
