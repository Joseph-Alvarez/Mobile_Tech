# Tienda de Accesorios — Vite + React + Supabase

Catálogo público + panel de administración para subir productos, precios e imágenes desde el celular.

Este proyecto usa **Vite** (React + JavaScript + React Compiler, tal como lo configuraste en el CLI)
con **React Router** para las rutas, ya que Vite no trae ruteo por carpetas como Next.js.

## 1. Configurar Supabase

1. Ejecuta el script `schema_tienda.sql` en el **SQL Editor** de tu proyecto Supabase.
2. Ve a **Storage** → crea un bucket llamado `productos`, márcalo como **público**.
3. Ve a **Authentication → Users** → **Add user** → crea tu usuario admin (correo + contraseña). Es el único login que existe; no hay registro público.
4. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public key`

## 2. Configurar el proyecto

```bash
npm install
cp .env.example .env
```

Edita `.env` y pega tu URL y anon key de Supabase (deben empezar con `VITE_`, es como Vite expone
variables al navegador).

```bash
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`) para el catálogo, y
`/admin` para el panel.

## 3. Desplegar en línea (gratis)

Como es una SPA de Vite (no Next.js), puedes desplegarla en **Vercel**, **Netlify** o **Cloudflare Pages** — todas soportan Vite de forma nativa.

**Con Vercel:**
1. Sube el proyecto a GitHub.
2. Importa el repo en [vercel.com](https://vercel.com). Vercel detecta Vite automáticamente.
3. Agrega las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la configuración del proyecto.
4. Despliega.

**Importante para SPAs:** como las rutas (`/producto/123`, `/admin/productos`) no existen como
archivos reales, si alguien recarga la página en una de esas rutas el servidor debe redirigir a
`index.html`. Vercel y Netlify hacen esto automático al detectar un proyecto Vite/SPA; si usas otro
hosting, busca cómo configurar "SPA fallback" o "rewrites a index.html".

## 4. Uso diario desde el celular

- Entra a `tudominio.com/admin` desde el navegador del celular.
- Inicia sesión.
- **Nuevo producto**: nombre, modelo, categoría, precio, descripción, colores (opcional) y fotos.
- **Lista de productos**: cambia el precio directo ahí (edita el número y toca fuera del campo para guardar), oculta/muestra un producto, o edítalo por completo.
- Los cambios se reflejan de inmediato en el catálogo — no hay que "publicar" nada aparte.

### Tip: agrégalo como app en tu celular

En Chrome/Safari, abre `tudominio.com/admin`, usa el menú del navegador → **"Agregar a pantalla de inicio"**.

## Estructura del proyecto

```
src/
  main.jsx              → punto de entrada
  App.jsx                → define todas las rutas (React Router)
  pages/
    Catalogo.jsx          → catálogo público ("/")
    ProductoDetalle.jsx   → detalle de producto ("/producto/:id")
    admin/
      AdminLogin.jsx       → login ("/admin")
      AdminProductos.jsx   → lista + edición rápida ("/admin/productos")
      NuevoProducto.jsx    → crear producto
      EditarProducto.jsx   → editar producto
  components/
    ProductoForm.jsx      → formulario compartido (crear/editar)
    ProductCard.jsx, Navbar.jsx, AdminGuard.jsx
  lib/
    supabaseClient.js, storage.js
```
