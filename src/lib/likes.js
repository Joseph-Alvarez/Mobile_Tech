import { supabase } from './supabaseClient';

/** Obtiene el contador actual de likes */
export async function obtenerLikes() {
    const { data, error } = await supabase
        .from('page_likes')
        .select('count')
        .eq('id', 1)
        .single();

    if (error) throw error;
    return data.count;
}

/** Suma o resta 1 al contador y devuelve el nuevo total */
export async function ajustarLikes(delta) {
    const { data, error } = await supabase.rpc('adjust_likes', { delta });
    if (error) throw error;
    return data;
}