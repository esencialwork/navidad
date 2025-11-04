import React from 'react';
import TopBanner from './components/TopBanner.jsx';
import NavBar from './components/NavBar.jsx';
import Hero from './components/Hero.jsx';
import FeatureCards from './components/FeatureCards.jsx';
import PricingSection from './components/PricingSection.jsx';
import Testimonials from './components/Testimonials.jsx';
import FAQSection from './components/FAQSection.jsx';
import ReservationForm from './components/ReservationForm.jsx';
import MemoryGallery from './components/MemoryGallery.jsx';
import Footer from './components/Footer.jsx';
import StickyCta from './components/StickyCta.jsx';
import Snowfall from './components/Snowfall.jsx';
import {
  Clock,
  Camera,
  Image as ImageIcon,
  Truck,
  Calendar,
  CreditCard,
  CheckCircle,
  RefreshCcw,
  Timer,
  ShieldCheck
} from 'lucide-react';
import {
  CAMPAIGN_NAME,
  CAMPAIGN_ALT_NAME,
  CAMPAIGN_PRICE,
  REGULAR_PRICE,
  CAMPAIGN_DEADLINE,
  CAMPAIGN_TIMEZONE,
  CAMPAIGN_TIMEZONE_LABEL,
  CAMPAIGN_COUNTDOWN_LABEL,
  isCampaignActive
} from './config/campaign.js';

