import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SiteSettings } from '../types';
import { dataStore } from '../lib/dataStore';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => dataStore.getSettings());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncSettings = useCallback(() => {
    setSettings(dataStore.getSettings());
  }, []);

  useEffect(() => {
    syncSettings();
    const unsubscribe = dataStore.subscribe(() => {
      syncSettings();
    });
    return unsubscribe;
  }, [syncSettings]);

  // Update dynamic document title & meta tags when settings change
  useEffect(() => {
    if (settings.meta_title) {
      document.title = settings.meta_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.meta_description) {
      metaDesc.setAttribute('content', settings.meta_description);
    }
  }, [settings]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await dataStore.updateSettings(newSettings);
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al guardar la configuración' };
    }
  };

  const refreshSettings = async () => {
    setLoading(true);
    await dataStore.fetchFromSupabase();
    syncSettings();
    setLoading(false);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

