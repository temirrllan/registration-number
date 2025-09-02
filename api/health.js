import { getPool } from './_db.js'

export default async function handler(req, res) {
  try {
    const pool = getPool()
    const r = await pool.query('SELECT current_database() AS db')
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, db: r.rows[0].db }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      ok: false,
      error: {
        code: e?.code || 'UNKNOWN',
        message: (e?.message || '').slice(0, 140)
      }
    }))
  }
}
