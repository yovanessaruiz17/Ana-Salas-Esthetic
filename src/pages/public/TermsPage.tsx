import React from 'react';
import { FileText } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2726]">
          Términos y Condiciones del Servicio
        </h1>
        <p className="text-xs text-[#7A6D69]">
          Última actualización: Enero 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#554C4A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            1. Políticas de Agendamiento y Puntualidad
          </h2>
          <p>
            Para garantizar una experiencia óptima y el cumplimiento de los tiempos de cada clienta, agradecemos llegar con 5 a 10 minutos de anticipación a su cita programada. El tiempo de tolerancia máximo es de 15 minutos. Superado este lapso, el servicio podrá ser reprogramado sujeto a disponibilidad.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            2. Cancelaciones y Reprogramaciones
          </h2>
          <p>
            Si requiere cancelar o reprogramar su cita, solicitamos notificar con al menos 24 horas de antelación vía WhatsApp al {settings.whatsapp_number}. Esto permite ceder el espacio a clientas en lista de espera.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            3. Métodos de Pago
          </h2>
          <p>
            El pago total de los servicios se realiza al finalizar la sesión en el estudio, aceptando transferencias bancarias directas y efectivo. Para servicios de maquillaje social o novias en fechas de alta demanda, podrá requerirse un depósito de anticipo para separar la fecha.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            4. Condiciones de Salud y Alergias
          </h2>
          <p>
            Es responsabilidad de la clienta informar previamente sobre alergias a cosméticos, tratamientos dermatológicos recientes (como peeling químico o retinoides) o afecciones cutáneas activas en la zona a tratar.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[#E8DFC8]">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            5. Propiedad Intelectual, Autoría y Derechos Reservados
          </h2>
          <p>
            El diseño web, código fuente, arquitectura técnica, lógica de programación y desarrollo de esta Progressive Web App (PWA) han sido creados y desarrollados por <strong>Yordev (Yorle)</strong>.
          </p>
          <p>
            Todos los derechos de desarrollo y autoría de software están reservados a favor de <strong>Yordev</strong>. Para conocer más sobre los servicios de desarrollo o contactar al creador, visite el portal profesional:{' '}
            <a
              href="https://yordevctg17.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C6D40] hover:text-[#554C4A] underline font-semibold transition-colors"
            >
              https://yordevctg17.netlify.app/
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
