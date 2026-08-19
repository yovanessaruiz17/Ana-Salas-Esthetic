import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, ArrowRight, Info } from 'lucide-react';
import { Service } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Button } from '../common/Button';

interface ServiceCardProps {
  service: Service;
  onOpenDetails?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onOpenDetails }) => {
  return (
    <div className="group bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-[#C5A880]/60">
      <div>
        {/* Service Image / Elegant Placeholder */}
        <div className="relative h-48 sm:h-52 w-full bg-gradient-to-tr from-[#FAF4ED] via-[#F5EFEB] to-[#EAE0D5] overflow-hidden flex items-center justify-center">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full border border-[#C5A880]/40 flex items-center justify-center bg-white/60 text-[#8C6D40] mb-2 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-serif text-sm font-semibold text-[#8C6D40] tracking-wider uppercase">
                {service.category?.name || 'Tratamiento Exclusivo'}
              </span>
            </div>
          )}

          {/* Featured pill */}
          {service.featured && (
            <div className="absolute top-3 left-3 bg-[#C5A880] text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
              Destacado
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#38302E] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs border border-[#E8DFC8]">
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{formatDuration(service.duration_minutes)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="font-serif text-xl font-bold text-[#2D2726] mb-2 group-hover:text-[#8C6D40] transition-colors leading-snug">
            {service.name}
          </h3>
          <p className="text-sm text-[#7A6D69] line-clamp-2 leading-relaxed mb-4">
            {service.short_description || service.description || 'Consulta los detalles de este tratamiento exclusivo.'}
          </p>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[#F2ECE6] flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A39793] block">
            Inversión
          </span>
          <span className="font-serif text-lg font-bold text-[#38302E]">
            {formatCurrency(service.price, service.price_type)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(service)}
              className="p-2.5 rounded-lg border border-[#E2D8CC] text-[#7A6D69] hover:text-[#231F20] hover:bg-[#FAF8F5] transition-colors"
              aria-label={`Ver detalles de ${service.name}`}
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          <Link to={`/reservar/${service.id}`}>
            <Button
              variant="gold"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Reservar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
