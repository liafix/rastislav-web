import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let cachedPool: mysql.Pool | null = null;
let cachedDb: ReturnType<typeof createDatabase> | null = null;

export function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for database-backed routes.");
  }
}

function createDatabase() {
  cachedPool = mysql.createPool({
  uri: process.env.DATABASE_URL as string,
  connectionLimit: 5,
  decimalNumbers: false,
  namedPlaceholders: true,
  timezone: "Z",
  ssl: process.env.DATABASE_SSL === "true"
    ? {
        minVersion: "TLSv1.2"
      }
    : undefined
});

  return drizzle(cachedPool, { mode: "default" });
}

export function getDb() {
  if (!cachedDb) {
    assertDatabaseUrl();
    cachedDb = createDatabase();
  }

  return cachedDb;
}
