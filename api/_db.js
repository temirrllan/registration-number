// api/_db.js
import { Pool } from 'pg'

let pool = globalThis.__pgPool || null

export function getPool() {
  if (pool) return pool

  const cs = process.env.DATABASE_URL
  if (!cs) {
    const err = new Error('DATABASE_URL is not set')
    err.code = 'NO_DATABASE_URL'
    throw err
  }

  pool = new Pool({
    connectionString: cs,
    // Render обычно требует sslmode=require; эта строка помогает на Node runtime в Vercel
    ssl: { rejectUnauthorized: false },
  })

  pool.on('error', (e) => {
    // лог в рантайме функции, видно в Vercel → Functions → Logs
    console.error('pg pool error', e)
  })

  globalThis.__pgPool = pool
  return pool
}
