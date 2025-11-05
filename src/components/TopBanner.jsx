import React from 'react';

/**
 * Red announcement bar that persists across the site.
 */
export default function TopBanner({
  isCampaignActive,
  regularPrice,
  ctaTarget = '#reserva'
}) {
  const activeMessage = '🎄 Magia de Noviembre: sesiones navideñas a $2,500 MXN. Termina el 17/11.';
  const endedMessage = `🎄 Promoción finalizada — Precio regular $${regularPrice.toLocaleString('es-MX')} MXN.`;

  return (
    <div className="w-full bg-red-600 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-3">
      <span>{isCampaignActive ? activeMessage : endedMessage}</span>
      <a
        href={ctaTarget}
        className="inline-flex items-center rounded-full border border-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white hover:text-red-600 transition"
      >
        {isCampaignActive ? 'Apartar mi lugar' : 'Ver disponibilidad'}
      </a>
    </div>
  );
}
