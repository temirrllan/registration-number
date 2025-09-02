const path = require('path')
const dotenv = require('dotenv')
const { Pool } = require('pg')

// Загружаем .env, который лежит рядом (server/.env) ИЛИ на уровень выше (../.env).
// Попробуем оба варианта — сначала локальный, затем корневой.
const localEnvLoaded = dotenv.config({ path: path.join(__dirname, '.env') })
if (localEnvLoaded.error) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') })
}

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'registration_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  // ssl: { rejectUnauthorized: false } // включи это, если используешь облачный Postgres c SSL
})

pool.on('error', (err) => {
  console.error('Unexpected PG error', err)
  process.exit(1)
})

module.exports = { pool }
