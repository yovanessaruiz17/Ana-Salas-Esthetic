import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read env variables or runtime stored keys
const getInitialUrl = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ams_supabase_url');
    if (local && local.startsWith('http')) return local;
  }
  return import.meta.env.VITE_SUPABASE_URL || '';
};

const getInitialKey = () => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('ams_supabase_anon_key');
    if (local && local.length > 10) return local;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

let currentUrl = getInitialUrl();
let currentKey = getInitialKey();

export function checkIsSupabaseConfigured(url: string = currentUrl, key: string = currentKey): boolean {
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    key.length > 20
  );
}

export let isSupabaseConfigured = checkIsSupabaseConfigured();

function createSupabaseInstance(url: string, key: string): SupabaseClient {
  const finalUrl = url && url.startsWith('http') ? url : 'https://placeholder.supabase.co';
  const finalKey = key || 'placeholder-anon-key';

  return createClient(finalUrl, finalKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

export let supabase: SupabaseClient = createSupabaseInstance(currentUrl, currentKey);

export function getSupabaseCredentials() {
  return {
    url: currentUrl,
    anonKey: currentKey,
    isConfigured: isSupabaseConfigured,
  };
}

export function configureSupabaseRuntime(url: string, key: string) {
  currentUrl = url.trim();
  currentKey = key.trim();
  isSupabaseConfigured = checkIsSupabaseConfigured(currentUrl, currentKey);

  if (typeof window !== 'undefined') {
    if (currentUrl) {
      localStorage.setItem('ams_supabase_url', currentUrl);
    } else {
      localStorage.removeItem('ams_supabase_url');
    }

    if (currentKey) {
      localStorage.setItem('ams_supabase_anon_key', currentKey);
    } else {
      localStorage.removeItem('ams_supabase_anon_key');
    }
  }

  supabase = createSupabaseInstance(currentUrl, currentKey);
  return isSupabaseConfigured;
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = (url && key) 
      ? createSupabaseInstance(url, key)
      : supabase;

    // Test a lightweight select query from site_settings or service_categories
    const { data, error } = await testClient
      .from('site_settings')
      .select('id')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it will return code 42P01
      if (error.message.includes('relation "public.site_settings" does not exist') || error.code === '42P01') {
        return {
          success: true,
          message: 'Conexión a Supabase exitosa, pero las tablas aún no han sido creadas. Ejecuta el archivo schema.sql en el SQL Editor de Supabase.',
        };
      }
      return {
        success: false,
        message: `Error de Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      message: '¡Conexión a Supabase establecida y verificada correctamente!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'No se pudo contactar el servidor de Supabase. Revisa la URL y la Anon Key.',
    };
  }
}
