import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { usePWA } from '../../contexts/PWAContext';
import { Button } from './Button';

const PWA_DISMISS_KEY = 'ams_pwa_install_dismissed_until';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, openInstallModal, installApp, deferredPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInstalled) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed recently
    try {
      const dismissedUntil = localStorage.getItem(PWA_DISMISS_KEY);
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsVisible(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    // Show after a subtle delay (1.5 seconds) for pleasant entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      // Dismiss for 7 days
      const sevenDays = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(PWA_DISMISS_KEY, sevenDays.toString());
    } catch (e) {
      // ignore
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      installApp();
    } else {
      openInstallModal();
    }
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div
      id="pwa-floating-install-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-[#231F20] text-white p-4 rounded-2xl border border-[#C5A880]/40 shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md">
        {/* Subtle background glow */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#C5A880]/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EBDBC9] to-[#C5A880] p-0.5 shrink-0 shadow-md">
            <div className="w-full h-full bg-[#231F20] rounded-[10px] flex items-center justify-center text-[#EBDBC9] font-serif font-bold text-xs">
              AMS
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[#EBDBC9] text-[11px] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-[#C5A880]" />
              <span>Instalar App Oficial</span>
            </div>
            <p className="text-xs text-[#FAF8F5]/90 truncate">
              Descarga la app en tu celular o PC para reservar más fácil.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            id="pwa-banner-install-action"
            variant="gold"
            size="sm"
            onClick={handleInstallClick}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs px-3 py-1.5 shadow-sm whitespace-nowrap"
          >
            Instalar
          </Button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar aviso de instalación"
            title="Ahora no"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
