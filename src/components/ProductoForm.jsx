
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { subirImagen, borrarImagenPorUrl } from '../lib/storage';


export default function ProductoForm({ productoExistente }) {
  const navigate = useNavigate();
  const esEdicion = !!productoExistente;

  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState(productoExistente?.nombre ?? '');
  const [modelo, setModelo] = useState(productoExistente?.modelo ?? '');
  const [categoriaId, setCategoriaId] = useState(productoExistente?.categoria_id ?? '');
  const [descripcion, setDescripcion] = useState(productoExistente?.descripcion ?? '');
  const [precioBase, setPrecioBase] = useState(String(productoExistente?.precio_base ?? ''));
  const [activo, setActivo] = useState(productoExistente?.activo ?? true);

  const [variantes, setVariantes] = useState(
    productoExistente?.variantes?.map((v) => ({
      id: v.id,
      color: v.color,
      stock: v.stock,
      precio: v.precio !== null ? String(v.precio) : '',
    })) ?? []
  );

  const [imagenes, setImagenes] = useState(
    productoExistente?.imagenes?.map((img) => ({
      id: img.id,
      url: img.url,
      es_principal: img.es_principal,
      color:
        productoExistente?.variantes?.find((v) => v.id === img.variante_id)?.color ?? '',
    })) ?? []
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('categorias')
      .select('*')
      .order('nombre')
      .then(({ data }) => setCategorias(data ?? []));
  }, []);

  function agregarVariante() {
    setVariantes((prev) => [...prev, { color: '', stock: 0, precio: '' }]);
  }

  function actualizarVariante(index, campo, valor) {
    setVariantes((prev) => prev.map((v, i) => (i === index ? { ...v, [campo]: valor } : v)));
  }

  function quitarVariante(index) {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  }

  function agregarImagenesDesdeArchivos(files) {
    if (!files) return;
    const nuevas = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      es_principal: imagenes.length === 0,
      color: '',
      nueva: file,
    }));
    setImagenes((prev) => [...prev, ...nuevas]);
  }

  function marcarPrincipal(index) {
    setImagenes((prev) => prev.map((img, i) => ({ ...img, es_principal: i === index })));
  }

  async function quitarImagen(index) {
    const img = imagenes[index];
    if (img.id) {
      await supabase.from('imagenes').delete().eq('id', img.id);
      await borrarImagenPorUrl(img.url);
    }
    setImagenes((prev) => {
      const restante = prev.filter((_, i) => i !== index);
      if (img.es_principal && restante.length > 0) restante[0].es_principal = true;
      return [...restante];
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !precioBase) {
      setError('Nombre y precio son obligatorios.');
      return;
    }
    if (imagenes.length > 0 && !imagenes.some((i) => i.es_principal)) {
      setError('Marca una imagen como principal.');
      return;
    }

    setGuardando(true);

    try {
      const datosProducto = {
        nombre: nombre.trim(),
        modelo: modelo.trim() || null,
        categoria_id: categoriaId || null,
        descripcion: descripcion.trim() || null,
        precio_base: parseFloat(precioBase),
        activo,
      };

      let productoId = productoExistente?.id;

      if (esEdicion) {
        await supabase.from('productos').update(datosProducto).eq('id', productoId);
      } else {
        const { data, error: errInsert } = await supabase
          .from('productos')
          .insert(datosProducto)
          .select()
          .single();
        if (errInsert) throw errInsert;
        productoId = data.id;
      }

      // --- Variantes: upsert de las que tienen color, borrar las quitadas ---
      const idsVariantesActuales = variantes.filter((v) => v.id).map((v) => v.id);
      if (esEdicion) {
        const idsOriginales = productoExistente?.variantes?.map((v) => v.id) ?? [];
        const idsABorrar = idsOriginales.filter((id) => !idsVariantesActuales.includes(id));
        if (idsABorrar.length > 0) {
          await supabase.from('variantes').delete().in('id', idsABorrar);
        }
      }

      const mapaColorId = {};
      for (const v of variantes) {
        if (!v.color.trim()) continue;
        const payload = {
          producto_id: productoId,
          color: v.color.trim(),
          stock: Number(v.stock) || 0,
          precio: v.precio ? parseFloat(v.precio) : null,
        };
        if (v.id) {
          await supabase.from('variantes').update(payload).eq('id', v.id);
          mapaColorId[v.color.trim()] = v.id;
        } else {
          const { data } = await supabase.from('variantes').insert(payload).select().single();
          if (data) mapaColorId[v.color.trim()] = data.id;
        }
      }

      // --- Imágenes: subir nuevas, guardar registros ---
      for (const img of imagenes) {
        if (img.nueva) {
          const url = await subirImagen(img.nueva, productoId);
          await supabase.from('imagenes').insert({
            producto_id: productoId,
            variante_id: img.color ? mapaColorId[img.color] ?? null : null,
            url,
            es_principal: img.es_principal,
            orden: 0,
          });
        } else if (img.id) {
          // Imagen existente: solo actualizar si cambió si es principal o el color asociado
          await supabase
            .from('imagenes')
            .update({
              es_principal: img.es_principal,
              variante_id: img.color ? mapaColorId[img.color] ?? null : null,
            })
            .eq('id', img.id);
        }
      }

      navigate('/admin/productos');
      
    } catch (err) {
      setError(err.message ?? 'Ocurrió un error al guardar.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="bg-signal-50 border border-signal-100 text-signal-600 text-sm rounded-card px-4 py-3">
          {error}
        </div>
      )}

      {/* Datos generales */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-wide text-graphite-400">
          Datos generales
        </h2>

        <div>
          <label className="block text-xs font-medium text-graphite-600 mb-1">Nombre *</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
            placeholder="Holder 360° Cel-Tablet"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-graphite-600 mb-1">Modelo / SKU</label>
            <input
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
              placeholder="L-382"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-graphite-600 mb-1">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
            >
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-graphite-600 mb-1">
            Precio base (L) *
          </label>
          <input
            type="number"
            step="0.01"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            required
            className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
            placeholder="450.00"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-graphite-600 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
            placeholder="Portable y plegable, regulación multiángulo, material metálico…"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-graphite-600">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          Visible en la tienda
        </label>
      </section>

      {/* Variantes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-graphite-400">
            Colores disponibles
          </h2>
          <button
            type="button"
            onClick={agregarVariante}
            className="text-xs font-medium text-signal"
          >
            + Agregar color
          </button>
        </div>

        {variantes.length === 0 && (
          <p className="text-xs text-graphite-400">
            Opcional. Si no agregas colores, el producto se vende como único.
          </p>
        )}

        {variantes.map((v, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={v.color}
              onChange={(e) => actualizarVariante(index, 'color', e.target.value)}
              placeholder="Color (ej. Negro)"
              className="flex-1 border border-graphite-100 rounded-card px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={v.stock}
              onChange={(e) => actualizarVariante(index, 'stock', e.target.value)}
              placeholder="Stock"
              className="w-24 border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
            />
            <input
              type="number"
              step="0.01"
              value={v.precio}
              onChange={(e) => actualizarVariante(index, 'precio', e.target.value)}
              placeholder="Precio (opc.)"
              className="w-28 border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => quitarVariante(index)}
              className="text-graphite-400 hover:text-signal text-sm px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </section>

      {/* Imágenes */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wide text-graphite-400">Imágenes</h2>

        <label className="block border border-dashed border-graphite-100 rounded-card py-6 text-center cursor-pointer hover:border-signal transition-colors">
          <span className="text-sm text-graphite-600">Toca para subir fotos</span>
          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={(e) => agregarImagenesDesdeArchivos(e.target.files)}
          />
        </label>

        {imagenes.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {imagenes.map((img, index) => (
              <div key={index} className="relative border border-graphite-100 rounded-card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full aspect-square object-cover" />
                <div className="p-2 space-y-1 bg-white">
                  <button
                    type="button"
                    onClick={() => marcarPrincipal(index)}
                    className={`w-full text-[11px] font-medium py-1 rounded-card ${
                      img.es_principal
                        ? 'bg-signal text-white'
                        : 'bg-graphite-50 text-graphite-600'
                    }`}
                  >
                    {img.es_principal ? 'Principal' : 'Marcar principal'}
                  </button>
                  {variantes.length > 0 && (
                    <select
                      value={img.color}
                      onChange={(e) =>
                        setImagenes((prev) =>
                          prev.map((it, i) => (i === index ? { ...it, color: e.target.value } : it))
                        )
                      }
                      className="w-full text-[11px] border border-graphite-100 rounded-card px-1 py-1"
                    >
                      <option value="">General</option>
                      {variantes.filter((v) => v.color).map((v) => (
                        <option key={v.color} value={v.color}>
                          {v.color}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() => quitarImagen(index)}
                    className="w-full text-[11px] text-graphite-400 hover:text-signal"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="bg-signal hover:bg-signal-600 text-white text-sm font-medium px-5 py-2.5 rounded-card transition-colors disabled:opacity-50"
        >
          {guardando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/productos')}
          className="text-sm font-medium px-5 py-2.5 rounded-card border border-graphite-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
