import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceCategory, ServiceFormData } from '../types';
import { dataStore } from '../lib/dataStore';

export function useServices(includeInactive = false) {
  const [services, setServices] = useState<Service[]>(() =>
    dataStore.getServices(includeInactive)
  );
  const [categories, setCategories] = useState<ServiceCategory[]>(() =>
    dataStore.getCategories(includeInactive)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncFromStore = useCallback(() => {
    setServices(dataStore.getServices(includeInactive));
    setCategories(dataStore.getCategories(includeInactive));
  }, [includeInactive]);

  useEffect(() => {
    syncFromStore();
    const unsubscribe = dataStore.subscribe(() => {
      syncFromStore();
    });
    return unsubscribe;
  }, [syncFromStore]);

  const toggleServiceActive = async (id: string, active: boolean) => {
    try {
      return await dataStore.toggleServiceActive(id, active);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createService = async (serviceData: Partial<Service> | ServiceFormData) => {
    try {
      return await dataStore.createService(serviceData);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateService = async (id: string, updates: Partial<Service> | ServiceFormData) => {
    try {
      return await dataStore.updateService(id, updates);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteService = async (id: string) => {
    try {
      return await dataStore.deleteService(id);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const refreshServices = async () => {
    setLoading(true);
    await dataStore.fetchFromSupabase();
    syncFromStore();
    setLoading(false);
  };

  return {
    services,
    categories,
    loading,
    error,
    refreshServices,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
  };
}

