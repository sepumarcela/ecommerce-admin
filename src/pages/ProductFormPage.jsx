import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { createProducto, updateProducto, getProductoById } from '../services/api'
import Spinner from '../components/Spinner'

const CATEGORIAS = ['Ropa', 'Electrónica', 'Hogar', 'Deportes', 'Belleza']
const INITIAL_FORM = { nombre: '', precio: '', categoria: 'Ropa', stock: '', imagen: '' }

export default function ProductFormPage() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const isEditing = Boolean(id)

  const [form, setForm]         = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEditing)

  useEffect(() => {
    if (!isEditing) return
    const load = async () => {
      try {
        setFetching(true)
        const data = await getProductoById(id)
        setForm({
          nombre:    data.nombre    || '',
          precio:    String(data.precio)  || '',
          categoria: data.categoria || 'Ropa',
          stock:     String(data.stock)   || '',
          imagen:    data.imagen    || '',
        })
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudo cargar el producto.', icon: 'error' })
          .then(() => navigate('/productos'))
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id, isEditing, navigate])

  const validate = () => {
    const errs = {}
    if (!form.nombre.trim())             errs.nombre = 'El nombre es requerido.'
    if (form.precio === '')              errs.precio = 'El precio es requerido.'
    else if (Number(form.precio) < 0)    errs.precio = 'El precio no puede ser negativo.'
    else if (isNaN(Number(form.precio))) errs.precio = 'El precio debe ser un número.'
    if (form.stock === '')               errs.stock  = 'El stock es requerido.'
    else if (Number(form.stock) < 0)     errs.stock  = 'El stock no puede ser negativo.'
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

    const payload = {
      nombre:    form.nombre.trim(),
      precio:    Number(form.precio),
      categoria: form.categoria,
      stock:     Number(form.stock),
      imagen:    form.imagen.trim() || `https://picsum.photos/seed/${form.nombre}/400/300`,
    }

    try {
      setLoading(true)
      if (isEditing) {
        await updateProducto(id, payload)
      } else {
        await createProducto(payload)
      }
      await Swal.fire({
        title: isEditing ? '¡Actualizado!' : '¡Creado!',
        text: isEditing ? 'Producto actualizado correctamente.' : 'Producto añadido al catálogo.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
      navigate('/productos')
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message || 'No se pudo guardar.', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <Spinner message="Cargando producto..." />

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <button
        onClick={() => navigate('/productos')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inventario
      </button>

      <div className="card p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-xl font-display font-bold text-white">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing ? 'Modifica los campos que necesites.' : 'Completa los campos para añadir un artículo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="nombre" className="label">Nombre del producto *</label>
            <input
              id="nombre" name="nombre" type="text"
              value={form.nombre} onChange={handleChange}
              placeholder="ej. Camiseta Deportiva Nike Pro"
              className={`input-field ${errors.nombre ? 'border-red-500' : ''}`}
            />
            {errors.nombre && <p className="mt-1.5 text-xs text-red-400">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="label">Precio (COP) *</label>
              <input
                id="precio" name="precio" type="number" min="0"
                value={form.precio} onChange={handleChange}
                placeholder="0"
                className={`input-field ${errors.precio ? 'border-red-500' : ''}`}
              />
              {errors.precio && <p className="mt-1.5 text-xs text-red-400">{errors.precio}</p>}
            </div>
            <div>
              <label htmlFor="stock" className="label">Stock (unidades) *</label>
              <input
                id="stock" name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange}
                placeholder="0"
                className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
              />
              {errors.stock && <p className="mt-1.5 text-xs text-red-400">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="categoria" className="label">Categoría *</label>
            <select
              id="categoria" name="categoria"
              value={form.categoria} onChange={handleChange}
              className="input-field cursor-pointer"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat} className="bg-surface-card">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imagen" className="label">URL de imagen <span className="text-gray-600 font-normal">(opcional)</span></label>
            <input
              id="imagen" name="imagen" type="url"
              value={form.imagen} onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="input-field"
            />
            {form.imagen && (
              <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-surface-border">
                <img src={form.imagen} alt="Preview" className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/productos')} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEditing ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>{isEditing ? 'Guardar cambios' : 'Crear producto'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}