import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Lazy singleton — évite que neon() soit appelé au module-level pendant le build
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    _db = drizzle(neon(url), { schema })
  }
  return _db
}

export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop: string | symbol) {
    return Reflect.get(getDb(), prop)
  },
  apply(_, thisArg, args) {
    return Reflect.apply(getDb() as unknown as () => unknown, thisArg, args)
  },
})

export type DB = ReturnType<typeof getDb>
