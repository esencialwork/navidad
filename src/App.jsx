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

export default function App() {
  // Section anchors shared across navigation and content blocks
  const sectionIds = {
    includes: 'que-incluye',
    how: 'como-funciona',
    testimonials: 'testimonios',
    faq: 'faq',
    reservation: 'reserva'
  };

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
      title: '2) Paga $1,900',
      text: 'Pago completo para asegurar el lugar y evitar no‑shows.'
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
      a: 'Sí, siempre que estén controladas y limpias.'
    },
    {
      q: '¿Incluye impresiones?',
      a: 'No. Puedes adquirir impresiones y mini-álbum como extra.'
    }
  ];

  return (
    <div className="relative bg-white dark:bg-neutral-900">
      <TopBanner />
      <NavBar sectionIds={sectionIds} />
      <Hero ctaTarget={`#${sectionIds.reservation}`} />
      <MemoryGallery />
      <FeatureCards title="¿Qué incluye?" features={incluyeFeatures} columns={4} sectionId={sectionIds.includes} />
      <FeatureCards title="¿Cómo funciona?" features={comoFuncionaFeatures} columns={3} sectionId={sectionIds.how} />
      <PricingSection />
      <Testimonials testimonials={testimonials} sectionId={sectionIds.testimonials} />
      <FeatureCards title="Garantías y políticas" features={politicasFeatures} columns={3} sectionId="garantias-politicas" />
      <FAQSection items={faqItems} sectionId={sectionIds.faq} />
      <ReservationForm sectionId={sectionIds.reservation} />
      <Footer sectionIds={sectionIds} />
      <StickyCta ctaTarget={`#${sectionIds.reservation}`} />
    </div>
  );
}
