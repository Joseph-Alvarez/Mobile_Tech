import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function formatoPrecio(valor) {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(valor);
}

export default function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      const { data } = await supabase
        .from('productos')
        .select('*, categorias(*), variantes(*), imagenes(*)')
        .eq('id', id)
        .single();

      if (data) {
        setProducto(data);
        const principal = data.imagenes?.find((i) => i.es_principal) ?? data.imagenes?.[0];
        setImagenActiva(principal ?? null);
        if (data.variantes?.length) setColorSeleccionado(data.variantes[0].color);
      }
      setCargando(false);
    }
    if (id) cargar();
  }, [id]);

  if (cargando) {
    return (
      <div className="dark:bg-graphite-950 min-h-screen transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-graphite-100 dark:bg-graphite-800 rounded-card animate-pulse" />
          <div className="space-y-3">
            <div className="h-2.5 w-1/4 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
            <div className="h-6 w-2/3 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
            <div className="h-8 w-1/3 bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
            <div className="h-20 w-full bg-graphite-100 dark:bg-graphite-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="dark:bg-graphite-950 min-h-screen transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <p className="text-graphite-600 dark:text-graphite-300">No se encontró este producto.</p>
        </div>
      </div>
    );
  }

  const varianteActiva = producto.variantes?.find((v) => v.color === colorSeleccionado);
  const precio = varianteActiva?.precio ?? producto.precio_base;

  const imagenesDelColor =
    producto.imagenes?.filter(
      (img) => !img.variante_id || img.variante_id === varianteActiva?.id
    ) ?? [];

  return (
    <div className="dark:bg-graphite-950 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-10 animate-fade-in">
        {/* Galería */}
        <div>
          <div className="aspect-square bg-graphite-50 dark:bg-graphite-800 rounded-card overflow-hidden mb-3 border border-graphite-100 dark:border-graphite-800">
            {imagenActiva ? (
              <img
                src={imagenActiva.url}
                alt={producto.nombre}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-graphite-400 text-xs font-mono">
                sin imagen
              </div>
            )}
          </div>
          {imagenesDelColor.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {imagenesDelColor.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setImagenActiva(img)}
                  className={`w-16 h-16 rounded-card overflow-hidden border-2 transition-all duration-150 hover:scale-105 ${imagenActiva?.id === img.id
                    ? 'border-signal'
                    : 'border-transparent dark:border-graphite-700'
                    }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {producto.categorias?.nombre && (
            <p className="text-xs uppercase tracking-wide text-graphite-400 font-medium mb-2">
              {producto.categorias.nombre}
            </p>
          )}
          <h1 className="font-display font-bold text-2xl text-graphite-900 dark:text-white mb-1">
            {producto.nombre}
          </h1>
          {producto.modelo && (
            <p className="font-mono text-xs text-signal mb-4">Modelo {producto.modelo}</p>
          )}
          <p className="font-mono text-2xl font-semibold text-graphite-900 dark:text-white mb-6">
            {formatoPrecio(precio)}
          </p>

          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-graphite-600 dark:text-graphite-300 mb-2">
                Color
              </p>
              <div className="flex flex-wrap gap-2">
                {producto.variantes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setColorSeleccionado(v.color)}
                    disabled={v.stock <= 0}
                    className={`text-sm px-3 py-1.5 rounded-card border transition-all duration-150 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${colorSeleccionado === v.color
                      ? 'bg-graphite-800 dark:bg-white text-white dark:text-graphite-900 border-graphite-800 dark:border-white'
                      : 'border-graphite-100 dark:border-graphite-700 text-graphite-600 dark:text-graphite-300 hover:border-graphite-400 dark:hover:border-graphite-500'
                      }`}
                  >
                    {v.color} {v.stock <= 0 && '(agotado)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {producto.descripcion && (
            <div className="mb-6">
              <p className="text-xs font-medium text-graphite-600 dark:text-graphite-300 mb-2">
                Descripción
              </p>
              <p className="text-sm text-graphite-800 dark:text-graphite-200 leading-relaxed whitespace-pre-line">
                {producto.descripcion}
              </p>
            </div>
          )}

          <a
            href={`https://wa.me/50496804671?text=${encodeURIComponent(
              [
                `Hola, me interesa: ${producto.nombre}`,
                producto.modelo ? `(${producto.modelo})` : null,
                colorSeleccionado ? `color ${colorSeleccionado}` : null,
                `${window.location.origin}/producto/${producto.id}`,
              ]
                .filter(Boolean)
                .join(' ')
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-signal hover:bg-signal-600 text-white text-sm font-medium px-5 py-3 rounded-card transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-signal-500/25"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}