import { getCollection, type CollectionEntry } from "astro:content";

export type WissenEntry = CollectionEntry<"wissen">;

/** Alle sichtbaren Beiträge, neueste zuerst. Entwürfe nur im Dev-Server. */
export async function getPosts(): Promise<WissenEntry[]> {
  const posts = await getCollection(
    "wissen",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
