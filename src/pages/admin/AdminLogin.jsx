import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/productos', { replace: true });
    });
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setCargando(false);

    if (error) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    navigate('/admin/productos');
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-20 dark:bg-graphite-950 min-h-screen transition-colors duration-300">
      <h1 className="font-display font-bold text-2xl text-graphite-900 dark:text-white mb-1">Panel admin</h1>
      <p className="text-graphite-400 text-sm mb-8">Inicia sesión para gestionar tus productos.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-graphite-600 dark:text-graphite-300 mb-1">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-graphite-100 dark:border-graphite-700 bg-white dark:bg-graphite-900 text-graphite-900 dark:text-white rounded-card px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-graphite-600 dark:text-graphite-300 mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-graphite-100 dark:border-graphite-700 bg-white dark:bg-graphite-900 text-graphite-900 dark:text-white rounded-card px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-signal">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-graphite-800 hover:bg-graphite-900 dark:bg-signal dark:hover:bg-signal-600 text-white text-sm font-medium py-2.5 rounded-card transition-colors disabled:opacity-50"
        >
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="text-xs text-graphite-400 mt-6">
        Tu usuario se crea desde el dashboard de Supabase en Authentication → Users. No hay registro
        público.
      </p>
    </div>
  );
}