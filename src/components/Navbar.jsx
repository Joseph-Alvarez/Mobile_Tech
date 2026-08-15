import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  return (
    <header className="border-b border-graphite-100 dark:border-graphite-800 bg-paper dark:bg-graphite-950 sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-left justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/SinFondo.png"
            alt="Accesorios"
            className="h-16 w-26"
          />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg tracking-tight text-graphite-900 dark:text-white">
              MOBILE
            </span>
            <span className="text-[10px] tracking-[0.25em] font-semibold text-orange-500 -mt-0.5">
              TECH
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-graphite-600 dark:text-graphite-300">
          <Link to="/" className="hover:text-graphite-900 dark:hover:text-white transition-colors">
            Catálogo
          </Link>
          <Link
            to="/admin"
            className="text-xs font-mono px-3 py-1.5 rounded-card border border-graphite-100 dark:border-graphite-700 hover:border-signal hover:text-signal transition-colors"
          >
            Panel admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}