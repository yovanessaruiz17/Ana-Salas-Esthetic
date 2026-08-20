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
  Key,
  Globe,
  UploadCloud,
  Code2,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { SiteSettings } from '../../types';
import { 
  getSupabaseCredentials, 
  configureSupabaseRuntime, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { dataStore } from '../../lib/dataStore';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Supabase Runtime Config State
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialCreds.anonKey);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
  }>({
    tested: false,
    connected: isSupabaseConfigured,
    message: isSupabaseConfigured 
      ? 'Conectado a la base de datos Supabase.' 
      : 'Modo local activo. Ingresa tus credenciales para sincronizar en la nube.',
  });

  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
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

  const handleSaveAndTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      showToast({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor ingresa la URL y la Anon Key de Supabase.',
      });
      return;
    }

    try {
      setIsTestingConnection(true);
      configureSupabaseRuntime(supabaseUrl, supabaseAnonKey);
      const test = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);

      setConnectionStatus({
        tested: true,
        connected: test.success,
        message: test.message,
      });

      if (test.success) {
        showToast({
          type: 'success',
          title: 'Conexión Exitosa',
          message: test.message,
        });
        await dataStore.fetchFromSupabase();
      } else {
        showToast({
          type: 'error',
          title: 'Fallo de Conexión',
          message: test.message,
        });
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncSupabase = async () => {
    try {
      setIsSyncing(true);
      await dataStore.fetchFromSupabase();
      showToast({
        type: 'success',
        title: 'Sincronización Completa',
        message: 'Se han sincronizado las citas, servicios, categorías, horarios y reseñas desde Supabase.',
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

  const handleExportLocalToSupabase = async () => {
    try {
      setIsExporting(true);
      const res = await dataStore.syncAllLocalDataToSupabase();
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Exportación Exitosa',
          message: res.message,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error de Exportación',
          message: res.message,
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySql = () => {
    const sqlText = `-- Ejecuta este script en Supabase -> SQL Editor -> New query -> Run
-- Visita el archivo supabase/schema.sql en el proyecto para el script completo`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
    showToast({
      type: 'success',
      title: 'Copiado',
      message: 'Instrucciones copiadas al portapapeles.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
          Configuración del Negocio & Base de Datos
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
          Gestiona las credenciales de Supabase en la nube, sincronización multi-dispositivo y los datos de contacto del estudio.
        </p>
      </div>

      {/* Supabase Connection Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 ${
        connectionStatus.connected 
          ? 'bg-emerald-50/60 border-emerald-200' 
          : 'bg-amber-50/70 border-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-5">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-2xl ${
              connectionStatus.connected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#2D2726]">
                  Conexión con Supabase (Nube)
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  connectionStatus.connected
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {connectionStatus.connected ? '🟢 Conectado a la Base de Datos' : '🟡 Modo Local Reactivo'}
                </span>
              </div>
              <p className="text-xs text-[#6E625F] mt-1 leading-relaxed max-w-2xl">
                {connectionStatus.message}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncSupabase}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sincronizar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportLocalToSupabase}
              isLoading={isExporting}
              leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
              title="Sube los servicios y categorías locales a tu base de datos Supabase"
            >
              Exportar a Supabase
            </Button>
          </div>
        </div>

        {/* Credentials Inputs */}
        <div className="space-y-4 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E625F] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#C5A880]" />
            Credenciales de Proyecto Supabase
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Supabase URL (Project URL)"
              placeholder="https://tu-proyecto.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              icon={<Globe className="w-4 h-4" />}
            />

            <Input
              label="Supabase Anon Key (Public Key)"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              icon={<Key className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D40] hover:underline"
              >
                <span>Obtener credenciales en Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={handleSaveAndTestSupabase}
              isLoading={isTestingConnection}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Guardar y Probar Conexión
            </Button>
          </div>
        </div>
      </div>

      {/* Business Identity Form */}
      <form
        onSubmit={handleSaveBusinessSettings}
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
              helperText="Número para recibir confirmaciones de citas y dudas de clientas."
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
