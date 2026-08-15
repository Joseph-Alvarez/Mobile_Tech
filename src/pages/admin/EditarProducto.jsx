import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import AdminGuard from '../../components/AdminGuard.jsx';
import ProductoForm from '../../components/ProductoForm.jsx';

function EditarProductoContenido() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('productos')
        .select('*, categorias(*), variantes(*), imagenes(*)')
        .eq('id', id)
        .single();
      setProducto(data);
      setCargando(false);
    }
    if (id) cargar();
  }, [id]);

  if (cargando) return <p className="text-graphite-400 text-sm">Cargando…</p>;
  if (!producto) return <p className="text-graphite-600 dark:text-graphite-300 text-sm">Producto no encontrado.</p>;

  return <ProductoForm productoExistente={producto} />;
}

export default function EditarProducto() {
  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto px-5 py-10 dark:bg-graphite-950 min-h-screen transition-colors duration-300">
        <h1 className="font-display font-bold text-2xl text-graphite-900 dark:text-white mb-8">Editar producto</h1>
        <EditarProductoContenido />
      </div>
    </AdminGuard>
  );
}