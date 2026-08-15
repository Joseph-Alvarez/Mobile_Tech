import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminGuard({ children }) {
  const [session, setSession] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) navigate('/admin', { replace: true });
  }, [session, navigate]);

  if (session === undefined) {
    return <div className="max-w-6xl mx-auto px-5 py-16 text-graphite-400 text-sm">Verificando sesión…</div>;
  }

  if (!session) return null;

  return <>{children}</>;
}
