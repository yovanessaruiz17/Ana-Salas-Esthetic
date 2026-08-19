import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: any = {
  id: 'demo-admin-id',
  email: 'admin@anamariasalas.com',
  user_metadata: { full_name: 'Ana María Salas' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const DEMO_PROFILE: Profile = {
  id: 'demo-admin-id',
  email: 'admin@anamariasalas.com',
  full_name: 'Ana María Salas',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Fallback default admin profile
        setProfile({
          id: userId,
          email: user?.email || 'admin@anamariasalas.com',
          full_name: user?.user_metadata?.full_name || 'Ana María Salas',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if previously logged into demo mode in localStorage
      const savedDemo = localStorage.getItem('ams_demo_auth');
      if (savedDemo === 'true') {
        setUser(DEMO_USER as User);
        setProfile(DEMO_PROFILE);
      }
      setLoading(false);
      return;
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      // Allow demo login
      if (email.trim() && password.trim()) {
        setUser(DEMO_USER as User);
        setProfile(DEMO_PROFILE);
        localStorage.setItem('ams_demo_auth', 'true');
        return { success: true };
      }
      return { success: false, error: 'Por favor ingresa un correo y contraseña.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error signing out:', err);
      }
    } else {
      localStorage.removeItem('ams_demo_auth');
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al actualizar contraseña' };
    }
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(user && (!profile || profile.role === 'admin'));

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isAuthenticated,
        loading,
        login,
        signIn: login,
        logout,
        signOut: logout,
        updatePassword,
        refreshProfile: async () => {
          if (user) await fetchProfile(user.id);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
