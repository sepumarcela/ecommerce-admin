import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { deleteProducto } from '../services/api'

const CATEGORIA_COLORS = {
  Ropa:        { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  Electrónica: { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/20'   },
  Hogar:       { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  Deportes:    { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  Belleza:     { bg: 'bg-pink-500/10',   text: 'text-pink-400',   border: 'border-pink-500/20'   },
}

export default function ProductCard({ producto, onDeleted }) {
  const navigate = useNavigate()
  const colores = CATEGORIA_COLORS[producto.categoria] || {
    bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20'
  }

  const stockStatus = () => {
    if (producto.stock === 0) return { label: 'Sin stock', cls: 'text-red-400' }
    if (producto.stock <= 5)  return { label: `${producto.stock} uds — Bajo`, cls: 'text-amber-400' }
    return { label: `${producto.stock} uds`, cls: 'text-emerald-400' }
  }

  const { label: stockLabel, cls: stockCls } = stockStatus()

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      html: `<span>Se eliminará <strong>${producto.nombre}</strong> del catálogo permanentemente.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      await deleteProducto(producto.id)
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El producto fue eliminado del catálogo.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
      onDeleted(producto.id)
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar el producto.', icon: 'error' })
    }
  }

  return (
    <div className="card group flex flex-col overflow-hidden animate-slide-up
                    hover:border-brand-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-950/50">
      <div className="relative h-44 bg-surface overflow-hidden">
        <img
          src={producto.imagen || `https://picsum.photos/seed/${producto.id}/400/300`}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${producto.id}/400/300` }}
        />
        <span className={`absolute top-3 left-3 badge border ${colores.bg} ${colores.text} ${colores.border}`}>
          {producto.categoria}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-display font-semibold text-white leading-tight line-clamp-2">
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-display font-bold text-white">
            ${Number(producto.precio).toLocaleString('es-CO')}
          </span>
          <span className={`text-xs font-body font-medium ${stockCls}`}>
            {stockLabel}
          </span>
        </div>

        <div className="flex gap-2 pt-2 border-t border-surface-border">
          <button
            onClick={() => navigate(`/productos/editar/${producto.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                       text-sm font-display font-medium text-gray-300 hover:text-white
                       hover:bg-surface-hover border border-surface-border hover:border-brand-700/50
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                       text-sm font-display font-medium text-red-400 hover:text-red-300
                       hover:bg-red-500/10 border border-transparent hover:border-red-500/20
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Borrar
          </button>
        </div>
      </div>
    </div>
  )
}