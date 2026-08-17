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
  const [categoriaId, setCategoriaId] = useState(
    productoExistente?.categoria_id ?? ''
  );
  const [descripcion, setDescripcion] = useState(
    productoExistente?.descripcion ?? ''
  );
  const [precioBase, setPrecioBase] = useState(
    String(productoExistente?.precio_base ?? '')
  );
  const [activo, setActivo] = useState(
    productoExistente?.activo ?? true
  );

  // ==============================
  // CATEGORÍAS
  // ==============================

  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState('');
  const [creandoCategoria, setCreandoCategoria] = useState(false);

  const [mostrarGestionCategorias, setMostrarGestionCategorias] =
    useState(false);

  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nombreCategoriaEditada, setNombreCategoriaEditada] = useState('');
  const [guardandoCategoria, setGuardandoCategoria] = useState(false);

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [eliminandoCategoria, setEliminandoCategoria] = useState(false);

  // ==============================
  // VARIANTES
  // ==============================

  const [variantes, setVariantes] = useState(
    productoExistente?.variantes?.map((v) => ({
      id: v.id,
      color: v.color,
      stock: v.stock,
      precio: v.precio !== null ? String(v.precio) : '',
    })) ?? []
  );

  // ==============================
  // IMÁGENES
  // ==============================

  const [imagenes, setImagenes] = useState(
    productoExistente?.imagenes?.map((img) => ({
      id: img.id,
      url: img.url,
      es_principal: img.es_principal,
      color:
        productoExistente?.variantes?.find(
          (v) => v.id === img.variante_id
        )?.color ?? '',
    })) ?? []
  );

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  // ==============================
  // CARGAR CATEGORÍAS
  // ==============================

  useEffect(() => {
    async function cargarCategorias() {
      const { data, error: errCategorias } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

      if (errCategorias) {
        setError(
          'No se pudieron cargar las categorías: ' +
          errCategorias.message
        );
        return;
      }

      setCategorias(data ?? []);
    }

    cargarCategorias();
  }, []);

  // ==============================
  // VARIANTES
  // ==============================

  function agregarVariante() {
    setVariantes((prev) => [
      ...prev,
      {
        color: '',
        stock: 0,
        precio: '',
      },
    ]);
  }

  function actualizarVariante(index, campo, valor) {
    setVariantes((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
            ...v,
            [campo]: valor,
          }
          : v
      )
    );
  }

  function quitarVariante(index) {
    setVariantes((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  // ==============================
  // CREAR CATEGORÍA
  // ==============================

  async function crearCategoria() {
    const nombre = nuevaCategoriaNombre.trim();

    if (!nombre) {
      setError('Escribe un nombre para la categoría.');
      return;
    }

    // Evitar duplicados
    const existe = categorias.some(
      (categoria) =>
        categoria.nombre.trim().toLowerCase() ===
        nombre.toLowerCase()
    );

    if (existe) {
      setError(`La categoría "${nombre}" ya existe.`);
      return;
    }

    setCreandoCategoria(true);
    setError(null);

    try {
      const { data, error: errCategoria } = await supabase
        .from('categorias')
        .insert({
          nombre,
        })
        .select()
        .single();

      if (errCategoria) {
        throw errCategoria;
      }

      setCategorias((prev) =>
        [...prev, data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        )
      );

      // Seleccionar automáticamente la nueva categoría
      setCategoriaId(data.id);

      setNuevaCategoriaNombre('');
      setMostrarNuevaCategoria(false);
    } catch (err) {
      setError(
        'No se pudo crear la categoría: ' +
        (err.message ?? 'Error desconocido')
      );
    } finally {
      setCreandoCategoria(false);
    }
  }

  // ==============================
  // EDITAR CATEGORÍA
  // ==============================

  function iniciarEdicionCategoria(categoria) {
    setCategoriaEditando(categoria);
    setNombreCategoriaEditada(categoria.nombre);
    setError(null);
  }

  function cancelarEdicionCategoria() {
    setCategoriaEditando(null);
    setNombreCategoriaEditada('');
  }

  async function modificarCategoria() {
    const nombre = nombreCategoriaEditada.trim();

    if (!nombre) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    if (!categoriaEditando) {
      return;
    }

    // Evitar nombres duplicados
    const existe = categorias.some(
      (categoria) =>
        categoria.id !== categoriaEditando.id &&
        categoria.nombre.trim().toLowerCase() ===
        nombre.toLowerCase()
    );

    if (existe) {
      setError(`La categoría "${nombre}" ya existe.`);
      return;
    }

    setGuardandoCategoria(true);
    setError(null);

    try {
      const { data, error: errCategoria } = await supabase
        .from('categorias')
        .update({
          nombre,
        })
        .eq('id', categoriaEditando.id)
        .select()
        .single();

      if (errCategoria) {
        throw errCategoria;
      }

      setCategorias((prev) =>
        prev
          .map((categoria) =>
            categoria.id === data.id ? data : categoria
          )
          .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
      );

      setCategoriaEditando(null);
      setNombreCategoriaEditada('');
    } catch (err) {
      setError(
        'No se pudo modificar la categoría: ' +
        (err.message ?? 'Error desconocido')
      );
    } finally {
      setGuardandoCategoria(false);
    }
  }

  // ==============================
  // ELIMINAR CATEGORÍA
  // ==============================

  async function solicitarEliminarCategoria(id) {
    setError(null);

    try {
      // Primero comprobamos si existen productos
      // asociados a esta categoría.
      const { count, error: errProductos } = await supabase
        .from('productos')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('categoria_id', id);

      if (errProductos) {
        throw errProductos;
      }

      if (count > 0) {
        setError(
          `No puedes eliminar esta categoría porque tiene ${count} producto${count === 1 ? '' : 's'
          } asociado${count === 1 ? '' : 's'}.`
        );
        return;
      }

      const categoria = categorias.find((c) => c.id === id);
      setCategoriaAEliminar(categoria);
    } catch (err) {
      setError(
        'No se pudo verificar la categoría: ' +
        (err.message ?? 'Error desconocido')
      );
    }
  }

  function cancelarEliminarCategoria() {
    if (eliminandoCategoria) return;
    setCategoriaAEliminar(null);
  }

  async function confirmarEliminarCategoria() {
    if (!categoriaAEliminar) return;

    setEliminandoCategoria(true);
    setError(null);

    try {
      const { error: errEliminar } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaAEliminar.id);

      if (errEliminar) {
        throw errEliminar;
      }

      setCategorias((prev) =>
        prev.filter(
          (categoria) => categoria.id !== categoriaAEliminar.id
        )
      );

      // Si era la categoría seleccionada,
      // quitamos la selección.
      if (categoriaId === categoriaAEliminar.id) {
        setCategoriaId('');
      }

      // Si estaba siendo editada, cancelamos.
      if (categoriaEditando?.id === categoriaAEliminar.id) {
        cancelarEdicionCategoria();
      }

      setCategoriaAEliminar(null);
    } catch (err) {
      setError(
        'No se pudo eliminar la categoría: ' +
        (err.message ?? 'Error desconocido')
      );
    } finally {
      setEliminandoCategoria(false);
    }
  }

  // ==============================
  // IMÁGENES
  // ==============================

  function agregarImagenesDesdeArchivos(files) {
    if (!files) return;

    const nuevas = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      es_principal: imagenes.length === 0,
      color: '',
      nueva: file,
    }));

    setImagenes((prev) => [
      ...prev,
      ...nuevas,
    ]);
  }

  function marcarPrincipal(index) {
    setImagenes((prev) =>
      prev.map((img, i) => ({
        ...img,
        es_principal: i === index,
      }))
    );
  }

  async function quitarImagen(index) {
    const img = imagenes[index];

    if (img.id) {
      await supabase
        .from('imagenes')
        .delete()
        .eq('id', img.id);

      await borrarImagenPorUrl(img.url);
    }

    setImagenes((prev) => {
      const restante = prev.filter(
        (_, i) => i !== index
      );

      if (
        img.es_principal &&
        restante.length > 0
      ) {
        restante[0].es_principal = true;
      }

      return [...restante];
    });
  }

  // ==============================
  // GUARDAR PRODUCTO
  // ==============================

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim() || !precioBase) {
      setError(
        'Nombre y precio son obligatorios.'
      );
      return;
    }

    if (
      imagenes.length > 0 &&
      !imagenes.some((i) => i.es_principal)
    ) {
      setError(
        'Marca una imagen como principal.'
      );
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

      let productoId =
        productoExistente?.id;

      // ==============================
      // PRODUCTO
      // ==============================

      if (esEdicion) {
        const { error: errProducto } =
          await supabase
            .from('productos')
            .update(datosProducto)
            .eq('id', productoId);

        if (errProducto) {
          throw errProducto;
        }
      } else {
        const {
          data,
          error: errInsert,
        } = await supabase
          .from('productos')
          .insert(datosProducto)
          .select()
          .single();

        if (errInsert) {
          throw errInsert;
        }

        productoId = data.id;
      }

      // ==============================
      // VARIANTES
      // ==============================

      const idsVariantesActuales =
        variantes
          .filter((v) => v.id)
          .map((v) => v.id);

      if (esEdicion) {
        const idsOriginales =
          productoExistente?.variantes?.map(
            (v) => v.id
          ) ?? [];

        const idsABorrar =
          idsOriginales.filter(
            (id) =>
              !idsVariantesActuales.includes(id)
          );

        if (idsABorrar.length > 0) {
          const { error: errDelete } =
            await supabase
              .from('variantes')
              .delete()
              .in('id', idsABorrar);

          if (errDelete) {
            throw errDelete;
          }
        }
      }

      const mapaColorId = {};

      for (const v of variantes) {
        if (!v.color.trim()) continue;

        const payload = {
          producto_id: productoId,
          color: v.color.trim(),
          stock: Number(v.stock) || 0,
          precio: v.precio
            ? parseFloat(v.precio)
            : null,
        };

        if (v.id) {
          const {
            error: errUpdate,
          } = await supabase
            .from('variantes')
            .update(payload)
            .eq('id', v.id);

          if (errUpdate) {
            throw errUpdate;
          }

          mapaColorId[
            v.color.trim()
          ] = v.id;
        } else {
          const {
            data,
            error: errInsertVariante,
          } = await supabase
            .from('variantes')
            .insert(payload)
            .select()
            .single();

          if (errInsertVariante) {
            throw errInsertVariante;
          }

          if (data) {
            mapaColorId[
              v.color.trim()
            ] = data.id;
          }
        }
      }

      // ==============================
      // IMÁGENES
      // ==============================

      for (const img of imagenes) {
        if (img.nueva) {
          const url = await subirImagen(
            img.nueva,
            productoId
          );

          const {
            error: errImagen,
          } = await supabase
            .from('imagenes')
            .insert({
              producto_id: productoId,
              variante_id: img.color
                ? mapaColorId[img.color] ?? null
                : null,
              url,
              es_principal: img.es_principal,
              orden: 0,
            });

          if (errImagen) {
            throw errImagen;
          }
        } else if (img.id) {
          const {
            error: errUpdateImagen,
          } = await supabase
            .from('imagenes')
            .update({
              es_principal: img.es_principal,
              variante_id: img.color
                ? mapaColorId[img.color] ?? null
                : null,
            })
            .eq('id', img.id);

          if (errUpdateImagen) {
            throw errUpdateImagen;
          }
        }
      }

      navigate('/admin/productos');
    } catch (err) {
      setError(
        err.message ??
        'Ocurrió un error al guardar.'
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      {/* ======================================
          FORMULARIO
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-2xl"
      >
        {error && (
          <div className="bg-signal-50 border border-signal-100 text-signal-600 text-sm rounded-card px-4 py-3">
            {error}
          </div>
        )}

        {/* ==============================
            DATOS GENERALES
        ============================== */}

        <section className="space-y-4">
          <h2 className="text-xs font-medium uppercase tracking-wide text-graphite-400">
            Datos generales
          </h2>

          <div>
            <label className="block text-xs font-medium text-graphite-600 mb-1">
              Nombre *
            </label>

            <input
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              required
              className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
              placeholder="Holder 360° Cel-Tablet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* MODELO */}

            <div>
              <label className="block text-xs font-medium text-graphite-600 mb-1">
                Modelo / SKU
              </label>

              <input
                value={modelo}
                onChange={(e) =>
                  setModelo(e.target.value)
                }
                className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
                placeholder="L-382"
              />
            </div>

            {/* CATEGORÍA */}

            <div>
              <label className="block text-xs font-medium text-graphite-600 mb-1">
                Categoría
              </label>

              <select
                value={
                  mostrarNuevaCategoria
                    ? '__nueva__'
                    : categoriaId
                }
                onChange={(e) => {
                  if (
                    e.target.value ===
                    '__nueva__'
                  ) {
                    setMostrarNuevaCategoria(
                      true
                    );
                  } else {
                    setMostrarNuevaCategoria(
                      false
                    );
                    setCategoriaId(
                      e.target.value
                    );
                  }
                }}
                className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
              >
                <option value="">
                  Sin categoría
                </option>

                {categorias.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.nombre}
                  </option>
                ))}

                <option value="__nueva__">
                  + Nueva categoría…
                </option>
              </select>

              <button
                type="button"
                onClick={() =>
                  setMostrarGestionCategorias(
                    true
                  )
                }
                className="mt-2 text-xs font-medium text-graphite-500 hover:text-signal transition-colors"
              >
                ⚙ Gestionar categorías
              </button>

              {/* NUEVA CATEGORÍA */}

              {mostrarNuevaCategoria && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={
                      nuevaCategoriaNombre
                    }
                    onChange={(e) =>
                      setNuevaCategoriaNombre(
                        e.target.value
                      )
                    }
                    placeholder="Nombre de la categoría"
                    className="flex-1 border border-graphite-100 rounded-card px-3 py-2 text-sm"
                    autoFocus
                  />

                  <button
                    type="button"
                    onClick={
                      crearCategoria
                    }
                    disabled={
                      creandoCategoria
                    }
                    className="text-xs font-medium bg-signal text-white px-3 py-2 rounded-card disabled:opacity-50"
                  >
                    {creandoCategoria
                      ? 'Creando…'
                      : 'Agregar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarNuevaCategoria(
                        false
                      );
                      setNuevaCategoriaNombre(
                        ''
                      );
                    }}
                    className="text-xs text-graphite-400 px-2"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PRECIO */}

          <div>
            <label className="block text-xs font-medium text-graphite-600 mb-1">
              Precio base (L) *
            </label>

            <input
              type="number"
              step="0.01"
              value={precioBase}
              onChange={(e) =>
                setPrecioBase(e.target.value)
              }
              required
              className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
              placeholder="450.00"
            />
          </div>

          {/* DESCRIPCIÓN */}

          <div>
            <label className="block text-xs font-medium text-graphite-600 mb-1">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              rows={4}
              className="w-full border border-graphite-100 rounded-card px-3 py-2 text-sm"
              placeholder="Portable y plegable, regulación multiángulo, material metálico…"
            />
          </div>

          {/* ACTIVO */}

          <label className="flex items-center gap-2 text-sm text-graphite-600">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) =>
                setActivo(e.target.checked)
              }
            />

            Visible en la tienda
          </label>
        </section>

        {/* ==============================
            VARIANTES
        ============================== */}

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
              Opcional. Si no agregas colores,
              el producto se vende como único.
            </p>
          )}

          {variantes.map((v, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <input
                value={v.color}
                onChange={(e) =>
                  actualizarVariante(
                    index,
                    'color',
                    e.target.value
                  )
                }
                placeholder="Color (ej. Negro)"
                className="flex-1 border border-graphite-100 rounded-card px-3 py-2 text-sm"
              />

              <input
                type="number"
                value={v.stock}
                onChange={(e) =>
                  actualizarVariante(
                    index,
                    'stock',
                    e.target.value
                  )
                }
                placeholder="Stock"
                className="w-24 border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
              />

              <input
                type="number"
                step="0.01"
                value={v.precio}
                onChange={(e) =>
                  actualizarVariante(
                    index,
                    'precio',
                    e.target.value
                  )
                }
                placeholder="Precio (opc.)"
                className="w-28 border border-graphite-100 rounded-card px-3 py-2 text-sm font-mono"
              />

              <button
                type="button"
                onClick={() =>
                  quitarVariante(index)
                }
                className="text-graphite-400 hover:text-signal text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </section>

        {/* ==============================
            IMÁGENES
        ============================== */}

        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-graphite-400">
            Imágenes
          </h2>

          <label className="block border border-dashed border-graphite-100 rounded-card py-6 text-center cursor-pointer hover:border-signal transition-colors">
            <span className="text-sm text-graphite-600">
              Toca para subir fotos
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                agregarImagenesDesdeArchivos(
                  e.target.files
                )
              }
            />
          </label>

          {imagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {imagenes.map(
                (img, index) => (
                  <div
                    key={index}
                    className="relative border border-graphite-100 rounded-card overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full aspect-square object-cover"
                    />

                    <div className="p-2 space-y-1 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          marcarPrincipal(
                            index
                          )
                        }
                        className={`w-full text-[11px] font-medium py-1 rounded-card ${img.es_principal
                          ? 'bg-signal text-white'
                          : 'bg-graphite-50 text-graphite-600'
                          }`}
                      >
                        {img.es_principal
                          ? 'Principal'
                          : 'Marcar principal'}
                      </button>

                      {variantes.length >
                        0 && (
                          <select
                            value={
                              img.color
                            }
                            onChange={(e) =>
                              setImagenes(
                                (prev) =>
                                  prev.map(
                                    (
                                      it,
                                      i
                                    ) =>
                                      i ===
                                        index
                                        ? {
                                          ...it,
                                          color:
                                            e.target
                                              .value,
                                        }
                                        : it
                                  )
                              )
                            }
                            className="w-full text-[11px] border border-graphite-100 rounded-card px-1 py-1"
                          >
                            <option value="">
                              General
                            </option>

                            {variantes
                              .filter(
                                (v) =>
                                  v.color
                              )
                              .map(
                                (v) => (
                                  <option
                                    key={
                                      v.color
                                    }
                                    value={
                                      v.color
                                    }
                                  >
                                    {v.color}
                                  </option>
                                )
                              )}
                          </select>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          quitarImagen(
                            index
                          )
                        }
                        className="w-full text-[11px] text-graphite-400 hover:text-signal"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ==============================
            BOTONES
        ============================== */}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="bg-signal hover:bg-signal-600 text-white text-sm font-medium px-5 py-2.5 rounded-card transition-colors disabled:opacity-50"
          >
            {guardando
              ? 'Guardando…'
              : esEdicion
                ? 'Guardar cambios'
                : 'Crear producto'}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate('/admin/productos')
            }
            className="text-sm font-medium px-5 py-2.5 rounded-card border border-graphite-100"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* ======================================
          MODAL: GESTIONAR CATEGORÍAS
      ====================================== */}

      {mostrarGestionCategorias && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setMostrarGestionCategorias(false);
              cancelarEdicionCategoria();
            }
          }}
        >
          <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-5">
            {/* CABECERA */}

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-graphite-800">
                  Gestionar categorías
                </h2>

                <p className="text-xs text-graphite-400 mt-1">
                  Modifica o elimina las categorías existentes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMostrarGestionCategorias(
                    false
                  );
                  cancelarEdicionCategoria();
                }}
                className="text-graphite-400 hover:text-graphite-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* ERROR DENTRO DEL MODAL */}

            {error && (
              <div className="mb-4 bg-signal-50 border border-signal-100 text-signal-600 text-xs rounded-card px-3 py-2">
                {error}
              </div>
            )}

            {/* LISTA DE CATEGORÍAS */}

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {categorias.map(
                (categoria) => (
                  <div
                    key={categoria.id}
                    className="flex items-center justify-between gap-3 border border-graphite-100 rounded-card px-3 py-2"
                  >
                    {categoriaEditando?.id ===
                      categoria.id ? (
                      <>
                        <input
                          value={
                            nombreCategoriaEditada
                          }
                          onChange={(e) =>
                            setNombreCategoriaEditada(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key ===
                              'Enter'
                            ) {
                              e.preventDefault();
                              modificarCategoria();
                            }

                            if (
                              e.key ===
                              'Escape'
                            ) {
                              cancelarEdicionCategoria();
                            }
                          }}
                          autoFocus
                          className="flex-1 border border-graphite-100 rounded-card px-2 py-1.5 text-sm focus:outline-none focus:border-signal"
                        />

                        <button
                          type="button"
                          onClick={
                            modificarCategoria
                          }
                          disabled={
                            guardandoCategoria
                          }
                          className="text-xs font-medium text-signal hover:text-signal-600 disabled:opacity-50"
                        >
                          {guardandoCategoria
                            ? '...'
                            : 'Guardar'}
                        </button>

                        <button
                          type="button"
                          onClick={
                            cancelarEdicionCategoria
                          }
                          disabled={
                            guardandoCategoria
                          }
                          className="text-xs text-graphite-400 hover:text-graphite-600"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-graphite-700 truncate">
                          {categoria.nombre}
                        </span>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              iniciarEdicionCategoria(
                                categoria
                              )
                            }
                            className="text-xs font-medium text-blue-500 hover:text-blue-600"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              solicitarEliminarCategoria(
                                categoria.id
                              )
                            }
                            className="text-xs font-medium text-signal hover:text-signal-600"
                          >
                            Eliminar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}

              {categorias.length === 0 && (
                <p className="text-center text-xs text-graphite-400 py-6">
                  No hay categorías creadas.
                </p>
              )}
            </div>

            {/* PIE DEL MODAL */}

            <div className="flex justify-between items-center mt-5">
              <span className="text-xs text-graphite-400">
                {categorias.length}{' '}
                {categorias.length === 1
                  ? 'categoría'
                  : 'categorías'}
              </span>

              <button
                type="button"
                onClick={() => {
                  setMostrarGestionCategorias(
                    false
                  );
                  cancelarEdicionCategoria();
                }}
                className="text-sm font-medium px-4 py-2 rounded-card border border-graphite-100 hover:bg-graphite-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
          MODAL: CONFIRMAR ELIMINACIÓN DE CATEGORÍA
      ====================================== */}

      {categoriaAEliminar && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cancelarEliminarCategoria();
            }
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-card shadow-2xl p-5">
            <div className="w-11 h-11 mb-4 rounded-card bg-signal-50 flex items-center justify-center text-signal-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-graphite-800 mb-1">
              ¿Eliminar "{categoriaAEliminar.nombre}"?
            </h2>

            <p className="text-sm text-graphite-400 mb-5">
              Esta acción no se puede deshacer. La categoría se
              eliminará permanentemente.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmarEliminarCategoria}
                disabled={eliminandoCategoria}
                className="flex-1 bg-signal hover:bg-signal-600 text-white text-sm font-medium py-2.5 rounded-card transition-colors disabled:opacity-50"
              >
                {eliminandoCategoria
                  ? 'Eliminando…'
                  : 'Sí, eliminar'}
              </button>

              <button
                type="button"
                onClick={cancelarEliminarCategoria}
                disabled={eliminandoCategoria}
                className="flex-1 text-sm font-medium py-2.5 rounded-card border border-graphite-100 hover:bg-graphite-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}