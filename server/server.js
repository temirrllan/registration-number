const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const { pool } = require('./db')

// .env (как и в db.js) — попробуем сначала локальный, затем корневой
let envLoaded = dotenv.config({ path: path.join(__dirname, '.env') })
if (envLoaded.error) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') })
}

const app = express()
app.use(cors())
app.use(express.json())

// Валидация всех полей (все обязательные)
function validatePayload(body) {
  const required = ['name', 'email', 'phone', 'bio']
  for (const key of required) {
    if (typeof body[key] !== 'string' || body[key].trim() === '') {
      return `Field "${key}" is required`
    }
  }
  return null
}

// POST /api/register — сохраняем запись
app.post('/api/register', async (req, res) => {
  try {
    const error = validatePayload(req.body || {})
    if (error) {
      return res.status(400).json({ ok: false, error })
    }

    const { name, email, phone, bio } = req.body
    const q = `
      INSERT INTO public.registrations (name, email, phone, bio)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at;
    `
    const params = [name.trim(), email.trim(), phone.trim(), bio.trim()]
    const { rows } = await pool.query(q, params)

    return res.status(201).json({ ok: true, id: rows[0].id, created_at: rows[0].created_at })
  } catch (err) {
    console.error('POST /api/register error:', err)
    return res.status(500).json({ ok: false, error: 'Internal server error' })
  }
})

// (опционально) простая проверка соединения
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false })
  }
})

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log('API listening on http://localhost:' + PORT)
})
