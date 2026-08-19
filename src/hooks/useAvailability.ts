import { useState, useEffect } from 'react';
import { TimeSlot } from '../types';
import { useBusinessHours } from './useBusinessHours';
import { calculateAvailableSlots } from '../utils/availability';
import { dataStore } from '../lib/dataStore';

export function useAvailability(dateStr: string, durationMinutes: number) {
  const { businessHours, specialClosedDates, loading: hoursLoading } = useBusinessHours();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [closedReason, setClosedReason] = useState<string | undefined>();
  const [bookingsVersion, setBookingsVersion] = useState(0);

  // Subscribe to dataStore changes so any new booking immediately recalculates available slots
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      setBookingsVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!dateStr || durationMinutes <= 0 || hoursLoading) {
      setSlots([]);
      setIsClosed(false);
      setClosedReason(undefined);
      return;
    }

    // Map business hours to the format expected by calculateAvailableSlots
    const formattedHours: any[] = [];
    businessHours.forEach((bh) => {
      if (!bh.is_closed) {
        if (bh.lunch_start && bh.lunch_end) {
          // Slot 1: open to lunch_start
          formattedHours.push({
            id: `${bh.day_of_week}-am`,
            day_of_week: bh.day_of_week,
            start_time: bh.open_time.includes(':00') ? bh.open_time : `${bh.open_time}:00`,
            end_time: bh.lunch_start.includes(':00') ? bh.lunch_start : `${bh.lunch_start}:00`,
            active: true,
          });
          // Slot 2: lunch_end to close
          formattedHours.push({
            id: `${bh.day_of_week}-pm`,
            day_of_week: bh.day_of_week,
            start_time: bh.lunch_end.includes(':00') ? bh.lunch_end : `${bh.lunch_end}:00`,
            end_time: bh.close_time.includes(':00') ? bh.close_time : `${bh.close_time}:00`,
            active: true,
          });
        } else {
          formattedHours.push({
            id: `${bh.day_of_week}-all`,
            day_of_week: bh.day_of_week,
            start_time: bh.open_time.includes(':00') ? bh.open_time : `${bh.open_time}:00`,
            end_time: bh.close_time.includes(':00') ? bh.close_time : `${bh.close_time}:00`,
            active: true,
          });
        }
      }
    });

    const exceptions: any[] = specialClosedDates.map((sc) => ({
      id: sc.id,
      date: sc.closed_date,
      type: 'closed',
      start_time: null,
      end_time: null,
      reason: sc.reason || 'Fecha bloqueada por vacaciones o festivo',
    }));

    // Fetch existing bookings for this exact date from dataStore
    const dayBookings = dataStore.getBookings(dateStr);

    const result = calculateAvailableSlots({
      dateStr,
      durationMinutes,
      businessHours: formattedHours,
      exceptions,
      existingBookings: dayBookings,
    });

    setSlots(result.slots);
    setIsClosed(result.isClosed);
    setClosedReason(result.reason);
  }, [dateStr, durationMinutes, businessHours, specialClosedDates, hoursLoading, bookingsVersion]);

  return {
    slots,
    isClosed,
    closedReason,
    loading: hoursLoading,
    refreshAvailability: () => setBookingsVersion((v) => v + 1),
  };
}

