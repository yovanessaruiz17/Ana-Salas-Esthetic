import { useState, useEffect, useCallback } from 'react';
import { SpecialClosedDate } from '../types';
import { dataStore, DayScheduleConfig } from '../lib/dataStore';
import { getDayOfWeekFromDateString } from '../utils/dates';

export type { DayScheduleConfig };

export function useBusinessHours() {
  const [businessHours, setBusinessHours] = useState<DayScheduleConfig[]>(() =>
    dataStore.getBusinessHours()
  );
  const [specialClosedDates, setSpecialClosedDates] = useState<SpecialClosedDate[]>(() =>
    dataStore.getSpecialClosedDates()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromStore = useCallback(() => {
    setBusinessHours(dataStore.getBusinessHours());
    setSpecialClosedDates(dataStore.getSpecialClosedDates());
  }, []);

  useEffect(() => {
    syncFromStore();
    const unsubscribe = dataStore.subscribe(() => {
      syncFromStore();
    });
    return unsubscribe;
  }, [syncFromStore]);

  const saveBusinessHours = async (hoursList: DayScheduleConfig[]) => {
    try {
      return await dataStore.saveBusinessHours(hoursList);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addSpecialClosedDate = async (closedDate: string, reason?: string) => {
    try {
      return await dataStore.addSpecialClosedDate(closedDate, reason);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const removeSpecialClosedDate = async (id: string) => {
    try {
      return await dataStore.removeSpecialClosedDate(id);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const isDateClosed = (dateStr: string): { closed: boolean; reason?: string } => {
    const special = specialClosedDates.find((s) => s.closed_date === dateStr);
    if (special) {
      return { closed: true, reason: special.reason || 'Fecha bloqueada' };
    }
    const dayOfWeek = getDayOfWeekFromDateString(dateStr);
    const daySetting = businessHours.find((h) => h.day_of_week === dayOfWeek);
    if (daySetting && daySetting.is_closed) {
      return { closed: true, reason: 'Día no laboral habitual' };
    }
    return { closed: false };
  };

  const refreshHours = async () => {
    setLoading(true);
    await dataStore.fetchFromSupabase();
    syncFromStore();
    setLoading(false);
  };

  return {
    businessHours,
    specialClosedDates,
    loading,
    error,
    refreshHours,
    saveBusinessHours,
    addSpecialClosedDate,
    removeSpecialClosedDate,
    isDateClosed,
  };
}

