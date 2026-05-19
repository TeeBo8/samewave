import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // On utilise l'URL unpooled pour les migrations (pgbouncer ne supporte pas le DDL)
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
})
