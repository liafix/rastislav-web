import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

let cachedPool: mysql.Pool | null = null;
let cachedDb: ReturnType<typeof createDatabase> | null = null;

export function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for database-backed commerce routes.");
  }
}

function createDatabase() {
  cachedPool = mysql.createPool({
    uri: process.env.DATABASE_URL as string,
    connectionLimit: 5,
    decimalNumbers: false,
    namedPlaceholders: true
  });

  return drizzle(cachedPool, { schema, mode: "default" });
}

export function getDb() {
  if (!cachedDb) {
    assertDatabaseUrl();
    cachedDb = createDatabase();
  }

  return cachedDb;
}
