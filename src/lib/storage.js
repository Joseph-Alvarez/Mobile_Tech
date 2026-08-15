import { supabase } from './supabaseClient';

const BUCKET = 'productos';

/** Sube un archivo de imagen al bucket "productos" y devuelve su URL pública */
export async function subirImagen(file, productoId) {
  const extension = file.name.split('.').pop();
  const nombreArchivo = `${productoId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(nombreArchivo, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

/** Borra una imagen del storage a partir de su URL pública */
export async function borrarImagenPorUrl(url) {
  const partes = url.split(`/${BUCKET}/`);
  if (partes.length < 2) return;
  const path = partes[1];
  await supabase.storage.from(BUCKET).remove([path]);
}
