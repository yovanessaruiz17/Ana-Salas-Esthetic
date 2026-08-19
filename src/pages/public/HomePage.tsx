import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Heart,
  ChevronDown,
  ArrowRight,
  Star,
  MapPin,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ServiceCard } from '../../components/services/ServiceCard';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { useServices } from '../../hooks/useServices';
import { useReviews } from '../../hooks/useReviews';
import { useSettings } from '../../contexts/SettingsContext';
import { Service } from '../../types';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const { services, loading: servicesLoading } = useServices(false);
  const { reviews, averageRating, totalReviews, loading: reviewsLoading } = useReviews(true);
  const { onOpenServiceDetails } = useOutletContext<{
    onOpenServiceDetails: (service: Service) => void;
  }>();

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredServices = services.filter((s) => s.featured).slice(0, 3);
  const displayServices = featuredServices.length > 0 ? featuredServices : services.slice(0, 3);

  const faqs = [
    {
      q: '¿Cómo funciona el proceso de reserva?',
      a: 'Puedes agendar tu cita seleccionando el servicio, la fecha y el horario deseado directamente en nuestra plataforma. Luego de registrar tus datos, recibirás un mensaje de WhatsApp para validar los detalles de tu cita de forma inmediata.',
    },
    {
      q: '¿Con cuánta anticipación debo agendar mi cita?',
      a: 'Recomendamos reservar con al menos 24 a 48 horas de anticipación para garantizar tu horario preferido. Para citas de eventos especiales o fines de semana, es ideal apartar con 1 o 2 semanas de antelación.',
    },
    {
      q: '¿Qué cuidados previos debo tener para el diseño de cejas o maquillaje?',
      a: 'Para diseño de cejas, te sugerimos no depilarlas ni recortarlas por al menos 2 semanas previas para lograr el mejor visagismo. Para maquillaje, asiste con la piel limpia, hidratada y sin maquillaje previo.',
    },
    {
      q: '¿Cuáles son los métodos de pago aceptados?',
      a: 'Aceptamos transferencias bancarias (Nequi, Daviplata, Bancolombia) y pago en efectivo al momento de tu cita en el estudio.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 overflow-hidden pb-12">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cejista & Maquillista Profesional</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D2726] tracking-tight leading-[1.15]">
              Realza tu belleza natural con{' '}
              <span className="text-[#8C6D40] italic font-normal block sm:inline">
                armonía & elegancia
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6E625F] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Diseño de cejas personalizado, visagismo de alta precisión y maquillaje profesional para eventos memorables. Cuidado especializado que resalta lo mejor de tu rostro.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/reservar" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Agendar Cita Online
                </Button>
              </Link>
              <Link to="/servicios" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" fullWidth>
                  Ver Catálogo de Servicios
                </Button>
              </Link>
            </div>

            {/* Badges / Trust points */}
            <div className="pt-8 border-t border-[#E8DFC8]/70 grid grid-cols-3 gap-4 sm:gap-6 text-left">
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#2D2726]">
                  +5 Años
                </div>
                <div className="text-xs text-[#8C7E7A] mt-0.5">
                  De Trayectoria
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#2D2726]">
                  100%
                </div>
                <div className="text-xs text-[#8C7E7A] mt-0.5">
                  Personalizado
                </div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-[#2D2726] flex items-center gap-1">
                  <span>{averageRating > 0 ? averageRating : '5.0'}</span>
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                </div>
                <div className="text-xs text-[#8C7E7A] mt-0.5">
                  {totalReviews > 0 ? `${totalReviews} Reseñas` : 'Satisfacción Total'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background shape */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#EBDBC9] to-[#FAF4ED] rounded-3xl transform rotate-2 blur-xs -z-10" />
              
              <div className="bg-white rounded-3xl p-3 border border-[#E8DFC8] shadow-lg overflow-hidden">
                <div className="h-[360px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#FAF4ED] relative">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                    alt="Ana María Salas - Cejista y Maquillista Profesional"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#EBDBC9]">
                      Estudio Privado
                    </span>
                    <h3 className="font-serif text-xl font-bold">
                      {settings.professional_name || 'Ana María Salas'}
                    </h3>
                    <p className="text-xs text-white/80">
                      {settings.city || 'Atención Exclusiva con Cita Previa'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Guarantee Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8DFC8] shadow-md max-w-[240px] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2D2726] leading-snug">
                    Técnicas de Alta Precisión
                  </h4>
                  <p className="text-[11px] text-[#7A6D69] leading-tight mt-0.5">
                    Visagismo y maquillaje de autor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] block mb-1">
              Experiencias & Tratamientos
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2726]">
              Servicios Destacados
            </h2>
          </div>
          <Link
            to="/servicios"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C6D40] hover:text-[#231F20] transition-colors"
          >
            <span>Ver todos los servicios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenDetails={onOpenServiceDetails}
            />
          ))}
        </div>
      </section>

      {/* ================= ABOUT & PHILOSOPHY ================= */}
      <section className="bg-[#F5EFEB] py-16 sm:py-24 border-y border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-[#E8DFC8] bg-white p-3 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                  alt="Proceso de diseño y maquillaje"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] block">
                Filosofía de Belleza
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2726] leading-tight">
                Cada rostro cuenta una historia única. Nuestro compromiso es armonizarla.
              </h2>
              <p className="text-sm sm:text-base text-[#554C4A] leading-relaxed">
                {settings.about_text ||
                  'Con más de 5 años de experiencia en visagismo de cejas y estilismo de maquillaje profesional, combinamos técnicas avanzadas con productos de la más alta gama internacional. Nuestro objetivo es que te sientas segura, radiante y cómoda con un diseño que respeta tu esencia.'}
              </p>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF4ED] text-[#8C6D40] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2726]">
                      Bioseguridad & Higiene
                    </h4>
                    <p className="text-xs text-[#7A6D69] mt-0.5">
                      Herramientas esterilizadas y material descartable de uso exclusivo.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF4ED] text-[#8C6D40] flex-shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2726]">
                      Atención Personalizada
                    </h4>
                    <p className="text-xs text-[#7A6D69] mt-0.5">
                      Estudio privado, sin prisas, dedicado 100% a ti durante tu turno.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/reservar">
                  <Button variant="gold" size="md">
                    Reservar tu Experiencia
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLIENT REVIEWS ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] block mb-1">
              Testimonios Reales
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2726]">
              Lo que opinan nuestras clientas
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/resenas"
              className="text-xs font-semibold text-[#8C6D40] hover:text-[#231F20] transition-colors"
            >
              Ver todas las opiniones
            </Link>
            <Link to="/resenas/nueva">
              <Button variant="secondary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Dejar mi reseña
              </Button>
            </Link>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E8DFC8] text-center max-w-md mx-auto">
            <p className="text-sm text-[#7A6D69] mb-4">
              Sé la primera en compartir tu experiencia en nuestro estudio.
            </p>
            <Link to="/resenas/nueva">
              <Button variant="gold" size="sm">
                Escribir Reseña
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] block mb-1">
            Resolvemos tus dudas
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2726]">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-serif text-base font-bold text-[#2D2726] hover:text-[#8C6D40] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8C6D40] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#6E625F] leading-relaxed border-t border-[#F2ECE6]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FINAL LUXURY CTA BANNER ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#2D2726] via-[#38302E] to-[#453A37] text-white p-8 sm:p-14 overflow-hidden border border-[#E8DFC8]/20 shadow-xl text-center">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF4ED]/10 border border-[#FAF4ED]/20 flex items-center justify-center text-[#C5A880] mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              ¿Lista para transformar tu mirada y lucir inolvidable?
            </h2>

            <p className="text-sm sm:text-base text-[#E2D8CC] leading-relaxed">
              Agenda tu cita en línea en menos de dos minutos. Elige el servicio y horario que mejor se adapten a tu día.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/reservar" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Agendar Mi Cita Ahora
                </Button>
              </Link>
              <Link to="/contacto" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Información & Ubicación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
