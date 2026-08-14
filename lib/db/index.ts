import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const globalForDb = globalThis as unknown as { __chatPool?: Pool }

export const pool =
  globalForDb.__chatPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb.__chatPool = pool
}

export const db = drizzle(pool, { schema })
