import { pool } from './_db.js'

export default async function handler(req, res) {
  try {
    await pool.query('SELECT 1')
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: false }))
  }
}
