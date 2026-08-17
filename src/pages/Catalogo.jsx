import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from '../components/ProductCard.jsx';

const categoriaColores = [
  {
    bg: 'bg-signal-500',
    border: 'border-signal-500',
    text: 'text-signal-600',
    light: 'bg-signal-50',
    hoverBorder: 'hover:border-signal-500',
    hoverText: 'hover:text-signal-600',
  },
  {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-50',
    hoverBorder: 'hover:border-blue-500',
    hoverText: 'hover:text-blue-600',
  },
  {
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
    hoverBorder: 'hover:border-emerald-500',
    hoverText: 'hover:text-emerald-600',
  },
  {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50',
    hoverBorder: 'hover:border-purple-500',
    hoverText: 'hover:text-purple-600',
  },
  {
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    text: 'text-amber-600',
    light: 'bg-amber-50',
    hoverBorder: 'hover:border-amber-500',
    hoverText: 'hover:text-amber-600',
  },
  {
    bg: 'bg-pink-500',
    border: 'border-pink-500',
    text: 'text-pink-600',
    light: 'bg-pink-50',
    hoverBorder: 'hover:border-pink-500',
    hoverText: 'hover:text-pink-600',
  },
  {
    bg: 'bg-cyan-500',
    border: 'border-cyan-500',
    text: 'text-cyan-600',
    light: 'bg-cyan-50',
    hoverBorder: 'hover:border-cyan-500',
    hoverText: 'hover:text-cyan-600',
  },
];

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);

      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from('productos')
          .select('*, categorias(*), variantes(*), imagenes(*)')
          .eq('activo', true)
          .order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('nombre'),
      ]);

      setProductos(prods ?? []);
      setCategorias(cats ?? []);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  const productosFiltrados = productos
    .filter((p) => (categoriaActiva ? p.categoria_id === categoriaActiva : true))
    .filter((p) => {
      if (!busqueda.trim()) return true;
      const q = busqueda.trim().toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        (p.modelo ?? '').toLowerCase().includes(q) ||
        (p.descripcion ?? '').toLowerCase().includes(q)
      );
    });

  const contarPorCategoria = (catId) =>
    productos.filter((p) => p.categoria_id === catId).length;

  const colorDeCategoria = (catId) => {
    const indice = categorias.findIndex((c) => c.id === catId);
    if (indice === -1) return null;
    return categoriaColores[indice % categoriaColores.length];
  };

  return (
    <div className="dark:bg-graphite-950 min-h-screen transition-colors duration-300">
      {/* Hero — ahora usa la clase hero-glow definida en index.css,
          consistente con el paper + glow naranja del resto del sitio */}
      <div className="relative overflow-hidden border-b border-graphite-100 dark:border-graphite-800 hero-glow">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-signal-300 dark:bg-signal-500/10 opacity-60 dark:opacity-100 blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-signal-100 dark:bg-graphite-700/30 opacity-50 dark:opacity-50 blur-3xl pointer-events-none animate-float-slow" />

        <div className="relative max-w-6xl mx-auto px-5 py-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-white bg-signal-500 px-2.5 py-1 rounded-card mb-4 shadow-sm shadow-signal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {productos.length} producto{productos.length === 1 ? '' : 's'} disponibles
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-graphite-900 dark:text-white mb-2 tracking-tight">
            Catálogo de <span className="text-signal-500">accesorios</span>
          </h1>
          <p className="text-graphite-400 dark:text-graphite-400 text-sm md:text-base max-w-md">
            Holders, cargadores, fundas y más para tu laptop y celular.
          </p>
        </div>
      </div>

      {/* Sección de categorías + grid — deja ver el "paper" del body
          en vez de un bg-blue-50 ajeno a la paleta, con blobs propios */}
      <div className="relative overflow-hidden dark:bg-graphite-950">
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(38, 38, 44, 0.35) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-signal-200 dark:bg-signal-500/10 opacity-40 dark:opacity-100 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-signal-100 dark:bg-purple-500/10 opacity-50 dark:opacity-60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-graphite-100 dark:bg-emerald-500/10 opacity-30 dark:opacity-40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 py-10">
          {/* Buscador — con sombra y foco en color signal */}
          <div className="relative mb-8">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite-300 dark:text-graphite-500 pointer-events-none"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full pl-11 pr-11 py-3.5 text-sm bg-white dark:bg-graphite-900 dark:text-white border border-graphite-100 dark:border-graphite-700 rounded-card shadow-lg shadow-graphite-900/5 dark:shadow-black/20 focus:outline-none focus:border-signal-500 focus:ring-2 focus:ring-signal-500/20 transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-graphite-300 hover:text-graphite-600 dark:hover:text-graphite-300 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Categorías */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setCategoriaActiva(null)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-card border transition-all duration-200 hover:scale-105 active:scale-95 ${categoriaActiva === null
                  ? 'bg-graphite-900 dark:bg-white text-white dark:text-graphite-900 border-graphite-900 dark:border-white shadow-sm'
                  : 'border-graphite-100 dark:border-graphite-600 text-graphite-600 dark:text-graphite-200 hover:border-graphite-400 dark:hover:border-graphite-400 hover:-translate-y-px'
                  }`}
              >
                Todas
                <span className="ml-1.5 text-graphite-400">{productos.length}</span>
              </button>
              {categorias.map((cat, i) => {
                const color = categoriaColores[i % categoriaColores.length];
                const activa = categoriaActiva === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaActiva(cat.id)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-card border transition-all duration-200 hover:scale-105 active:scale-95 ${activa
                      ? `${color.bg} text-white ${color.border} shadow-sm`
                      : `border-graphite-100 dark:border-graphite-600 text-graphite-600 dark:text-graphite-200 ${color.hoverBorder} ${color.hoverText} hover:-translate-y-px`
                      }`}
                  >
                    {cat.nombre}
                    <span className={`ml-1.5 ${activa ? 'text-white/70' : 'text-graphite-400 dark:text-graphite-400'}`}>
                      {contarPorCategoria(cat.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading skeleton */}
          {cargando && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-card overflow-hidden border border-graphite-100 dark:border-graphite-800 bg-white dark:bg-graphite-900">
                  <div className="aspect-square bg-graphite-100 dark:bg-graphite-800 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-2.5 w-1/3 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
                    <div className="h-3.5 w-4/5 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
                    <div className="h-3.5 w-1/2 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!cargando && productosFiltrados.length === 0 && (
            <div className="border border-dashed border-graphite-200 dark:border-graphite-700 rounded-card py-20 text-center bg-gradient-to-b from-signal-50/50 dark:from-graphite-900 to-transparent">
              <div className="w-14 h-14 mx-auto mb-4 rounded-card bg-signal-500 flex items-center justify-center text-white shadow-lg shadow-signal-500/25 animate-float">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="7" width="18" height="14" rx="2" />
                  <path d="M3 7l3-4h12l3 4" />
                  <path d="M9 11a3 3 0 006 0" />
                </svg>
              </div>
              <p className="text-graphite-700 dark:text-graphite-200 text-sm font-semibold mb-1">
                {busqueda.trim()
                  ? `Sin resultados para "${busqueda}"`
                  : `Todavía no hay productos ${categoriaActiva ? 'en esta categoría' : 'publicados'}`}
              </p>
              <p className="text-graphite-400 text-xs">
                {busqueda.trim()
                  ? 'Intenta con otra palabra o revisa la ortografía.'
                  : 'Vuelve pronto, estamos agregando nuevos accesorios.'}
              </p>
            </div>
          )}

          {/* Grid */}
          {!cargando && productosFiltrados.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productosFiltrados.map((producto, i) => (
                <div
                  key={producto.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProductCard producto={producto} color={colorDeCategoria(producto.categoria_id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}