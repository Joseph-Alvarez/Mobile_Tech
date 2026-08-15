import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [oscuro, setOscuro] = useState(() => {
        const guardado = localStorage.getItem('tema');
        if (guardado) return guardado === 'oscuro';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', oscuro);
        localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
    }, [oscuro]);

    return (
        <button
            type="button"
            onClick={() => setOscuro((prev) => !prev)}
            aria-label="Cambiar tema"
            className="relative w-9 h-9 flex items-center justify-center rounded-card border border-graphite-100 dark:border-graphite-700 text-graphite-600 dark:text-graphite-100 hover:border-signal-500 hover:text-signal-500 transition-all duration-200 hover:rotate-12"
        >
            {oscuro ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
            )}
        </button>
    );
}