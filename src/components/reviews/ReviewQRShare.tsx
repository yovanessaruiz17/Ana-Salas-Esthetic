import React, { useState } from 'react';
import { QrCode, Copy, Check, Download, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';

export const ReviewQRShare: React.FC = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const reviewUrl = `${window.location.origin}/resenas/nueva`;
  // Clean QR generator endpoint without external dependency
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    reviewUrl
  )}&color=2D2726&bgcolor=FFFFFF&margin=2`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      showToast({
        type: 'success',
        title: 'Enlace Copiado',
        message: 'El enlace directo para dejar reseñas ha sido copiado al portapapeles.',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast({
        type: 'error',
        title: 'No se pudo copiar',
        message: 'Copia manualmente el enlace en pantalla.',
      });
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = 'QR-Resenas-Ana-Maria-Salas.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] mb-3">
        <QrCode className="w-6 h-6" />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2726] mb-2">
        Código QR para Reseñas
      </h3>
      <p className="text-xs sm:text-sm text-[#7A6D69] max-w-md mb-6">
        Imprime o muestra este código QR en tu estudio para que tus clientas puedan escanearlo y dejar su testimonio en segundos desde su móvil.
      </p>

      {/* QR Code Container with Luxury Frame */}
      <div className="p-4 bg-white border-2 border-[#C5A880] rounded-2xl shadow-sm mb-6 relative group">
        <img
          src={qrImageUrl}
          alt="QR para dejar reseña"
          className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
        />
        <div className="text-[10px] text-[#A39793] font-mono tracking-widest mt-2 uppercase">
          Ana María Salas Studio
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleCopyLink}
          leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        >
          {copied ? '¡Copiado!' : 'Copiar Enlace'}
        </Button>

        <Button
          variant="gold"
          size="md"
          fullWidth
          onClick={handleDownloadQR}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Descargar QR (PNG)
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-[#F2ECE6] w-full text-center">
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#8C6D40] hover:text-[#231F20] font-medium transition-colors"
        >
          <span>Abrir formulario de reseña en nueva pestaña</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
