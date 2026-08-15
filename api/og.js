import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default async function handler(req, res) {
    const { id } = req.query;

    const { data: producto } = await supabase
        .from('productos')
        .select('*, imagenes(*)')
        .eq('id', id)
        .single();

    if (!producto) {
        res.status(404).send('Producto no encontrado');
        return;
    }

    const imagenPrincipal =
        producto.imagenes?.find((i) => i.es_principal)?.url ??
        producto.imagenes?.[0]?.url ??
        '';

    const precio = new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
    }).format(producto.precio_base);

    const url = `https://${req.headers.host}/producto/${id}`;
    const escapar = (t) => String(t ?? '').replace(/"/g, '&quot;');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>${escapar(producto.nombre)}</title>
    <meta property="og:title" content="${escapar(producto.nombre)}" />
    <meta property="og:description" content="${escapar(precio)}" />
    <meta property="og:image" content="${escapar(imagenPrincipal)}" />
    <meta property="og:url" content="${escapar(url)}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta http-equiv="refresh" content="0;url=${escapar(url)}" />
  </head>
  <body>
    Redirigiendo…
  </body>
</html>`);
}