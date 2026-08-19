import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { Service } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency, formatDuration } from '../../utils/formatters';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service.name}
      subtitle={service.category?.name || 'Tratamiento Especializado'}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Service Banner / Visual */}
        {service.image_url ? (
          <div className="h-56 w-full rounded-xl overflow-hidden border border-[#E8DFC8]">
            <img
              src={service.image_url}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-28 w-full rounded-xl bg-gradient-to-r from-[#F5EFEB] to-[#EAE0D5] border border-[#E8DFC8] flex items-center justify-center text-[#8C6D40] gap-3">
            <Sparkles className="w-6 h-6" />
            <span className="font-serif text-lg font-semibold">
              Atención Exclusiva & Personalizada
            </span>
          </div>
        )}

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-[#E8DFC8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A39793] block">
                Duración Estimada
              </span>
              <span className="font-serif font-bold text-base text-[#38302E]">
                {formatDuration(service.duration_minutes)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A39793] block">
                Valor del Servicio
              </span>
              <span className="font-serif font-bold text-base text-[#38302E]">
                {formatCurrency(service.price, service.price_type)}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h4 className="font-serif text-base font-bold text-[#2D2726] mb-2 uppercase tracking-wide">
            Descripción del Procedimiento
          </h4>
          <p className="text-sm text-[#554C4A] leading-relaxed whitespace-pre-line">
            {service.description ||
              service.short_description ||
              'Procedimiento realizado con técnicas de vanguardia, cuidando la salud cutánea y respetando la armonía de tus facciones.'}
          </p>
        </div>

        {/* Preparation Notes */}
        {service.preparation_notes && (
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8C6D40]" />
              Preparación para tu cita
            </h5>
            <p className="text-xs text-[#6E625F] leading-relaxed">
              {service.preparation_notes}
            </p>
          </div>
        )}

        {/* Aftercare Notes */}
        {service.aftercare_notes && (
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#8C6D40]" />
              Cuidados posteriores
            </h5>
            <p className="text-xs text-[#6E625F] leading-relaxed">
              {service.aftercare_notes}
            </p>
          </div>
        )}

        {/* Booking CTA Footer */}
        <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cerrar
          </Button>
          <Link to={`/reservar/${service.id}`} onClick={onClose}>
            <Button
              variant="gold"
              size="md"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Reservar este servicio
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
