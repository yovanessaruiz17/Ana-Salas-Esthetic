import React from 'react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import { usePWA } from '../../contexts/PWAContext';
import { Button } from './Button';

export const PWAInstallModal: React.FC = () => {
  const {
    isInstallModalOpen,
    closeInstallModal,
    deferredPrompt,
    installApp,
    isIOS,
    isAndroid,
    isDesktop,
    isInstalled,
  } = usePWA();

  if (!isInstallModalOpen) return null;

  return (
    <div
      id="pwa-install-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeInstallModal();
      }}
    >
      <div
        id="pwa-install-modal-container"
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#E8DFC8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#2D2726] via-[#3D3534] to-[#2D2726] p-6 text-white text-center relative">
          <button
            id="pwa-close-modal-button"
            onClick={closeInstallModal}
            className="absolute top-4 right-4 p-2 text-[#E8DFC8] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Cerrar ventana de instalación"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#EBDBC9] via-[#C5A880] to-[#8C6D40] p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#231F20] rounded-[14px] flex items-center justify-center">
              <span className="font-serif font-bold text-xl tracking-wider text-[#EBDBC9]">AMS</span>
            </div>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#FAF8F5]">
            Instalar Aplicación Oficial
          </h3>
          <p className="text-xs sm:text-sm text-[#EBDBC9]/90 mt-1 max-w-sm mx-auto">
            Lleva el estudio de Ana María Salas en tu teléfono o computadora para reservar y gestionar citas al instante.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status if already installed */}
          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-emerald-900 text-sm">¡Ya tienes la aplicación instalada!</h4>
              <p className="text-xs text-emerald-700">
                Puedes abrirla directamente desde tu pantalla de inicio o escritorio.
              </p>
            </div>
          ) : (
            <>
              {/* If Native Prompt is available (1-click direct install) */}
              {deferredPrompt && (
                <div className="bg-[#F2ECE6] border border-[#E8DFC8] rounded-2xl p-5 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-[#8C6D40] font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Instalación Directa Disponible</span>
                  </div>
                  <p className="text-xs text-[#554C4A]">
                    Haz clic a continuación para añadir el icono oficial de la app a tu dispositivo.
                  </p>
                  <Button
                    id="pwa-native-install-button"
                    variant="gold"
                    size="lg"
                    className="w-full shadow-md"
                    onClick={installApp}
                    leftIcon={<Download className="w-5 h-5" />}
                  >
                    Instalar Ahora en 1 Clic
                  </Button>
                </div>
              )}

              {/* iOS Safari Guide */}
              {isIOS && (
                <div className="space-y-4 bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F2ECE6]">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#8C6D40]">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2D2726]">Instalación en iPhone / iPad (Safari)</h4>
                      <p className="text-[11px] text-[#7A6D69]">Sigue estos 3 sencillos pasos:</p>
                    </div>
                  </div>

                  <ol className="space-y-3 text-xs text-[#554C4A]">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </span>
                      <div className="pt-0.5">
                        <span>Toca el botón </span>
                        <strong className="text-[#2D2726] inline-flex items-center gap-1 font-semibold bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8DFC8]">
                          <Share className="w-3.5 h-3.5 text-[#8C6D40]" /> Compartir
                        </strong>
                        <span> en la barra inferior de Safari.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </span>
                      <div className="pt-0.5">
                        <span>Desplázate hacia abajo y selecciona </span>
                        <strong className="text-[#2D2726] inline-flex items-center gap-1 font-semibold bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8DFC8]">
                          <PlusSquare className="w-3.5 h-3.5 text-[#8C6D40]" /> Agregar a inicio
                        </strong>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#C5A880] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </span>
                      <div className="pt-0.5">
                        <span>Toca </span>
                        <strong className="text-[#2D2726] font-semibold">"Agregar"</strong>
                        <span> en la esquina superior derecha. ¡Listo!</span>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Desktop PC Guide */}
              {isDesktop && !deferredPrompt && (
                <div className="space-y-4 bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F2ECE6]">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#8C6D40]">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2D2726]">Instalación en Computadora (PC / Mac)</h4>
                      <p className="text-[11px] text-[#7A6D69]">Chrome, Microsoft Edge, Brave o Safari:</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#554C4A]">
                    <p>
                      1. Busca el ícono de <strong className="text-[#2D2726]">Instalar aplicación</strong> (
                      <span className="inline-block px-1.5 py-0.5 bg-[#FAF8F5] border border-[#E8DFC8] rounded text-[10px] font-mono">
                        ⊕ o icono de pantalla
                      </span>
                      ) en el extremo derecho de la barra de direcciones de tu navegador.
                    </p>
                    <p>
                      2. Haz clic en <strong className="text-[#2D2726]">"Instalar"</strong> para crear el acceso directo en tu escritorio y barra de tareas.
                    </p>
                  </div>
                </div>
              )}

              {/* Android Guide without prompt */}
              {isAndroid && !deferredPrompt && (
                <div className="space-y-4 bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[#F2ECE6]">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#8C6D40]">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2D2726]">Instalación en Android (Chrome)</h4>
                      <p className="text-[11px] text-[#7A6D69]">Desde el menú del navegador:</p>
                    </div>
                  </div>

                  <ol className="space-y-2 text-xs text-[#554C4A]">
                    <li>1. Toca el menú de <strong>3 puntos (⋮)</strong> en la esquina superior derecha.</li>
                    <li>2. Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</li>
                    <li>3. Confirma la instalación.</li>
                  </ol>
                </div>
              )}
            </>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white rounded-xl p-3 border border-[#EFECE8] flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[#2D2726]">Ultra Rápida</h5>
                <p className="text-[11px] text-[#7A6D69]">Carga al instante, incluso con conexión lenta.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#EFECE8] flex items-start gap-2.5">
              <CalendarCheck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[#2D2726]">1 Clic a tus Citas</h5>
                <p className="text-[11px] text-[#7A6D69]">Acceso directo sin necesidad de escribir la web.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#EFECE8] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[#2D2726]">Ligera & Segura</h5>
                <p className="text-[11px] text-[#7A6D69]">No consume memoria de tu almacenamiento.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#EFECE8] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-[#2D2726]">Pantalla Completa</h5>
                <p className="text-[11px] text-[#7A6D69]">Experiencia de app nativa sin barras de navegador.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8DFC8] flex items-center justify-between">
          <span className="text-[11px] text-[#A39793]">PWA Oficial • Ana María Salas</span>
          <Button variant="outline" size="sm" onClick={closeInstallModal}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
