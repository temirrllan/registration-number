import { Pool } from 'pg'

let pool = globalThis.__pgPool
if (!pool) {
  const cs = process.env.DATABASE_URL
  if (!cs) throw new Error('DATABASE_URL is not set')

  pool = new Pool({
    connectionString: cs,
    // Render обычно даёт URL с sslmode=require. Это помогает на некоторых рантаймах:
    ssl: { rejectUnauthorized: false }
  })

  globalThis.__pgPool = pool
}

export { pool }
