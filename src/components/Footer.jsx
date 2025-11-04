import React from 'react';

/**
 * Footer with small navigation links and copyright.
 */
export default function Footer({ sectionIds = {} }) {
  const {
    includes = 'que-incluye',
    how = 'como-funciona',
    testimonials = 'testimonios',
    faq = 'faq'
  } = sectionIds;

  return (
    <footer className="bg-neutral-900 text-neutral-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">
          <strong className="font-display text-lg text-primary">Sesiones Navideñas</strong>
          <p>Capturamos los mejores momentos navideños</p>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href={`#${includes}`} className="hover:text-primary">Qué incluye</a>
          <a href={`#${how}`} className="hover:text-primary">Cómo funciona</a>
          <a href={`#${testimonials}`} className="hover:text-primary">Testimonios</a>
          <a href={`#${faq}`} className="hover:text-primary">FAQ</a>
        </nav>
      </div>
      <div className="mt-6 text-center text-xs text-neutral-500">
        © 2025 Sesiones Navideñas. Todos los derechos reservados.
      </div>
    </footer>
  );
}
