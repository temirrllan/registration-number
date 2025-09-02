import { useState } from 'react'

export default function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorText, setErrorText] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorText('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorText(
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.code || 'Ошибка сервера'
        )
        throw new Error('Request failed')
      }

      setStatus('success')
      setForm({ name: '', email: '', phone: '', bio: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="container">
      <h2>Регистрация</h2>

      <form method="post" action="#" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Полное имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Электронная почта</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Номер телефона</label>
          <input
            type="tel"
            inputMode="numeric"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <p className="form-hint">
            Номер телефона нужен для подтверждения и входа в систему
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="bio">О себе</label>
          <textarea
            rows="3"
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Отправка...' : 'Далее'}
          </button>
        </div>

        {status === 'success' && (
          <p className="msg ok">Данные успешно отправлены.</p>
        )}
        {status === 'error' && (
          <p className="msg err">
            Произошла ошибка. {errorText && <>Код: <b>{errorText}</b></>}
          </p>
        )}
      </form>
    </div>
  )
}
