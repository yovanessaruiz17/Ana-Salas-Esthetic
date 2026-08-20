import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Send,
  Sparkles,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { formatPhoneDisplay } from '../../utils/formatters';
import { generateWhatsAppLink, buildGeneralInquiryWhatsAppMessage } from '../../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayPhone = settings.whatsapp || settings.phone || '573001234567';
  const rawWhatsApp = (settings.whatsapp || settings.phone || '573001234567').replace(/\D/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;

    if (!form.name.trim() || !form.message.trim()) {
      showToast({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor ingresa tu nombre y mensaje.',
      });
      return;
    }

    setIsSubmitting(true);
    const msg = `Hola ${settings.professional_name || 'Ana María'}, mi nombre es ${form.name.trim()}. ${form.message.trim()}`;
    const waUrl = generateWhatsAppLink(rawWhatsApp, msg);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast({
        type: 'success',
        title: 'Mensaje Preparado',
        message: 'Abriendo WhatsApp para comunicarte con Ana María Salas...',
      });
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setForm({ name: '', phone: '', email: '', message: '', honeypot: '' });
    }, 300);
  };

  const generalWhatsAppUrl = generateWhatsAppLink(
    rawWhatsApp,
    buildGeneralInquiryWhatsAppMessage(settings)
  );

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atención Personalizada</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2726]">
          Contacto & Ubicación
        </h1>
        <p className="text-sm sm:text-base text-[#6E625F] leading-relaxed">
          Estamos aquí para asesorarte sobre cualquiera de nuestros servicios, resolver tus dudas o agendar citas especiales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#2D2726] border-b border-[#F2ECE6] pb-4">
            Información del Estudio
          </h2>

          <div className="space-y-5">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39793]">
                  Dirección
                </h3>
                <p className="text-sm font-medium text-[#2D2726] mt-0.5">
                  {settings.address || 'Atención exclusiva en estudio privado'}
                </p>
                <p className="text-xs text-[#7A6D69]">
                  {settings.city ? `${settings.city}${settings.country ? `, ${settings.country}` : ''}` : 'Cita previa requerida'}
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39793]">
                  WhatsApp de Reservas
                </h3>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-sm font-bold text-[#2D2726] font-mono">
                    {formatPhoneDisplay(displayPhone)}
                  </p>
                  <a
                    href={generalWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#25D366] hover:underline"
                  >
                    <span>Chatear</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39793]">
                  Correo Electrónico
                </h3>
                <p className="text-sm font-medium text-[#2D2726] mt-0.5">
                  {settings.email || 'contacto@anamariasalas.com'}
                </p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39793]">
                  Horario de Atención
                </h3>
                <p className="text-sm font-medium text-[#2D2726] mt-0.5">
                  Lunes a Sábado: 8:00 AM – 6:00 PM
                </p>
                <p className="text-xs text-[#7A6D69]">
                  Domingos: Citas especiales
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-[#F2ECE6] flex items-center justify-between">
            <span className="text-xs text-[#7A6D69] font-medium">Síguenos en redes:</span>
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6D40] hover:text-[#2D2726] transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>

        {/* Direct Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#2D2726] mb-2">
            Envíanos un Mensaje
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mb-6">
            Escríbenos directamente y te responderemos a la mayor brevedad posible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="contact_honeypot_field"
              value={form.honeypot}
              onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre y Apellido *"
                placeholder="Ej. Laura Restrepo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                label="WhatsApp / Teléfono"
                placeholder="Ej. 300 123 4567"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <Input
              label="Correo Electrónico (Opcional)"
              placeholder="nombre@ejemplo.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextArea
              label="Mensaje o Consulta *"
              placeholder="Cuéntanos en qué servicio estás interesada o la fecha aproximada de tu evento..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              required
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Enviar Mensaje vía WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
