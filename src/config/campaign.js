export const CAMPAIGN_NAME = 'Magia de Noviembre';
export const CAMPAIGN_ALT_NAME = 'Días de Magia Navideña';
export const CAMPAIGN_PRICE = 2500;
export const REGULAR_PRICE = 2900;
export const CAMPAIGN_DEADLINE = new Date('2025-11-18T05:59:59Z'); // 23:59 h del 17 de noviembre en Querétaro (UTC-06)
export const CAMPAIGN_TIMEZONE = 'America/Mexico_City';
export const CAMPAIGN_TIMEZONE_LABEL = 'Querétaro, Qro. (UTC−06:00)';
export const CAMPAIGN_COUNTDOWN_LABEL = 'La campaña Magia de Noviembre termina en:';

export function isCampaignActive(referenceDate = new Date()) {
  return referenceDate.getTime() < CAMPAIGN_DEADLINE.getTime();
}
