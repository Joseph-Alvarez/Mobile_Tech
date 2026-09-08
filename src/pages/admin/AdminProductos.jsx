import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import AdminGuard from '../../components/AdminGuard.jsx';

function ListaProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  async function cargarProductos() {
    setCargando(true);
    const { data } = await supabase
      .from('productos')
      .select('*, categorias(*), imagenes(*)')
      .order('created_at', { ascending: false });
    setProductos(data ?? []);
    setCargando(false);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  async function actualizarPrecio(id, nuevoPrecio) {
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, precio_base: nuevoPrecio } : p)));
    await supabase.from('productos').update({ precio_base: nuevoPrecio }).eq('id', id);
  }

  async function alternarActivo(producto) {
    const nuevoValor = !producto.activo;
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, activo: nuevoValor } : p))
    );
    await supabase.from('productos').update({ activo: nuevoValor }).eq('id', producto.id);
  }

  async function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    await supabase.from('productos').delete().eq('id', id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    navigate('/admin');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 dark:bg-graphite-950 min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-graphite-900 dark:text-white">Tus productos</h1>
          <p className="text-graphite-400 text-sm">{productos.length} producto(s) registrados</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/productos/nuevo"
            className="bg-signal hover:bg-signal-600 text-white text-sm font-medium px-4 py-2 rounded-card transition-colors"
          >
            + Nuevo producto
          </Link>
          <button
            onClick={cerrarSesion}
            className="text-sm font-medium px-4 py-2 rounded-card border border-graphite-100 dark:border-graphite-700 text-graphite-800 dark:text-graphite-200 hover:border-graphite-400 dark:hover:border-graphite-500 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {cargando && <p className="text-graphite-400 text-sm">Cargando…</p>}

      <div className="space-y-3">
        {productos.map((producto) => {
          const principal = producto.imagenes?.find((i) => i.es_principal) ?? producto.imagenes?.[0];
          return (
            <div
              key={producto.id}
              className="flex flex-wrap sm:flex-nowrap items-center gap-3 border border-graphite-100 dark:border-graphite-800 rounded-card p-3 bg-white dark:bg-graphite-900"
            >
              <div className="w-16 h-16 rounded-card overflow-hidden bg-graphite-50 dark:bg-graphite-800 shrink-0">
                {principal ? <img src={principal.url} alt="" className="w-full h-full object-cover" /> : null}
              </div>

              <div className="flex-1 min-w-[140px]">
                <p className="font-medium text-graphite-800 dark:text-graphite-100 truncate">{producto.nombre}</p>
                <p className="text-xs text-graphite-400 font-mono truncate">
                  {producto.modelo} · {producto.categorias?.nombre ?? 'Sin categoría'}
                </p>
              </div>

              <div className="flex items-center gap-1 order-3 sm:order-none">
                <span className="text-xs text-graphite-400 font-mono">L</span>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={producto.precio_base}
                  onBlur={(e) => actualizarPrecio(producto.id, parseFloat(e.target.value) || 0)}
                  className="w-20 sm:w-24 border border-graphite-100 dark:border-graphite-700 bg-white dark:bg-graphite-800 text-graphite-900 dark:text-white rounded-card px-2 py-1.5 text-sm font-mono"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto order-4 sm:order-none">
                <button
                  onClick={() => alternarActivo(producto)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-card border transition-colors whitespace-nowrap ${producto.activo
                    ? 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-graphite-100 dark:border-graphite-700 text-graphite-400'
                    }`}
                >
                  {producto.activo ? 'Visible' : 'Oculto'}
                </button>

                <Link
                  to={`/admin/productos/${producto.id}/editar`}
                  className="text-xs font-medium px-3 py-1.5 rounded-card border border-graphite-100 dark:border-graphite-700 text-graphite-800 dark:text-graphite-200 hover:border-graphite-400 dark:hover:border-graphite-500 transition-colors whitespace-nowrap"
                >
                  Editar
                </Link>

                <button
                  onClick={() => eliminarProducto(producto.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-card border border-graphite-100 dark:border-graphite-700 text-graphite-400 hover:border-signal hover:text-signal transition-colors whitespace-nowrap"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!cargando && productos.length === 0 && (
        <div className="border border-dashed border-graphite-100 dark:border-graphite-700 rounded-card py-16 text-center">
          <p className="text-graphite-400 text-sm mb-3">Aún no has agregado productos.</p>
          <Link to="/admin/productos/nuevo" className="text-signal text-sm font-medium">
            Agregar el primero →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminProductos() {
  return (
    <AdminGuard>
      <ListaProductosAdmin />
    </AdminGuard>
  );
}