import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import {
  Clock,
  Sparkles,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { useToast } from '../../contexts/ToastContext';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, loading } = useServices(false);
  const { showToast } = useToast();

  const service = services.find((s) => s.id === id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name || 'Servicio de Belleza',
          text: `Mira este servicio en Ana María Salas Studio: ${service?.name}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if user canceled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Enlace Copiado',
        message: 'El enlace del servicio fue copiado al portapapeles.',
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-72 rounded-3xl w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2D2726]">
          Servicio no encontrado
        </h2>
        <p className="text-sm text-[#7A6D69]">
          El tratamiento que buscas no existe o ha sido desactivado temporalmente.
        </p>
        <Link to="/servicios">
          <Button variant="gold" size="md">
            Ver todos los servicios
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back button & share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D40] hover:text-[#231F20] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-lg border border-[#E2D8CC] text-[#7A6D69] hover:text-[#231F20] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          aria-label="Compartir servicio"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm">
        {/* Banner image or styled header */}
        {service.image_url ? (
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={service.image_url}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {service.featured && (
              <span className="absolute top-4 left-4 bg-[#C5A880] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                Tratamiento Estrella
              </span>
            )}
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-tr from-[#FAF4ED] via-[#F5EFEB] to-[#EAE0D5] flex items-center justify-center border-b border-[#E8DFC8]">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-[#8C6D40] mx-auto mb-2" />
              <span className="font-serif text-sm font-semibold uppercase tracking-widest text-[#8C6D40]">
                {service.category?.name || 'Tratamiento Exclusivo'}
              </span>
            </div>
          </div>
        )}

        {/* Content body */}
        <div className="p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D40] block mb-1">
              {service.category?.name || 'Cejas & Maquillaje'}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#2D2726]">
              {service.name}
            </h1>
            {service.short_description && (
              <p className="text-base text-[#7A6D69] mt-2 leading-relaxed">
                {service.short_description}
              </p>
            )}
          </div>

          {/* Key metrics / investment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A39793] block">
                  Duración Estimada
                </span>
                <span className="font-serif text-lg font-bold text-[#2D2726]">
                  {formatDuration(service.duration_minutes)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A39793] block">
                  Inversión
                </span>
                <span className="font-serif text-lg font-bold text-[#8C6D40]">
                  {formatCurrency(service.price, service.price_type)}
                </span>
              </div>
            </div>
          </div>

          {/* Full description */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#2D2726] uppercase tracking-wide">
              Detalle del Procedimiento
            </h3>
            <p className="text-sm sm:text-base text-[#554C4A] leading-relaxed whitespace-pre-line">
              {service.description ||
                'Este servicio incluye diagnóstico personalizado, preparación especializada y el uso de técnicas de última generación para garantizar la máxima duración y armonía estética.'}
            </p>
          </div>

          {/* Preparation & Aftercare Accordions/Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.preparation_notes && (
              <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C6D40]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D40]">
                    Antes de tu cita
                  </h4>
                </div>
                <p className="text-xs text-[#6E625F] leading-relaxed">
                  {service.preparation_notes}
                </p>
              </div>
            )}

            {service.aftercare_notes && (
              <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-[#8C6D40]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D40]">
                    Cuidados posteriores
                  </h4>
                </div>
                <p className="text-xs text-[#6E625F] leading-relaxed">
                  {service.aftercare_notes}
                </p>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-6 border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#8C7E7A] block">¿Lista para tu cita?</span>
              <span className="font-serif font-bold text-lg text-[#2D2726]">
                Cupos limitados por día
              </span>
            </div>

            <Link to={`/reservar/${service.id}`} className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                fullWidth
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Agendar este Servicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
