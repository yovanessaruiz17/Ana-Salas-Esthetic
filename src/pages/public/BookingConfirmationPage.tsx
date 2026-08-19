import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  MessageCircle,
  Share2,
  Download,
  ExternalLink,
  User,
  Phone,
  Home,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { formatDateSpanish, formatTime12h, formatDuration, formatCurrency } from '../../utils/formatters';
import { generateWhatsAppBookingLink, sanitizePhoneNumber } from '../../utils/whatsapp';

export const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const { settings } = useSettings();

  // State from booking wizard navigation
  const state = location.state as {
    booking?: {
      id: string;
      appointment_date: string;
      start_time: string;
      customer_name: string;
      customer_phone: string;
      customer_email?: string;
      notes?: string;
    };
    service?: {
      id: string;
      name: string;
      duration_minutes: number;
      price: number;
      price_type: 'fixed' | 'from';
      preparation_notes?: string;
    };
  } | undefined;

  const booking = state?.booking;
  const service = state?.service;

  // Generate WhatsApp Direct Confirmation Link
  const fallbackWaNumber = sanitizePhoneNumber(settings?.whatsapp_number) || '573001234567';
  const whatsappUrl = booking && service
    ? generateWhatsAppBookingLink(
        settings?.whatsapp_number,
        booking.customer_name,
        service.name,
        booking.appointment_date,
        booking.start_time,
        booking.id
      )
    : `https://wa.me/${fallbackWaNumber}?text=Hola,%20acabo%20de%20solicitar%20una%20reserva%20con%20referencia%20${bookingId || 'PENDIENTE'}`;

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    if (!booking || !service || !booking.appointment_date || !booking.start_time) return '#';
    const cleanDate = String(booking.appointment_date).replace(/-/g, '');
    const cleanTime = String(booking.start_time).replace(/:/g, '') + '00';
    
    // Approximate end time
    const [h, m] = String(booking.start_time).split(':').map(Number);
    const totalMinutes = (h || 0) * 60 + (m || 0) + (service.duration_minutes || 60);
    const endH = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const endM = String(totalMinutes % 60).padStart(2, '0');
    const cleanEndTime = `${endH}${endM}00`;

    const title = encodeURIComponent(`Cita: ${service.name} - Ana María Salas`);
    const details = encodeURIComponent(
      `Cita en Ana María Salas Studio.\nServicio: ${service.name}\nClienta: ${booking.customer_name}\nDirección: ${settings?.address || 'Estudio Privado'}\nReferencia: #${bookingId || ''}`
    );
    const locationStr = encodeURIComponent(settings?.address || 'Ana María Salas Studio');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}T${cleanTime}/${cleanDate}T${cleanEndTime}&details=${details}&location=${locationStr}`;
  };

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shadow-sm animate-bounce-short">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Solicitud Registrada con Éxito</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2726]">
          ¡Tu Cita ha sido Reservada!
        </h1>
        <p className="text-sm text-[#7A6D69] max-w-md mx-auto leading-relaxed">
          Hemos recibido los datos de tu reserva con el código{' '}
          <span className="font-mono font-bold text-[#2D2726] bg-[#F2ECE6] px-2 py-0.5 rounded">
            #{bookingId?.slice(-6) || 'PENDIENTE'}
          </span>
        </p>
      </div>

      {/* WhatsApp Primary Callout */}
      <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-emerald-950">
              Paso Final: Confirmar por WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed mt-0.5">
              Para garantizar y bloquear tu turno en la agenda de Ana María Salas, por favor pulsa el botón a continuación para enviar los detalles prellenados por WhatsApp.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            variant="gold"
            size="lg"
            fullWidth
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white border-transparent shadow-md text-base"
            leftIcon={<MessageCircle className="w-5 h-5 fill-current" />}
          >
            Enviar Confirmación a WhatsApp
          </Button>
        </a>
      </div>

      {/* Booking Summary Card */}
      {booking && service && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE6]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                Tratamiento
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2D2726]">
                {service.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                Inversión
              </span>
              <span className="font-serif text-lg font-bold text-[#8C6D40]">
                {formatCurrency(service.price, service.price_type)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-4 h-4 text-[#8C6D40] mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-[#A39793] block">Fecha</span>
                <span className="font-semibold text-[#2D2726] capitalize">
                  {formatDateSpanish(booking.appointment_date)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#8C6D40] mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-[#A39793] block">Horario & Duración</span>
                <span className="font-semibold text-[#2D2726]">
                  {formatTime12h(booking.start_time)} ({formatDuration(service.duration_minutes)})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-[#8C6D40] mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-[#A39793] block">Clienta</span>
                <span className="font-semibold text-[#2D2726]">
                  {booking.customer_name}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#8C6D40] mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-[#A39793] block">Teléfono / WhatsApp</span>
                <span className="font-semibold text-[#2D2726]">
                  {booking.customer_phone}
                </span>
              </div>
            </div>

            {settings.address && (
              <div className="sm:col-span-2 flex items-start gap-3 pt-2 border-t border-[#F2ECE6]">
                <MapPin className="w-4 h-4 text-[#8C6D40] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-[#A39793] block">Lugar de Atención</span>
                  <span className="font-semibold text-[#2D2726]">
                    {settings.address}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Preparation Reminder */}
          {service.preparation_notes && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs text-[#6E625F] leading-relaxed">
              <span className="font-bold text-[#8C6D40] block mb-1">
                📌 Recordatorio de preparación:
              </span>
              {service.preparation_notes}
            </div>
          )}

          {/* Calendar Sync Options */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<CalendarIcon className="w-4 h-4 text-[#8C6D40]" />}
              >
                Añadir a Google Calendar
              </Button>
            </a>

            <Link to="/servicios" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" fullWidth leftIcon={<Home className="w-4 h-4" />}>
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
