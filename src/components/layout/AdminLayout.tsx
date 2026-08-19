import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Skeleton } from '../common/Skeleton';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  // If Supabase is configured and not authenticated & not loading, redirect to login
  if (isSupabaseConfigured && !loading && !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path.startsWith('/admin/agenda')) return 'Agenda & Calendario';
    if (path.startsWith('/admin/citas')) return 'Gestión de Citas';
    if (path.startsWith('/admin/servicios')) return 'Catálogo de Servicios';
    if (path.startsWith('/admin/horarios')) return 'Horarios & Disponibilidad';
    if (path.startsWith('/admin/resenas')) return 'Moderación de Reseñas';
    if (path.startsWith('/admin/configuracion')) return 'Configuración del Negocio';
    if (path.startsWith('/admin/perfil')) return 'Mi Perfil';
    return 'Panel de Administración';
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex">
      {/* Sidebar for Desktop & Mobile Overlay */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-2xl w-full" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};
