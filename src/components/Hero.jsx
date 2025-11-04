import React from 'react';
import Countdown from './Countdown.jsx';
import heroImage from '../assets/navidad_hero.jpg';

/**
 * The hero section introduces the offer and includes a countdown timer.
 */
export default function Hero({ ctaTarget = '#reserva' }) {
  // Determine a deadline (for example a week ahead from current date).
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 7);

  return (
    <section className="pt-24 pb-16 bg-primary text-white" id="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm uppercase tracking-wide mb-2">Preventa Navideña 2025</p>
          <h1 className="font-heading text-4xl sm:text-5xl mb-4">Sesiones Fotográficas Navideñas</h1>
          <p className="max-w-md text-base mb-6">Asegura tu sesión hoy por $1,900 MXN. Set real como en las fotos. Cupos limitados.</p>

          <a href={ctaTarget} className="inline-flex items-center bg-white text-primary font-medium px-5 py-3 rounded-md shadow hover:bg-neutral-100">
            Apartar mi lugar por $1,900
          </a>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">La preventa termina en:</p>
            <Countdown deadline={deadline} />
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src={heroImage}
            alt="Familia posando en set navideño"
            className="rounded-lg shadow-lg"
            width="600"
            height="400"
          />
        </div>
      </div>
    </section>
  );
}
