import { neon } from "@neondatabase/serverless"
import { config } from "dotenv"

config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL)

console.log("Dropping orphaned 'vibe' enum type...")
await sql`DROP TYPE IF EXISTS vibe CASCADE`
console.log("Done — you can now run: pnpm drizzle-kit push")
