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
  ShieldCheck,
  Users,
  PawPrint,
  Printer
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

  const legalText = 'Vigencia: precio promocional de $2,500 MXN válido para reservas confirmadas antes del 17 de noviembre de 2025 a las 23:59 h (hora de Querétaro). No acumulable con otras promociones. Sujeto a disponibilidad. Desde el 18/11/2025 aplica el precio regular de $2,900 MXN.';

  // Content definitions
  const incluyeFeatures = [
    {
      icon: Clock,
      title: 'Sesión de máximo 40 minutos',
      text: 'Tiempo suficiente para retratar a tu familia en diferentes poses y escenarios navideños.'
    },
    {
      icon: Camera,
      title: '10 fotos digitales editadas',
      text: 'Recibe diez fotografías en alta resolución con retoque profesional.'
    },
    {
      icon: Timer,
      title: 'Entrega en máximo 48 horas',
      text: 'Tu galería estará lista para descargar en dos días o menos.'
    },
    {
      icon: ImageIcon,
      title: 'Galería privada por 15 días',
      text: 'Accede y selecciona tus favoritas desde un enlace seguro disponible durante dos semanas.'
    },
    {
      icon: Users,
      title: 'Hasta 5 personas por sesión',
      text: 'Ideal para familias. Persona extra $350 MXN.'
    },
    {
      icon: PawPrint,
      title: 'Somos pet friendly',
      text: 'Hasta 2 perritos incluidos. Perrito extra $250 MXN.'
    },
    {
      icon: ShieldCheck,
      title: 'Set navideño real',
      text: 'Ambientación premium para crear recuerdos memorables.'
    },
    {
      icon: Printer,
      title: 'Impresiones al momento (extra)',
      text: 'Paquete de 10 fotos impresas por $290 MXN durante tu sesión.'
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
      q: '¿Cuánto dura la sesión?',
      a: 'Máximo 40 minutos.'
    },
    {
      q: '¿Cuántas fotos incluye?',
      a: '10 fotos digitales editadas en alta resolución.'
    },
    {
      q: '¿En cuánto tiempo entregan?',
      a: 'En máximo 48 horas.'
    },
    {
      q: '¿Cuánto tiempo estará disponible mi galería?',
      a: '15 días.'
    },
    {
      q: '¿Cuántas personas pueden asistir?',
      a: 'Hasta 5 personas; persona extra $350.'
    },
    {
      q: '¿Se permiten mascotas?',
      a: 'Sí, somos pet friendly. Hasta 2 perritos; perrito extra $250.'
    },
    {
      q: '¿Incluye impresiones?',
      a: 'No.'
    },
    {
      q: '¿Puedo adquirir impresiones?',
      a: 'Sí, impresiones al momento: paquete de 10 fotos por $290.'
    },
    {
      q: '¿Puedo comprar fotos adicionales?',
      a: 'Sí, se pueden adquirir desde la galería una vez que recibas tus fotos.'
    }
  ];

  return (
    <div className="relative bg-white dark:bg-neutral-900">
      <Snowfall />
      <TopBanner
        isCampaignActive={campaignActive}
        regularPrice={REGULAR_PRICE}
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
