import React from 'react';
import { Menu, User, Bell, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title,
  subtitle,
}) => {
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFC8] px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#38302E] hover:bg-[#F2ECE6] lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2726]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#7A6D69] hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isSupabaseConfigured && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            Modo Demo (Supabase no conectado)
          </span>
        )}

        <div className="flex items-center gap-3 pl-2 border-l border-[#E2D8CC]">
          <div className="w-9 h-9 rounded-full bg-[#EBDBC9] border border-[#C5A880] flex items-center justify-center text-[#8C6D40] font-bold text-sm">
            {profile?.full_name?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-[#2D2726] leading-tight">
              {profile?.full_name || 'Administradora'}
            </p>
            <p className="text-[11px] text-[#8C7E7A] leading-tight truncate max-w-[140px]">
              {user?.email || 'admin@anamariasalas.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
