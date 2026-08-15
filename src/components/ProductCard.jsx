import { Link } from 'react-router-dom';

function formatoPrecio(valor) {
  return new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(valor);
}

export default function ProductCard({ producto, color }) {
  const principal =
    producto.imagenes?.find((img) => img.es_principal) ?? producto.imagenes?.[0] ?? null;
  const colores = producto.variantes?.map((v) => v.color) ?? [];
  const acento = color?.bg ?? 'bg-signal-500';
  const textoAcento = color?.text ?? 'text-signal-600';

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="group block bg-white dark:bg-graphite-900 border border-graphite-100 dark:border-graphite-800 rounded-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className={`h-1 ${acento}`} />
      <div className="relative aspect-square bg-graphite-50">
        {principal ? (
          <img src={principal.url} alt={producto.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-graphite-400 text-xs font-mono">
            sin imagen
          </div>
        )}
        {producto.modelo && (
          <span className="absolute top-2 right-2 bg-signal text-white text-[10px] font-mono font-medium px-2 py-1 rounded-card">
            {producto.modelo}
          </span>
        )}
      </div>
      <div className="p-4">
        {producto.categorias?.nombre && (
          <p className={`text-[11px] uppercase tracking-wide font-medium mb-1 ${textoAcento}`}>
            {producto.categorias.nombre}
          </p>
        )}
        <h3 className="font-display font-medium text-graphite-800 dark:text-graphite-100 leading-snug mb-2">
          {producto.nombre}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-mono font-semibold text-graphite-900 dark:text-white">
            {formatoPrecio(producto.precio_base)}
          </span>
          {colores.length > 0 && (
            <span className="text-[11px] text-graphite-400">
              {colores.length} {colores.length === 1 ? 'color' : 'colores'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}