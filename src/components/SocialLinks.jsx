import React, { useState } from 'react';
import '../assets/SocialLinks.css';

const SOCIAL_LINKS = [
    {
        href: 'https://wa.me/50496804671',
        icon: 'fa-brands fa-whatsapp',
        label: 'WhatsApp',
        color: '#25d366',
    },
    {
        href: 'https://www.facebook.com/share/19V1SB8JhD/',
        icon: 'fa-brands fa-facebook',
        label: 'Facebook',
        color: '#1877f2',
    },

    // {
    //     href: ' ',
    //     icon: 'fa-brands fa-instagram',
    //     label: 'Instagram',
    //     color: '#e1306c',
    // },
];

const SocialLinks = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <nav className="social-sidebar" aria-label="Redes sociales">
            <div className="social-line social-line-top" />

            {SOCIAL_LINKS.map(({ href, icon, label, color }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className={`social-icon-wrap${hovered === label ? ' social-hovered' : ''}`}
                    style={{ '--brand-color': color }}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <i className={icon} />
                    <span className="social-tooltip">{label}</span>
                </a>
            ))}

            <div className="social-line social-line-bottom" />
        </nav>
    );
};

export default SocialLinks;