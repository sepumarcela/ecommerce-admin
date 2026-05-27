import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos } from '../services/api'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../components/Spinner'

export default function ProductsPage() {
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [categoria, setCategoria] = useState('Todas')

  useEffect(() => { fetchProductos() }, [])

  const fetchProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleted = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id))
  }

  const productosFiltrados = productos.filter((p) => {
    const matchNombre    = p.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCategoria = categoria === 'Todas' || p.categoria === categoria
    return matchNombre && matchCategoria
  })

  const totalValor = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  const sinStock   = productos.filter((p) => p.stock === 0).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Inventario</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-body">Gestiona el catálogo de productos</p>
        </div>
        <button
          onClick={() => navigate('/productos/nuevo')}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo producto
        </button>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total productos',   value: productos.length,                              color: 'text-brand-400'   },
            { label: 'Valor inventario',  value: `$${totalValor.toLocaleString('es-CO')}`,      color: 'text-emerald-400' },
            { label: 'Sin stock',         value: sinStock,                                      color: sinStock > 0 ? 'text-red-400' : 'text-gray-400' },
            { label: 'Resultados filtro', value: productosFiltrados.length,                     color: 'text-amber-400'   },
          ].map((stat) => (
            <div key={stat.label} className="card px-4 py-3">
              <p className="text-xs font-body text-gray-500">{stat.label}</p>
              <p className={`text-xl font-display font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <SearchBar
        search={search} onSearchChange={setSearch}
        categoria={categoria} onCategoriaChange={setCategoria}
      />

      {loading && <Spinner message="Cargando inventario..." />}

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 p-6 text-center space-y-3">
          <p className="text-red-400 font-display font-medium">Error al cargar los productos</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button onClick={fetchProductos} className="btn-secondary">Reintentar</button>
        </div>
      )}

      {!loading && !error && productosFiltrados.length === 0 && (
        <div className="card p-12 text-center space-y-3">
          <p className="font-display font-semibold text-gray-400">
            {productos.length === 0 ? 'No hay productos aún' : 'Sin resultados'}
          </p>
          <p className="text-sm text-gray-600">
            {productos.length === 0 ? 'Añade el primer producto al catálogo' : 'Intenta con otro término o categoría'}
          </p>
          {productos.length === 0 && (
            <button onClick={() => navigate('/productos/nuevo')} className="btn-primary">
              Añadir primer producto
            </button>
          )}
        </div>
      )}

      {!loading && !error && productosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  )
}