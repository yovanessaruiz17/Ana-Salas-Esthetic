import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Clock,
  BookOpenCheck,
  Star,
  Settings,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../contexts/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Servicios', path: '/admin/servicios', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Agenda / Calendario', path: '/admin/agenda', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Lista de Reservas', path: '/admin/reservas', icon: <BookOpenCheck className="w-5 h-5" /> },
    { name: 'Horarios & Bloqueos', path: '/admin/horarios', icon: <Clock className="w-5 h-5" /> },
    { name: 'Reseñas & QR', path: '/admin/resenas', icon: <Star className="w-5 h-5" /> },
    { name: 'Configuración Web', path: '/admin/configuracion', icon: <Settings className="w-5 h-5" /> },
    { name: 'Perfil Admin', path: '/admin/perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#231F20]/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#2D2726] text-[#FAF8F5] flex flex-col border-r border-[#3D3534] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-[#3D3534] bg-[#231F20]">
          <div className="bg-[#FAF8F5] p-2.5 rounded-lg shadow-xs">
            <BrandLogo size="sm" showTagline={false} />
          </div>
          <span className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#C5A880]/20 text-[#D8C7B2] border border-[#C5A880]/30">
            Panel de Control
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C5A880] text-[#FAF8F5] shadow-sm font-semibold'
                    : 'text-[#C7BCB9] hover:bg-[#3D3534] hover:text-[#FAF8F5]'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#3D3534] bg-[#231F20] space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#A39793] hover:text-[#FAF8F5] hover:bg-[#3D3534] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#C5A880]" />
              Ver Sitio Público
            </span>
          </a>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
