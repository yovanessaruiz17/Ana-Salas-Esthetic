import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import {
  generateWhatsAppLink,
  buildGeneralInquiryWhatsAppMessage,
  getWhatsAppNumber,
} from '../../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useSettings();

  const rawWhatsApp = getWhatsAppNumber(settings);
  if (!rawWhatsApp) return null;

  const whatsappMessage = buildGeneralInquiryWhatsAppMessage(settings);
  const whatsappUrl = generateWhatsAppLink(rawWhatsApp, whatsappMessage);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center bg-[#25D366] hover:bg-[#20BA59] text-white rounded-full shadow-md hover:shadow-xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 p-2.5 sm:p-3 hover:px-4 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current text-white flex-shrink-0" />
        
        {/* Expanded label ONLY on hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 font-medium text-xs tracking-wide transition-all duration-300 ease-out">
          ¿Dudas? Escríbenos
        </span>
      </a>
    </div>
  );
};
