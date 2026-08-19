import React from 'react';
import { useParams } from 'react-router-dom';
import { BookingWizard } from '../../components/booking/BookingWizard';
import { Sparkles, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId?: string }>();

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agenda en Línea</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2726]">
          Reserva tu Cita
        </h1>
        <p className="text-sm sm:text-base text-[#6E625F] leading-relaxed">
          Sigue los pasos a continuación para seleccionar tu tratamiento, elegir el día y hora disponibles y confirmar tu asistencia.
        </p>
      </div>

      {/* Main Wizard */}
      <BookingWizard initialServiceId={serviceId} />

      {/* Security & Reassurance Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-center">
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8]/60 space-y-1">
          <Clock className="w-5 h-5 text-[#8C6D40] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#2D2726] uppercase">
            Puntualidad Garantizada
          </h4>
          <p className="text-[11px] text-[#7A6D69]">
            Tu tiempo es valioso. Los turnos están programados sin demoras.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8]/60 space-y-1">
          <ShieldCheck className="w-5 h-5 text-[#8C6D40] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#2D2726] uppercase">
            Bioseguridad Total
          </h4>
          <p className="text-[11px] text-[#7A6D69]">
            Ambiente higienizado y protocolos médicos de desinfección.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8]/60 space-y-1">
          <CheckCircle2 className="w-5 h-5 text-[#8C6D40] mx-auto" />
          <h4 className="font-serif text-xs font-bold text-[#2D2726] uppercase">
            Confirmación Directa
          </h4>
          <p className="text-[11px] text-[#7A6D69]">
            Validación inmediata por WhatsApp con Ana María Salas.
          </p>
        </div>
      </div>
    </div>
  );
};
