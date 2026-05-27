import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ username: '', pin: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPin, setShowPin] = useState(false)

  if (isAuthenticated()) return <Navigate to="/productos" replace />

  const validate = () => {
    const errs = {}
    if (!form.username.trim())        errs.username = 'El nombre de usuario es requerido.'
    if (!form.pin.trim())             errs.pin = 'El PIN es requerido.'
    else if (form.pin.length < 4)     errs.pin = 'El PIN debe tener al menos 4 dígitos.'
    else if (!/^\d+$/.test(form.pin)) errs.pin = 'El PIN solo debe contener números.'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login(form.username.trim(), form.pin)
    navigate('/productos')
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-900/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="card p-8 shadow-2xl shadow-black/50">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-white">AdminShop</h1>
            <p className="mt-1 text-sm font-body text-gray-500">Panel de Control · Acceso Restringido</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="username" className="label">Nombre de usuario</label>
              <input
                id="username" name="username" type="text"
                value={form.username} onChange={handleChange}
                placeholder="ej. admin_juan"
                className={`input-field ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && <p className="mt-1.5 text-xs text-red-400">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="pin" className="label">PIN de acceso</label>
              <div className="relative">
                <input
                  id="pin" name="pin"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  value={form.pin} onChange={handleChange}
                  placeholder="Mínimo 4 dígitos"
                  className={`input-field pr-11 ${errors.pin ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPin
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {errors.pin && <p className="mt-1.5 text-xs text-red-400">{errors.pin}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar al panel
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Cualquier usuario y PIN numérico (mín. 4 dígitos) son válidos.
          </p>
        </div>
      </div>
    </div>
  )
}