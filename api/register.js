import { getPool } from './_db.js'

function isStringFilled(x) {
  return typeof x === 'string' && x.trim() !== ''
}

async function readJson(req) {
  return await new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }

  try {
    const body = await readJson(req)
    const { name, email, phone, bio } = body || {}

    if (![name, email, phone, bio].every(isStringFilled)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ ok: false, error: 'Все поля обязательны' }))
    }

    const pool = getPool()
    const q = `
      INSERT INTO public.registrations (name, email, phone, bio)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at;
    `
    const params = [name.trim(), email.trim(), phone.trim(), bio.trim()]
    const { rows } = await pool.query(q, params)

    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, id: rows[0].id, created_at: rows[0].created_at }))
  } catch (e) {
    console.error('register error:', e)
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
