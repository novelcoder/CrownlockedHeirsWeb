import type { MetadataRoute } from "next";
import { getSeriesBooks } from "@/lib/books";
import { SITE_ORIGIN } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getSeriesBooks();

  return [
    {
      url: `${SITE_ORIGIN}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_ORIGIN}/privacy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_ORIGIN}/bjargfold`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...books.map((book) => ({
      url: `${SITE_ORIGIN}/books/${book.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
