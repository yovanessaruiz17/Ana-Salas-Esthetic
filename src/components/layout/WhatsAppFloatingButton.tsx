import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { generateWhatsAppLink, buildGeneralInquiryWhatsAppMessage } from '../../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useSettings();

  if (!settings.whatsapp) return null;

  const whatsappMessage = buildGeneralInquiryWhatsAppMessage(settings);
  const whatsappUrl = generateWhatsAppLink(settings.whatsapp, whatsappMessage);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20BA59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current text-white flex-shrink-0" />
      <span className="hidden sm:inline font-medium text-sm tracking-wide">
        ¿Dudas? Escríbenos
      </span>
    </a>
  );
};
