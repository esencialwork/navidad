import React, { useState } from 'react';

/**
 * Navigation bar with brand and anchor links.
 */
export default function NavBar({ sectionIds = {} }) {
  const {
    includes = 'que-incluye',
    how = 'como-funciona',
    testimonials = 'testimonios',
    faq = 'faq',
    reservation = 'reserva'
  } = sectionIds;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur fixed top-0 inset-x-0 z-40 border-b border-neutral-200 dark:bg-neutral-900/70 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <a href="#hero" className="flex items-center font-display text-2xl text-primary">
          Sesiones Navideñas
        </a>

        <nav className="hidden md:flex gap-6 font-medium text-sm">
          <a href={`#${includes}`} className="hover:text-primary">Qué incluye</a>
          <a href={`#${how}`} className="hover:text-primary">Cómo funciona</a>
          <a href={`#${testimonials}`} className="hover:text-primary">Testimonios</a>
          <a href={`#${faq}`} className="hover:text-primary">FAQ</a>
          <a href="/aviso-de-privacidad" className="hover:text-primary">Aviso de privacidad</a>
          <a href={`#${reservation}`} className="ml-4 inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
            Apartar mi lugar
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path
              className={isOpen ? 'hidden' : 'block'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              className={isOpen ? 'block' : 'hidden'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="px-4 py-4 space-y-2">
            <a href={`#${includes}`} className="block hover:text-primary" onClick={() => setIsOpen(false)}>Qué incluye</a>
            <a href={`#${how}`} className="block hover:text-primary" onClick={() => setIsOpen(false)}>Cómo funciona</a>
            <a href={`#${testimonials}`} className="block hover:text-primary" onClick={() => setIsOpen(false)}>Testimonios</a>
            <a href={`#${faq}`} className="block hover:text-primary" onClick={() => setIsOpen(false)}>FAQ</a>
            <a href="/aviso-de-privacidad" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Aviso de privacidad</a>
            <a href={`#${reservation}`} className="block mt-2 bg-primary text-white text-center px-4 py-2 rounded-md hover:bg-primary-dark" onClick={() => setIsOpen(false)}>
              Apartar mi lugar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
