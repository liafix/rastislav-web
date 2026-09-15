import { defineConfig } from "drizzle-kit";

// Generation only. No credentials or legacy migration journal are used.
// Apply reviewed SQL only after a separate trial database is explicitly confirmed.
export default defineConfig({
  schema: "./db/krovex-schema.ts",
  out: "./db/krovex-migrations",
  dialect: "mysql",
  strict: true,
  verbose: false
});
