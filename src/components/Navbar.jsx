import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
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