export default function SearchBar({ search, onSearchChange, categoria, onCategoriaChange }) {
  const categorias = ['Todas', 'Ropa', 'Electrónica', 'Hogar', 'Deportes', 'Belleza']

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre..."
          className="input-field pl-10"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <select
        value={categoria}
        onChange={(e) => onCategoriaChange(e.target.value)}
        className="input-field sm:w-48 cursor-pointer"
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat} className="bg-surface-card">
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}