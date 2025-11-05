import React from 'react';

const BENEFITS = [
  'Sesión de máximo 40 minutos',
  '10 fotos digitales editadas en alta resolución',
  'Entrega en máximo 48 horas',
  'Galería privada activa por 15 días',
  'Máximo 5 personas (persona extra: $350)',
  'Hasta 2 perritos incluidos (perrito extra: $250)',
  'Somos pet friendly',
  'Impresiones al momento (opcional): paquete de 10 fotos por $290'
];

/**
 * Pricing section with campaign behaviour.
 */
export default function PricingSection({
  isCampaignActive,
  campaignName,
  campaignPrice,
  regularPrice,
  legalText,
  ctaTarget = '#reserva'
}) {
  const priceLabel = `$${campaignPrice.toLocaleString('es-MX')} MXN`;
  const regularPriceLabel = `$${regularPrice.toLocaleString('es-MX')} MXN`;
  const badge = isCampaignActive ? campaignName : 'Tarifa regular';
  const heading = isCampaignActive ? 'Paquete Magia de Noviembre' : 'Sesiones navideñas 2025';
  const ctaText = isCampaignActive ? `Apartar mi lugar por ${priceLabel}` : 'Reservar mi sesión';
  const helperText = isCampaignActive
    ? 'Campaña especial de noviembre — cupos limitados.'
    : `Precio regular vigente ${regularPriceLabel}.`;

  return (
    <section className="py-12 bg-white dark:bg-neutral-900" id="precio">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2 className="text-2xl font-heading mb-8">{heading}</h2>
        <div className="max-w-md mx-auto p-6 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl relative">
          <span className="absolute top-4 right-4 text-xs font-semibold uppercase text-primary">{badge}</span>
          <div className="mb-4">
            <span className="text-4xl font-semibold">{isCampaignActive ? priceLabel : regularPriceLabel}</span>
            <span className="ml-2 text-sm text-neutral-600">MXN por sesión</span>
          </div>
          <ul className="space-y-2 text-left mb-6 text-sm text-neutral-700 dark:text-neutral-300">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <a href={ctaTarget} className="inline-block bg-primary text-white px-5 py-3 rounded-md hover:bg-primary-dark transition-colors w-full">
            {ctaText}
          </a>
          <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
          {legalText ? (
            <p className="mt-4 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed text-left">
              {legalText}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
