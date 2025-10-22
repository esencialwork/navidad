import React from 'react';

/**
 * Pricing section with a single package card.
 */
export default function PricingSection() {
  return (
    <section className="py-12 bg-white dark:bg-neutral-900" id="precio">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2 className="text-2xl font-heading mb-8">Paquete único de preventa</h2>
        <div className="max-w-md mx-auto p-6 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl relative">
          <span className="absolute top-4 right-4 text-xs font-semibold uppercase text-primary">Cupos limitados</span>
          <div className="mb-4">
            <span className="text-4xl font-semibold">$1,900</span>
            <span className="ml-2 text-sm text-neutral-600">MXN por sesión</span>
          </div>
          <ul className="space-y-2 text-left mb-6 text-sm text-neutral-700 dark:text-neutral-300">
            <li>20–25 min de sesión</li>
            <li>8 fotos finales editadas</li>
            <li>Galería privada</li>
            <li>Set navideño real</li>
            <li>Entrega en 7 días</li>
          </ul>
          <a href="#reserva" className="inline-block bg-primary text-white px-5 py-3 rounded-md hover:bg-primary-dark transition-colors w-full">
            Apartar mi lugar por $1,900
          </a>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">Al terminar la preventa, el precio sube a $2,200.</p>
        </div>
      </div>
    </section>
  );
}