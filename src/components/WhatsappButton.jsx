export default function WhatsAppButton() {
    const numero = '504096804671';
    const mensaje = 'Hola, quiero más información sobre sus productos';

    const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-1 left-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-transform duration-200 md:hidden"
            aria-label="Contactar por WhatsApp"
        >
            <svg
                viewBox="0 0 32 32"
                width="28"
                height="28"
                fill="white"
            >
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.474 2.03 7.773L0 32l8.42-2.01A15.9 15.9 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.09c-2.5 0-4.85-.68-6.86-1.87l-.49-.29-5 1.2 1.22-4.87-.32-.5A13.08 13.08 0 012.9 16C2.9 8.77 8.77 2.9 16 2.9S29.1 8.77 29.1 16 23.23 29.09 16 29.09zm7.16-9.72c-.39-.2-2.3-1.13-2.66-1.26-.36-.13-.62-.2-.88.2-.26.39-1 1.26-1.23 1.52-.23.26-.45.29-.84.1-.39-.2-1.63-.6-3.11-1.92-1.15-1.02-1.93-2.29-2.15-2.68-.23-.39-.02-.6.17-.79.18-.18.39-.45.58-.68.2-.23.26-.39.39-.65.13-.26.06-.49-.03-.68-.1-.2-.88-2.11-1.2-2.9-.32-.76-.64-.66-.88-.67-.23-.01-.49-.01-.75-.01s-.68.1-1.04.49c-.36.39-1.36 1.33-1.36 3.24s1.39 3.75 1.58 4.01c.2.26 2.73 4.17 6.62 5.85.93.4 1.65.64 2.22.82.93.3 1.78.26 2.45.16.75-.11 2.3-.94 2.62-1.85.33-.9.33-1.68.23-1.84-.1-.16-.36-.26-.75-.46z" />
            </svg>
        </a>
    );
}