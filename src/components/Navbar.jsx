import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { Heart } from 'lucide-react';
import { obtenerLikes, ajustarLikes } from '../lib/likes.js';

export default function Navbar() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(null);

  useEffect(() => {
    setLiked(localStorage.getItem('liked_catalogo') === 'true');

    obtenerLikes()
      .then(setLikes)
      .catch(() => setLikes(null));
  }, []);

  const handleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => (prev === null ? prev : prev + (nextLiked ? 1 : -1)));
    localStorage.setItem('liked_catalogo', String(nextLiked));

    try {
      const nuevoTotal = await ajustarLikes(nextLiked ? 1 : -1);
      setLikes(nuevoTotal);
    } catch {
      // si falla la red, dejamos el valor optimista; no es crítico para este caso
    }
  };

  return (
    <header className="border-b border-graphite-100 dark:border-graphite-800 bg-paper dark:bg-graphite-950 sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <img
            src="/icon.png"
            alt="Mobile Tech"
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm sm:text-lg tracking-tight text-graphite-900 dark:text-white">
              MOBILE
            </span>
            <span className="text-[8px] sm:text-[10px] tracking-[0.25em] font-semibold text-signal-500 -mt-0.5">
              TECH
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6 text-sm font-medium text-graphite-600 dark:text-graphite-300 shrink-0">
          <Link
            to="/"
            className="hidden sm:inline hover:text-graphite-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            Catálogo
          </Link>

          <button
            onClick={handleLike}
            aria-pressed={liked}
            aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-card border transition-colors whitespace-nowrap ${liked
                ? 'border-signal-500 text-signal-500 bg-signal-500/10'
                : 'border-graphite-100 dark:border-graphite-700 hover:border-signal hover:text-signal'
              }`}
          >
            <Heart size={14} className={liked ? 'fill-signal-500' : ''} />
            {likes !== null && (
              <span className="text-[11px] sm:text-xs font-mono">{likes}</span>
            )}
          </button>

          {/* <Link
            to="/admin"
            className="text-[11px] sm:text-xs font-mono px-2.5 sm:px-3 py-1.5 rounded-card border border-graphite-100 dark:border-graphite-700 hover:border-signal hover:text-signal transition-colors whitespace-nowrap"
          >
            Panel admin
          </Link> */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}