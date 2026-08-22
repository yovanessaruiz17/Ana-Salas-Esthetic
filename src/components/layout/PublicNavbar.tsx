import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Sparkles, MessageCircle, Star, Phone, Download, Smartphone } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { usePWA } from '../../contexts/PWAContext';

export const PublicNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { isInstalled, openInstallModal, installApp, deferredPrompt } = usePWA();

  const handleInstall = () => {
    if (deferredPrompt) {
      installApp();
    } else {
      openInstallModal();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Reseñas', path: '/resenas' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8DFC8]'
          : 'bg-[#FAF8F5] border-b border-[#EFECE8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group py-2">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-150 relative py-2 ${
                  isActive(link.path)
                    ? 'text-[#8C6D40] font-semibold'
                    : 'text-[#554C4A] hover:text-[#231F20]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A880] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {!isInstalled && (
              <button
                id="navbar-install-app-btn"
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wider uppercase text-[#8C6D40] bg-[#FAF3EB] hover:bg-[#F2ECE6] border border-[#E8DFC8] rounded-xl transition-all hover:scale-105 cursor-pointer shadow-xs"
                title="Descargar e instalar app en tu PC o móvil"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar App</span>
              </button>
            )}

            <Link to="/reservar">
              <Button
                variant="gold"
                size="md"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Reservar Cita
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-[#38302E] hover:bg-[#F0EBE4] focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              aria-label="Abrir menú de navegación"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E8DFC8] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-[#F2ECE6] text-[#8C6D40]'
                    : 'text-[#554C4A] hover:bg-[#F7F3EE]'
                }`}
              >
                <span>{link.name}</span>
                {isActive(link.path) && (
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#EFECE8] flex flex-col gap-2">
            {!isInstalled && (
              <button
                id="mobile-menu-install-app-btn"
                onClick={() => {
                  setIsOpen(false);
                  handleInstall();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-[#8C6D40] bg-[#FAF3EB] hover:bg-[#F2ECE6] border border-[#E8DFC8] transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar App en tu Celular / PC</span>
              </button>
            )}

            <Link to="/reservar" className="w-full">
              <Button
                variant="gold"
                size="lg"
                className="w-full"
                leftIcon={<Calendar className="w-5 h-5" />}
              >
                Reservar Cita Ahora
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
