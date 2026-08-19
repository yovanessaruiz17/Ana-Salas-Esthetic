import { useState, useEffect, useCallback } from 'react';
import { Booking, BookingFormData, BookingStatus } from '../types';
import { dataStore } from '../lib/dataStore';

export function useBookings(filterDate?: string, filterStatus?: BookingStatus | 'all') {
  const [bookings, setBookings] = useState<Booking[]>(() =>
    dataStore.getBookings(filterDate, filterStatus)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromStore = useCallback(() => {
    setBookings(dataStore.getBookings(filterDate, filterStatus));
  }, [filterDate, filterStatus]);

  useEffect(() => {
    syncFromStore();
    const unsubscribe = dataStore.subscribe(() => {
      syncFromStore();
    });
    return unsubscribe;
  }, [syncFromStore]);

  const createBooking = async (
    formData: BookingFormData,
    durationMinutes: number
  ): Promise<{ success: boolean; bookingId?: string; error?: string }> => {
    try {
      return await dataStore.createBooking(formData, durationMinutes);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    whatsappConfirmed?: boolean
  ) => {
    try {
      return await dataStore.updateBookingStatus(bookingId, newStatus, whatsappConfirmed);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      return await dataStore.deleteBooking(bookingId);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const refreshBookings = async () => {
    setLoading(true);
    await dataStore.fetchFromSupabase();
    syncFromStore();
    setLoading(false);
  };

  return {
    bookings,
    loading,
    error,
    refreshBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking,
  };
}

