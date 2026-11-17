import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** Blog-Bereich „Wissen“ (Rezepte und Wissensartikel). Anleitung: docs/wissen-beitraege.md */
const wissen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/wissen" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(["Rezept", "Wissen"]),
      image: image().optional(),
      /** Alternativtext zum Bild. */
      imageAlt: z.string().optional(),
      /** Entwürfe erscheinen nur im Dev-Server, nie im Produktions-Build. */
      draft: z.boolean().default(false),
      // Nur bei Rezepten
      portions: z.string().optional(),
      prepTime: z.string().optional(),
      ingredients: z.array(z.string()).optional(),
    }),
});

export const collections = { wissen };
