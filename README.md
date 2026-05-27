# 🛍️ AdminShop - Panel Administrativo E-Commerce

Panel de control para gestionar el inventario de productos de una tienda en línea. Desarrollado como prueba técnica para el cargo de Desarrollador Frontend Junior.

## 🌍 Demo en vivo

https://ecommerce-admin-ashen-tau.vercel.app

## 🚀 Stack Tecnológico

- **Framework:** React.js + Vite
- **Enrutamiento:** react-router-dom v6
- **Estilos:** Tailwind CSS
- **Alertas:** SweetAlert2
- **Persistencia de sesión:** LocalStorage
- **HTTP:** Fetch API
- **API Mock:** MockAPI.io

## 🌐 URL de la API

https://6a163d401b90031f81b0d138.mockapi.io/productos

## ✨ Funcionalidades

- Autenticación simulada con usuario y PIN
- Rutas protegidas (sin login no se puede acceder al panel)
- Navbar con nombre del usuario logueado y botón de cerrar sesión
- Ver todos los productos en un grid de tarjetas
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos con confirmación de SweetAlert2
- Buscador por nombre y filtro por categoría
- Indicadores de carga (spinners)
- Diseño responsivo

## 🖥️ Instrucciones para correr el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/sepumarcela/ecommerce-admin.git

# 2. Entrar a la carpeta
cd ecommerce-admin

# 3. Instalar dependencias
npm install

# 4. Correr en desarrollo
npm run dev
```

Abrir en el navegador: http://localhost:5173

## 🔐 Credenciales de prueba

Cualquier nombre de usuario y PIN numérico de mínimo 4 dígitos son válidos (es una simulación).

## 📁 Estructura del proyecto

```
src/
├── components/   # Navbar, ProductCard, SearchBar, Spinner
├── pages/        # LoginPage, ProductsPage, ProductFormPage
├── services/     # api.js - todas las peticiones HTTP
├── hooks/        # useAuth.js
└── layouts/      # ProtectedLayout.jsx
```