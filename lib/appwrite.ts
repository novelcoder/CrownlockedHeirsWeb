import "server-only";
import { Client, TablesDB, Query } from "node-appwrite";

const SERIES_TABLE_ID = "series";
const BOOKS_TABLE_ID = "books";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let tablesDB: TablesDB | null = null;

function getTablesDB(): TablesDB {
  if (!tablesDB) {
    const client = new Client()
      .setEndpoint(requiredEnv("CMS_ENDPOINT"))
      .setProject(requiredEnv("CMS_PROJECT_ID"))
      .setKey(requiredEnv("CMS_API_KEY"));
    tablesDB = new TablesDB(client);
  }
  return tablesDB;
}

export type AppwriteRow = Record<string, unknown>;

export async function getSeriesBySlug(
  slug: string,
): Promise<AppwriteRow | null> {
  const res = await getTablesDB().listRows({
    databaseId: requiredEnv("CMS_DATABASE_ID"),
    tableId: SERIES_TABLE_ID,
    queries: [Query.equal("slug", slug), Query.limit(1)],
  });
  return res.rows[0] ?? null;
}

export async function listBookRowsBySeriesId(
  seriesId: string,
): Promise<AppwriteRow[]> {
  const res = await getTablesDB().listRows({
    databaseId: requiredEnv("CMS_DATABASE_ID"),
    tableId: BOOKS_TABLE_ID,
    queries: [
      Query.equal("series_id", seriesId),
      Query.orderAsc("series_number"),
      Query.limit(100),
    ],
  });
  return res.rows;
}

export async function getBookBySlugInSeries(
  seriesId: string,
  slug: string,
): Promise<AppwriteRow | null> {
  const res = await getTablesDB().listRows({
    databaseId: requiredEnv("CMS_DATABASE_ID"),
    tableId: BOOKS_TABLE_ID,
    queries: [
      Query.equal("series_id", seriesId),
      Query.equal("slug", slug),
      Query.limit(1),
    ],
  });
  return res.rows[0] ?? null;
}
