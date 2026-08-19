import { PriceType } from '../types';

export function formatCurrency(amount: number, priceType: PriceType = 'fixed'): string {
  const formattedNumber = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);

  switch (priceType) {
    case 'from':
      return `Desde ${formattedNumber}`;
    case 'consultation':
      return 'A consultar';
    case 'fixed':
    default:
      return formattedNumber;
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hora' : `${hours} horas`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minutes = minStr || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 becomes 12
  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function formatDateSpanish(dateStr: string): string {
  if (!dateStr) return '';
  // Avoid timezone offsets by parsing date components
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatPhoneDisplay(phone?: string | null): string {
  if (!phone) return '';
  // Format international or local 10-digit number nicely
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('57')) {
    // +57 300 123 4567
    return `+57 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return String(phone);
}

