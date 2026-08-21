import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail, Clock, Lock, Sparkles } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useSettings } from '../../contexts/SettingsContext';

export const PublicFooter: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#231F20] text-[#EFECE8] pt-16 pb-12 border-t border-[#38302E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#38302E]">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl inline-block shadow-xs">
              <BrandLogo size="sm" />
            </div>
            <p className="text-sm text-[#A39793] leading-relaxed max-w-sm">
              {settings.description ||
                'Estudio boutique especializado en realzar tu belleza natural con técnicas de alta precisión en cejas, pestañas y maquillaje.'}
            </p>
            {settings.instagram_url && (
              <div className="pt-2">
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#38302E] text-[#D8C7B2] hover:text-[#FAF8F5] hover:bg-[#4A403E] transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <Instagram className="w-4 h-4 text-[#C5A880]" />
                  <span>Síguenos en Instagram</span>
                </a>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#FAF8F5] mb-4 tracking-wide">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-[#A39793] hover:text-[#D8C7B2] transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="text-[#A39793] hover:text-[#D8C7B2] transition-colors"
                >
                  Catálogo de Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/reservar"
                  className="text-[#A39793] hover:text-[#D8C7B2] transition-colors font-medium text-[#C5A880]"
                >
                  Agendar Cita
                </Link>
              </li>
              <li>
                <Link
                  to="/resenas"
                  className="text-[#A39793] hover:text-[#D8C7B2] transition-colors"
                >
                  Opiniones de Clientes
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-[#A39793] hover:text-[#D8C7B2] transition-colors"
                >
                  Ubicación & Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#FAF8F5] mb-4 tracking-wide">
              Contacto & Ubicación
            </h4>
            <ul className="space-y-3 text-sm text-[#A39793]">
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
                  <span>
                    {settings.address}
                    {settings.city && `, ${settings.city}`}
                  </span>
                </li>
              )}
              {(settings.phone || settings.whatsapp) && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                  <span>{settings.phone || settings.whatsapp}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                  <span>{settings.email}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>Atención previa reserva</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Experience & Care */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#FAF8F5] mb-4 tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              Garantía de Calidad
            </h4>
            <p className="text-xs text-[#A39793] leading-relaxed mb-4">
              Cada tratamiento es realizado con estrictos protocolos de bioseguridad, insumos desechables y productos de alta cosmética internacional.
            </p>
            <Link
              to="/resenas"
              className="inline-flex items-center text-xs font-semibold text-[#C5A880] hover:text-[#E2D3BE] transition-colors"
            >
              ¿Ya tuviste tu cita? Déjanos tu reseña →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6D69] gap-4">
          <div>
            © {currentYear} {settings.business_name || 'Ana María Salas'}. Todos los derechos reservados.
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/politica-privacidad"
              className="hover:text-[#A39793] transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/terminos"
              className="hover:text-[#A39793] transition-colors"
            >
              Términos de Servicio
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-[#C5A880] transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Administradora</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
