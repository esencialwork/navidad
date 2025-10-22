import React from 'react';

/**
 * Testimonials section displaying quotes.
 */
export default function Testimonials({ testimonials }) {
  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-800" id="testimonios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-heading text-center mb-8">Opiniones de clientes</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <blockquote key={idx} className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
              <p className="text-sm italic mb-4">&quot;{item.quote}&quot;</p>
              <footer className="text-sm font-medium">{item.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}