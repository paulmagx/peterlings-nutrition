// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO (Meilenstein 4): echte Domain eintragen, sobald sie feststeht.
  site: "https://www.peterlings-nutrition.de",
  vite: {
    plugins: [tailwindcss()],
  },
});
