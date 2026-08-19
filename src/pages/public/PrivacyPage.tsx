import React from 'react';
import { Shield } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const PrivacyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2726]">
          Política de Privacidad y Tratamiento de Datos
        </h1>
        <p className="text-xs text-[#7A6D69]">
          Última actualización: Enero 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-10 shadow-xs space-y-6 text-sm text-[#554C4A] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            1. Responsable del Tratamiento
          </h2>
          <p>
            {settings.professional_name || 'Ana María Salas'}, con domicilio en {settings.city || 'Colombia'}, es la responsable del tratamiento de los datos personales suministrados voluntariamente por los usuarios de esta plataforma web.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            2. Datos Recolectados y Finalidad
          </h2>
          <p>
            Los datos personales solicitados en nuestro formulario de agendamiento y contacto (nombre, teléfono/WhatsApp, correo electrónico y notas) son tratados exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestionar, confirmar y recordar las reservas de citas solicitadas.</li>
            <li>Brindar atención al cliente personalizada y dar respuesta a consultas.</li>
            <li>Conocer necesidades especiales para la adecuada prestación de los servicios de belleza y estética facial.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            3. Confidencialidad y Seguridad
          </h2>
          <p>
            No vendemos, cedemos ni transferimos sus datos personales a terceros bajo ninguna circunstancia sin su consentimiento previo. Aplicamos medidas técnicas y organizativas para proteger su información contra accesos no autorizados.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#2D2726]">
            4. Derechos del Titular (Habeas Data)
          </h2>
          <p>
            Usted tiene derecho a conocer, actualizar, rectificar o solicitar la supresión de sus datos personales en cualquier momento escribiendo a nuestro correo oficial{' '}
            <a href={`mailto:${settings.contact_email}`} className="text-[#8C6D40] underline font-medium">
              {settings.contact_email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
