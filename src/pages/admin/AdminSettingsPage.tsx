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
  Download,
  Smartphone,
  Monitor,
  Zap,
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { usePWA } from '../../contexts/PWAContext';
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
  const { isInstalled, openInstallModal, installApp, deferredPrompt, isIOS, isDesktop, isAndroid } = usePWA();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Supabase Runtime Config State
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialCreds.anonKey);
  const [credsSource, setCredsSource] = useState({
    isFromEnv: initialCreds.isFromEnv,
    isFromLocalStorage: initialCreds.isFromLocalStorage,
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
  }>({
    tested: false,
    connected: isSupabaseConfigured,
    message: isSupabaseConfigured 
      ? initialCreds.isFromEnv
        ? '🟢 Conexión Global activa (Vía Variables de Entorno Netlify). Todos los clientes y dispositivos están sincronizados.'
        : '🟡 Conectado en este navegador. Para que clientas desde otros celulares sincronicen reseñas y citas, configura las variables en Netlify.'
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
      const updatedCreds = getSupabaseCredentials();

      setCredsSource({
        isFromEnv: updatedCreds.isFromEnv,
        isFromLocalStorage: updatedCreds.isFromLocalStorage,
      });

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
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D40] hover:underline"
              >
                <span>Obtener credenciales en Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Ver Script SQL & Realtime</span>
              </button>
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

        {/* Netlify / Multi-device Sync Instructions Banner */}
        <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-amber-300 text-xs text-[#5C4F4B] space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>¿Por qué las citas de otros dispositivos no se veían en tu panel?</span>
          </div>
          <p className="leading-relaxed">
            Cuando abres la web desde <strong>otro celular o computador</strong> (como el de tus clientes), ese dispositivo no tiene el almacenamiento local de este navegador. Para que <strong>todos los dispositivos se conecten automáticamente a Supabase</strong>, debes configurar estas dos variables en Netlify:
          </p>
          <div className="bg-[#2D2726] text-amber-200 p-3 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
            <div><span className="text-gray-400"># En Netlify: Site configuration &gt; Environment variables &gt; Add a variable</span></div>
            <div className="text-emerald-400">VITE_SUPABASE_URL = <span className="text-white">{supabaseUrl || 'https://tu-proyecto.supabase.co'}</span></div>
            <div className="text-emerald-400">VITE_SUPABASE_ANON_KEY = <span className="text-white">{supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : 'tu-anon-key'}</span></div>
          </div>
          <p className="text-[11px] text-gray-500">
            💡 <strong>Paso 2:</strong> Asegúrate de haber ejecutado el script en Supabase SQL Editor para habilitar la <strong>replicación Realtime</strong> (así las citas nuevas aparecen en vivo sin recargar).
          </p>
        </div>
      </div>

      {/* SQL Script Modal */}
      <Modal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        title="Script SQL para Supabase (Tablas y Realtime)"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#6E625F]">
            Copia este script y ejecútalo en <strong>Supabase Dashboard &gt; SQL Editor &gt; New query &gt; Run</strong> para habilitar las tablas y la sincronización en tiempo real entre todos los dispositivos:
          </p>

          <div className="relative">
            <pre className="bg-[#1E1B1A] text-amber-100 p-4 rounded-xl text-xs font-mono max-h-80 overflow-y-auto whitespace-pre-wrap select-all">
{`-- 1. Habilitar Realtime para sincronización en vivo entre todos los dispositivos
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.service_categories;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.business_hours;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_exceptions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 2. Permisos y Políticas de Reseñas (Permite a clientas anónimas enviar testimonios a moderación)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reviews insert" ON public.reviews;
DROP POLICY IF EXISTS "Public reviews select" ON public.reviews;
DROP POLICY IF EXISTS "Manage reviews" ON public.reviews;

CREATE POLICY "Public reviews select" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public reviews insert" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Manage reviews" ON public.reviews FOR ALL TO anon, authenticated USING (true);

-- 3. Grants de permisos para clientes públicos
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;`}
            </pre>
            <button
              onClick={handleCopySql}
              className="absolute top-3 right-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSql ? '¡Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsSqlModalOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* PWA & Mobile / PC App Card */}
      <div className="bg-gradient-to-br from-[#2D2726] to-[#1E1B1A] text-[#FAF8F5] rounded-3xl border border-[#3D3534] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-[#C5A880] text-[#231F20]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#FAF8F5]">
                  Aplicación Web Progresiva (PWA Móvil & PC)
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isInstalled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isInstalled ? '🟢 Instalada en este dispositivo' : '⚡ Lista para Descargar'}
                </span>
              </div>
              <p className="text-xs text-[#D8C7B2] mt-1 leading-relaxed max-w-2xl">
                Permite a tus clientas y a ti instalar esta plataforma como app directa en Android, iPhone, iPad, Windows y Mac con 1 solo clic, acceso offline y velocidad ultra-rápida.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="gold"
              size="md"
              onClick={() => {
                if (deferredPrompt) {
                  installApp();
                } else {
                  openInstallModal();
                }
              }}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {isInstalled ? 'Ver Guía de Instalación' : 'Instalar App en este Dispositivo'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#D8C7B2]">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-[#EBDBC9] font-bold text-sm">
              <Smartphone className="w-4 h-4 text-[#C5A880]" />
              <span>Android & iOS</span>
            </div>
            <p className="text-[11px] text-[#A39793]">
              Acceso con icono nativo en pantalla de inicio sin ocupar memoria ni depender de tiendas de apps.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-[#EBDBC9] font-bold text-sm">
              <Monitor className="w-4 h-4 text-[#C5A880]" />
              <span>PC & Mac (Escritorio)</span>
            </div>
            <p className="text-[11px] text-[#A39793]">
              Ventana independiente con barra de tareas para gestionar citas y reservas como software de escritorio.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-2 text-[#EBDBC9] font-bold text-sm">
              <Zap className="w-4 h-4 text-[#C5A880]" />
              <span>Service Worker & Cache</span>
            </div>
            <p className="text-[11px] text-[#A39793]">
              Caché inteligente de recursos estáticos, manifest.json oficial y sincronización en tiempo real.
            </p>
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

      {/* Developer & Software Author Information Card */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#FAF4ED] text-[#8C6D40] border border-[#E8DFC8]">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-[#2D2726] text-base">
                Desarrollado y Diseñado por Yordev (Yorle)
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF4ED] text-[#8C6D40] border border-[#EBDBC9]">
                Autoría Oficial
              </span>
            </div>
            <p className="text-xs text-[#7A6D69] mt-0.5">
              Todos los derechos de autor, diseño y desarrollo de software reservados a favor de <strong>Yordev</strong>.
            </p>
          </div>
        </div>

        <a
          href="https://yordevctg17.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#8C6D40] bg-[#FAF4ED] hover:bg-[#F2ECE6] border border-[#E8DFC8] transition-colors"
        >
          <span>Visitar Yordev</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
