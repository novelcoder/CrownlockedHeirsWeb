import "server-only";
import { Client, TablesDB, Query } from "node-appwrite";

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

export async function listBookRows(): Promise<AppwriteRow[]> {
  const res = await getTablesDB().listRows({
    databaseId: requiredEnv("CMS_DATABASE_ID"),
    tableId: requiredEnv("CMS_BOOKS_TABLE_ID"),
    queries: [Query.limit(100)],
  });
  return res.rows;
}
