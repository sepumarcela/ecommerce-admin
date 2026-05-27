const BASE_URL = 'https://6a163d401b90031f81b0d138.mockapi.io'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Error ${response.status}: ${error}`)
  }
  return response.json()
}

export const getProductos = async () => {
  const response = await fetch(`${BASE_URL}/productos`)
  return handleResponse(response)
}

export const getProductoById = async (id) => {
  const response = await fetch(`${BASE_URL}/productos/${id}`)
  return handleResponse(response)
}

export const createProducto = async (producto) => {
  const response = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })
  return handleResponse(response)
}

export const updateProducto = async (id, producto) => {
  const response = await fetch(`${BASE_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  })
  return handleResponse(response)
}

export const deleteProducto = async (id) => {
  const response = await fetch(`${BASE_URL}/productos/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}