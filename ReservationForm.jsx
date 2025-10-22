import React from 'react';

/**
 * Reservation form section with a placeholder calendar and input fields.
 */
export default function ReservationForm() {
  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-800" id="reserva">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-heading text-center mb-8">Reserva tu lugar</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar placeholder */}
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
              Calendario interactivo<br/> (integración con sistema de citas)
            </p>
          </div>
          {/* Form */}
          <form className="space-y-4 p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nombre y apellidos"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Correo
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="tucorreo@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="^\\+?\\d[\\d\\s]{7,}$"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="+52 55 1234 5678"
                aria-describedby="phoneHelp"
                required
              />
              <p id="phoneHelp" className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Incluye lada. Ej: +52 55 1234 5678
              </p>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notas / Información adicional (opcional)
              </label>
              <textarea
                id="notes"
                rows="3"
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="¿Algo que debamos saber?"
              ></textarea>
            </div>
            <div className="flex items-center gap-2">
              <input id="accept" type="checkbox" className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-primary focus:ring-primary" required />
              <label htmlFor="accept" className="text-sm">
                Acepto el uso de mis imágenes con fines promocionales (opcional)
              </label>
            </div>
            <button type="submit" className="w-full bg-primary text-white px-5 py-3 rounded-md hover:bg-primary-dark transition-colors">
              Pagar y confirmar
            </button>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Al hacer clic en “Pagar y confirmar” serás redirigido a nuestro sistema de pagos.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}