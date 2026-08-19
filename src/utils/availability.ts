import { Booking, BusinessHour, ScheduleException, TimeSlot } from '../types';
import { 
  addMinutesToTime, 
  getDayOfWeekFromDateString, 
  getTodayDateString, 
  parseTimeToMinutes 
} from './dates';
import { formatTime12h } from './formatters';

export function calculateAvailableSlots(params: {
  dateStr: string;
  durationMinutes: number;
  businessHours: BusinessHour[];
  exceptions: ScheduleException[];
  existingBookings: Booking[];
  slotIntervalMinutes?: number;
}): { slots: TimeSlot[]; isClosed: boolean; reason?: string } {
  const {
    dateStr,
    durationMinutes,
    businessHours,
    exceptions,
    existingBookings,
    slotIntervalMinutes = 30,
  } = params;

  // 1. Check if date is in the past
  const today = getTodayDateString();
  if (dateStr < today) {
    return { slots: [], isClosed: true, reason: 'No se pueden agendar citas en fechas pasadas.' };
  }

  // 2. Check schedule exceptions for this exact date
  const dayExceptions = exceptions.filter((ex) => ex.date === dateStr);
  const closedException = dayExceptions.find((ex) => ex.type === 'closed');
  if (closedException) {
    return {
      slots: [],
      isClosed: true,
      reason: closedException.reason || 'Estudio cerrado por vacaciones o fecha especial.',
    };
  }

  // 3. Determine base operating intervals
  const specialHours = dayExceptions.filter((ex) => ex.type === 'special_hours' && ex.start_time && ex.end_time);
  const dayOfWeek = getDayOfWeekFromDateString(dateStr);

  let activeRanges: { start: number; end: number }[] = [];

  if (specialHours.length > 0) {
    // Use special hours
    activeRanges = specialHours.map((sh) => ({
      start: parseTimeToMinutes(sh.start_time!),
      end: parseTimeToMinutes(sh.end_time!),
    }));
  } else {
    // Use standard business hours for this day of the week
    const dayHours = businessHours.filter(
      (bh) => bh.day_of_week === dayOfWeek && bh.active
    );
    if (dayHours.length === 0) {
      return { slots: [], isClosed: true, reason: 'Día no laboral según horario habitual.' };
    }
    activeRanges = dayHours.map((bh) => ({
      start: parseTimeToMinutes(bh.start_time),
      end: parseTimeToMinutes(bh.end_time),
    }));
  }

  // 4. Blocked times from exceptions
  const blockedExceptions = dayExceptions.filter(
    (ex) => ex.type === 'blocked' && ex.start_time && ex.end_time
  );
  const blockedRanges = blockedExceptions.map((be) => ({
    start: parseTimeToMinutes(be.start_time!),
    end: parseTimeToMinutes(be.end_time!),
  }));

  // 5. Existing active bookings (exclude cancelled)
  const activeBookings = existingBookings.filter(
    (b) => b.status !== 'cancelled'
  );
  const bookedRanges = activeBookings.map((b) => ({
    start: parseTimeToMinutes(b.start_time),
    end: parseTimeToMinutes(b.end_time),
  }));

  // 6. Current time check if date is today (require at least 1 hour advance booking)
  let currentMinutesToday = -1;
  if (dateStr === today) {
    const now = new Date();
    currentMinutesToday = now.getHours() * 60 + now.getMinutes() + 60; // +1 hour buffer
  }

  // 7. Generate candidate slots across active ranges
  const slots: TimeSlot[] = [];

  for (const range of activeRanges) {
    let currentSlotStart = range.start;

    while (currentSlotStart + durationMinutes <= range.end) {
      const slotEnd = currentSlotStart + durationMinutes;
      const timeStr = `${String(Math.floor(currentSlotStart / 60)).padStart(2, '0')}:${String(currentSlotStart % 60).padStart(2, '0')}:00`;
      const shortTime = timeStr.substring(0, 5);

      let isAvailable = true;
      let reason: string | undefined;

      // Check if slot is in past today
      if (currentMinutesToday > 0 && currentSlotStart < currentMinutesToday) {
        isAvailable = false;
        reason = 'Horario no disponible para agendamiento inmediato';
      }

      // Check collision with blocked exception ranges
      if (isAvailable) {
        for (const blocked of blockedRanges) {
          // Overlap condition: start < blocked.end && end > blocked.start
          if (currentSlotStart < blocked.end && slotEnd > blocked.start) {
            isAvailable = false;
            reason = 'Horario reservado para actividades internas';
            break;
          }
        }
      }

      // Check collision with existing active bookings
      if (isAvailable) {
        for (const booked of bookedRanges) {
          if (currentSlotStart < booked.end && slotEnd > booked.start) {
            isAvailable = false;
            reason = 'Horario ya reservado por otra clienta';
            break;
          }
        }
      }

      slots.push({
        time: shortTime,
        formattedTime: formatTime12h(timeStr),
        available: isAvailable,
        reason,
      });

      currentSlotStart += slotIntervalMinutes;
    }
  }

  return { slots, isClosed: false };
}