export default function App() {
  // Section anchors shared across navigation and content blocks
  const sectionIds = {
    includes: 'que-incluye',
    how: 'como-funciona',
    testimonials: 'testimonios',
    faq: 'faq',
    reservation: 'reserva'
  };

  const campaignActive = isCampaignActive();
  const effectiveCampaignName = CAMPAIGN_NAME;
  const priceLabel = `$${CAMPAIGN_PRICE.toLocaleString('es-MX')} MXN`;
  const regularPriceLabel = `$${REGULAR_PRICE.toLocaleString('es-MX')} MXN`;
  const navLabel = campaignActive
    ? `🎄 ${CAMPAIGN_NAME} — Cupos limitados — ${priceLabel}`
    : '🎄 Promoción finalizada — Consulta nuevas fechas';

  const legalText = 'Vigencia: precio promocional de $2,500 MXN válido solo para reservas confirmadas antes del cierre de nuestra campaña especial de noviembre. No acumulable con otras promociones. Aplica a sesiones navideñas 2025 en Querétaro. Sujeto a disponibilidad.';

  // Content definitions
  const incluyeFeatures = [
    {
      icon: Clock,
      title: 'Sesión de 20–25 min',
      text: 'Tiempo exclusivo por familia en un set auténtico navideño.'
    },
    {
      icon: Camera,
      title: '8 fotos digitales',
      text: 'Ocho fotografías editadas profesionalmente en alta resolución.'
    },
    {
      icon: ImageIcon,
      title: 'Galería privada',
      text: 'Elige tus favoritas en línea desde la comodidad de tu casa.'
    },
    {
      icon: Truck,
      title: 'Entrega rápida',
      text: 'Selección en 48–72 h y galería final en máximo 7 días.'
    }
  ];

  const comoFuncionaFeatures = [
    {
      icon: Calendar,
      title: '1) Elige tu horario',
      text: 'Selecciona el slot que mejor se ajuste a tu agenda.'
    },
    {
      icon: CreditCard,
      title: '2) Confirma con pago seguro',
      text: campaignActive
        ? `Asegura tu sesión con el precio especial de ${priceLabel}.`
        : `Reserva con el precio regular de ${regularPriceLabel}.`
    },
    {
      icon: CheckCircle,
      title: '3) Confirma y prepara',
      text: 'Recibe guía de vestuario, mapa y recordatorios por WhatsApp/email.'
    }
  ];

  const politicasFeatures = [
    {
      icon: RefreshCcw,
      title: 'Reagendación sin costo',
      text: 'Hasta 72 h antes de la sesión.'
    },
    {
      icon: Timer,
      title: 'Puntualidad',
      text: 'Tolerancia 10 min; después se pierde el slot.'
    },
    {
      icon: ShieldCheck,
      title: 'Cancelación por estudio',
      text: 'Reembolso íntegro por fuerza mayor.'
    }
  ];

  const testimonials = [
    {
      quote: 'Increíble experiencia, súper pacientes con los niños.',
      author: 'Carolina R.'
    },
    {
      quote: 'Las fotos más lindas de nuestra Navidad. Volveremos.',
      author: 'Familia López'
    },
    {
      quote: 'Calidad impecable y trato excelente. 10/10.',
      author: 'Rosa M.'
    }
  ];

  const faqItems = [
    {
      q: '¿Cuántas personas por sesión?',
      a: 'Una familia/núcleo. Consulta costo por personas extra.'
    },
    {
      q: '¿Puedo comprar fotos adicionales?',
      a: 'Sí: +5 por $600 MXN o +10 por $1,000 MXN.'
    },
    {
      q: '¿Se permiten mascotas?',
      a: '¡Por supuesto! somos totalmente Petfriendly 🐶 🐾 .'
    },
    {
      q: '¿Incluye impresiones?',
      a: 'No. Puedes adquirir impresiones y mini-álbum como extra.'
    },
    {
      q: '¿Hasta cuándo aplica el precio?',
      a: 'Hasta el cierre de nuestra campaña especial de noviembre (23:59 h, hora de Querétaro).'
    }
  ];

  return (
    <div className="relative bg-white dark:bg-neutral-900">
      <Snowfall />
      <TopBanner
        isCampaignActive={campaignActive}
        campaignPrice={CAMPAIGN_PRICE}
        regularPrice={REGULAR_PRICE}
        campaignName={CAMPAIGN_NAME}
        ctaTarget={`#${sectionIds.reservation}`}
      />
      <NavBar
        sectionIds={sectionIds}
        campaignLabel={navLabel}
        ctaLabel={campaignActive ? `Apartar mi lugar por ${priceLabel}` : 'Reservar mi sesión'}
        ctaTarget={`#${sectionIds.reservation}`}
      />
      <Hero
        ctaTarget={`#${sectionIds.reservation}`}
        campaignName={effectiveCampaignName}
        campaignPrice={CAMPAIGN_PRICE}
        regularPrice={REGULAR_PRICE}
        deadline={CAMPAIGN_DEADLINE}
        countdownLabel={CAMPAIGN_COUNTDOWN_LABEL}
        timeZoneLabel={CAMPAIGN_TIMEZONE_LABEL}
        isCampaignActive={campaignActive}
      />
      <MemoryGallery />
      <FeatureCards title="¿Qué incluye?" features={incluyeFeatures} columns={4} sectionId={sectionIds.includes} />
      <FeatureCards title="¿Cómo funciona?" features={comoFuncionaFeatures} columns={3} sectionId={sectionIds.how} />
      <PricingSection
        isCampaignActive={campaignActive}
        campaignName={effectiveCampaignName}
        campaignPrice={CAMPAIGN_PRICE}
        regularPrice={REGULAR_PRICE}
        legalText={legalText}
        ctaTarget={`#${sectionIds.reservation}`}
      />
      <Testimonials testimonials={testimonials} sectionId={sectionIds.testimonials} />
      <FeatureCards title="Garantías y políticas" features={politicasFeatures} columns={3} sectionId="garantias-politicas" />
      <FAQSection items={faqItems} sectionId={sectionIds.faq} />
      <ReservationForm sectionId={sectionIds.reservation} />
      <Footer sectionIds={sectionIds} />
      <StickyCta
        ctaTarget={`#${sectionIds.reservation}`}
        isCampaignActive={campaignActive}
        campaignName={CAMPAIGN_NAME}
        campaignPrice={CAMPAIGN_PRICE}
        regularPrice={REGULAR_PRICE}
      />
    </div>
  );
}
