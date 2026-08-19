import React, { useState, useEffect } from 'react';
import {
  Save,
  Building,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Sparkles,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { SiteSettings } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import { dataStore } from '../../lib/dataStore';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateSettings(formData);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Configuración Guardada',
          message: 'Los datos del estudio han sido actualizados en todo el sitio.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: res.error || 'No se pudo guardar la configuración.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncSupabase = async () => {
    try {
      setIsSyncing(true);
      await dataStore.fetchFromSupabase();
      showToast({
        type: 'success',
        title: 'Sincronización Completa',
        message: 'Se han sincronizado las citas, servicios, horarios y reseñas.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error al sincronizar',
        message: err.message || 'No se pudo sincronizar con Supabase.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
          Configuración del Negocio & Supabase
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
          Ajusta la información comercial, WhatsApp de reservas, enlaces de redes y revisa el estado de conexión con Supabase.
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <div className={`p-6 rounded-3xl border shadow-xs ${
        isSupabaseConfigured 
          ? 'bg-emerald-50/70 border-emerald-200' 
          : 'bg-amber-50/80 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isSupabaseConfigured ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#2D2726]">
                  Estado de la Base de Datos Supabase
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSupabaseConfigured
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {isSupabaseConfigured ? '🟢 Conectado en Tiempo Real' : '🟡 Modo Local Reactivo Activo'}
                </span>
              </div>
              <p className="text-xs text-[#7A6D69] mt-1 leading-relaxed">
                {isSupabaseConfigured
                  ? 'La aplicación está conectada con Supabase. Todas las reservas, reseñas, servicios y cambios de horario se guardan y sincronizan en la nube en tiempo real.'
                  : 'La aplicación está funcionando de forma reactiva en almacenamiento local interactivo. Para conectar tu base de datos Supabase en la nube, ingresa tus variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en la configuración del proyecto y ejecuta el archivo supabase/schema.sql en tu consola de Supabase.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncSupabase}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sincronizar Ahora
            </Button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-10 shadow-xs space-y-8"
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2D2726] border-b border-[#F2ECE6] pb-3">
            Identidad & Marca
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre del Negocio *"
              value={formData.business_name || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, business_name: e.target.value }))
              }
              required
            />

            <Input
              label="Nombre de la Profesional *"
              value={formData.professional_name || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  professional_name: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Eslogan / Título Profesional"
              value={formData.tagline || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="Cejista & Maquillista Profesional"
            />

            <Input
              label="Zona Horaria"
              value={formData.timezone || 'America/Bogota'}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, timezone: e.target.value }))
              }
            />
          </div>

          <TextArea
            label="Descripción Corta del Estudio"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            helperText="Aparece en el pie de página y en las descripciones del sitio."
          />

          <TextArea
            label="Historia / 'Sobre Mí' (Biografía)"
            value={formData.about_history || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, about_history: e.target.value }))
            }
            rows={3}
            helperText="Texto que describe tu trayectoria y enfoque en la sección Sobre Nosotros."
          />
        </div>

        {/* Contact & WhatsApp */}
        <div className="space-y-4 pt-4 border-t border-[#F2ECE6]">
          <h3 className="font-serif text-lg font-bold text-[#2D2726] border-b border-[#F2ECE6] pb-3">
            Contacto & WhatsApp de Reservas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Número de WhatsApp (con código de país sin +) *"
              placeholder="573001234567"
              value={formData.whatsapp || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  whatsapp: e.target.value,
                }))
              }
              helperText="A este número se enviarán los enlaces de WhatsApp generados para las clientas."
              icon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="Teléfono Visible al Público"
              placeholder="+57 300 123 4567"
              value={formData.phone || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Correo Electrónico de Contacto"
            type="email"
            placeholder="contacto@anamariasalas.com"
            value={formData.email || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Location & Social */}
        <div className="space-y-4 pt-4 border-t border-[#F2ECE6]">
          <h3 className="font-serif text-lg font-bold text-[#2D2726] border-b border-[#F2ECE6] pb-3">
            Ubicación & Redes Sociales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Dirección del Estudio"
              placeholder="Calle 123 #45-67, Edificio Centro"
              value={formData.address || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              icon={<MapPin className="w-4 h-4" />}
            />

            <Input
              label="Ciudad & Departamento"
              placeholder="Bogotá, Colombia"
              value={formData.city || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Enlace Perfil de Instagram"
              placeholder="https://instagram.com/anamariasalas_studio"
              value={formData.instagram_url || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  instagram_url: e.target.value,
                }))
              }
              icon={<Instagram className="w-4 h-4" />}
            />

            <Input
              label="Enlace Google Maps"
              placeholder="https://maps.google.com/..."
              value={formData.google_maps_url || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, google_maps_url: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Save button */}
        <div className="pt-6 border-t border-[#E8DFC8] flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
};
