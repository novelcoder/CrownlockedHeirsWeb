import {
  getBookBySlugInSeries,
  getSeriesBySlug,
  listBookRowsBySeriesId,
  type AppwriteRow,
} from "@/lib/appwrite";

const SERIES_SLUG = "crownlocked-heirs";

export type Book = {
  id: string;
  slug: string;
  order: number;
  title: string;
  status: string;
  statusLabel: string;
  tagline?: string;
  cardDescription?: string;
  blurb?: string[];
  coverUrl?: string;
  coverAlt?: string;
  storeUrl?: string;
  storeLabel?: string;
  audibleUrl?: string;
  releaseDate?: string;
};

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
}

function formatStatusLabel(status: string) {
  return status
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function destinationDomain(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return "unknown";
  }
}

function mapBookRow(row: AppwriteRow, index: number): Book {
  const status = asString(row.status) ?? "";
  const blurb = asString(row.blurb);

  return {
    id: asString(row.$id) ?? asString(row.slug) ?? `book-${index}`,
    slug: asString(row.slug) ?? asString(row.$id) ?? `book-${index}`,
    order: asNumber(row.series_number) ?? index + 1,
    title: asString(row.title) ?? "Untitled",
    status,
    statusLabel: status ? formatStatusLabel(status) : "",
    tagline: asString(row.tagline),
    cardDescription: asString(row.card_description),
    blurb: blurb
      ? blurb.split(/\n{2,}/).map((paragraph) => paragraph.trim())
      : undefined,
    coverUrl: asString(row.cover_url),
    coverAlt: asString(row.cover_alt),
    storeUrl: asString(row.store_url),
    storeLabel: asString(row.store_label),
    audibleUrl: asString(row.audible_url),
    releaseDate: asString(row.release_date),
  };
}

export async function getSeriesBooks(): Promise<Book[]> {
  try {
    const series = await getSeriesBySlug(SERIES_SLUG);
    const seriesId = series ? asString(series.$id) : undefined;
    if (!seriesId) return [];

    const rows = await listBookRowsBySeriesId(seriesId);
    return rows.map(mapBookRow).sort((a, b) => a.order - b.order);
  } catch (err) {
    console.warn(
      "Could not load books from Appwrite:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const series = await getSeriesBySlug(SERIES_SLUG);
    const seriesId = series ? asString(series.$id) : undefined;
    if (!seriesId) return null;

    const row = await getBookBySlugInSeries(seriesId, slug);
    return row ? mapBookRow(row, 0) : null;
  } catch (err) {
    console.warn(
      "Could not load book from Appwrite:",
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}
