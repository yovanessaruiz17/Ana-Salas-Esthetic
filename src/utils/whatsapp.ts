import { Booking, Service, SiteSettings } from '../types';
import { formatCurrency, formatDuration } from './formatters';

export function sanitizePhoneNumber(phone?: string | null): string {
  // Remove spaces, plus signs, dashes, parentheses
  if (!phone) return '';
  return String(phone).replace(/[^0-9]/g, '');
}

export function generateWhatsAppLink(phone?: string | null, message: string = ''): string {
  const cleanPhone = sanitizePhoneNumber(phone) || '573001234567';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateWhatsAppBookingLink(
  phone: string | undefined | null,
  customerName: string = '',
  serviceName: string = '',
  date: string = '',
  time: string = '',
  bookingId: string = ''
): string {
  const cleanPhone = sanitizePhoneNumber(phone) || '573001234567';
  const timeFormatted = time ? time.substring(0, 5) : '';
  const refFormatted = bookingId ? `#${bookingId.slice(-6)}` : '#CITA';
  const message = `¡Hola! Acabo de registrar mi cita en la web ✨

📌 *Detalles de mi solicitud:*
👤 *Nombre:* ${customerName || 'Clienta'}
💇‍♀️ *Servicio:* ${serviceName || 'Tratamiento'}
📅 *Fecha:* ${date}
⏰ *Hora:* ${timeFormatted}
🔖 *Referencia:* ${refFormatted}

¿Podrías por favor confirmarme la disponibilidad? ¡Gracias!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildBookingConfirmationWhatsAppMessage(
  booking: {
    customer_name: string;
    customer_phone: string;
    appointment_date: string;
    start_time: string;
    notes?: string | null;
  },
  service: Service,
  settings: SiteSettings
): string {
  const professional = settings.professional_name || 'Ana';
  const businessName = settings.business_name || 'Studio';

  return `Hola ${professional}, ¡acabo de solicitar una cita en ${businessName}! ✨

📌 *Detalles de mi solicitud:*
👤 *Nombre:* ${booking.customer_name}
💇‍♀️ *Servicio:* ${service.name} (${formatDuration(service.duration_minutes)})
💰 *Valor:* ${formatCurrency(service.price, service.price_type)}
📅 *Fecha:* ${booking.appointment_date}
⏰ *Hora:* ${booking.start_time.substring(0, 5)}
${booking.notes ? `📝 *Nota:* ${booking.notes}\n` : ''}
Quedo atenta a tu confirmación. ¡Muchas gracias!`;
}

export function buildGeneralInquiryWhatsAppMessage(
  settings: SiteSettings,
  serviceName?: string
): string {
  const professional = settings.professional_name || 'Ana';
  if (serviceName) {
    return `Hola ${professional}, me gustaría recibir más información sobre el servicio de *${serviceName}*. ¿Podrías asesorarme?`;
  }
  return `Hola ${professional}, me comunico desde tu página web y me gustaría recibir asesoría sobre tus servicios de belleza.`;
}
