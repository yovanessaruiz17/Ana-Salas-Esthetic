import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  QrCode,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';
import { useToast } from '../../contexts/ToastContext';
import { formatDateSpanish } from '../../utils/formatters';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { StarRating } from '../../components/reviews/StarRating';
import { ReviewQRShare } from '../../components/reviews/ReviewQRShare';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Review } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, approveReview, rejectReview, deleteReview, loading } = useReviews(false);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'moderation' | 'approved' | 'qr'>('moderation');

  const pendingReviews = reviews.filter((r) => !r.is_approved);
  const approvedReviews = reviews.filter((r) => r.is_approved);

  const handleApprove = async (id: string) => {
    const res = await approveReview(id);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Reseña Aprobada',
        message: 'El testimonio ya es visible en la página pública.',
      });
    }
  };

  const handleReject = async (id: string) => {
    const res = await rejectReview(id);
    if (res.success) {
      showToast({
        type: 'info',
        title: 'Reseña Ocultada',
        message: 'El testimonio fue marcado como no aprobado.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Segura que deseas eliminar esta reseña permanentemente?')) return;
    const res = await deleteReview(id);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Reseña Eliminada',
        message: 'El testimonio ha sido eliminado.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
            Gestión de Reseñas & QR
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
            Modera testimonios enviados por tus clientas o genera el código QR para imprimir.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E8DFC8] shadow-xs">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'bg-[#C5A880] text-white shadow-xs'
                : 'text-[#7A6D69] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Por Moderar</span>
            {pendingReviews.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#8C6D40] flex items-center justify-center text-[10px] font-bold">
                {pendingReviews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-[#C5A880] text-white shadow-xs'
                : 'text-[#7A6D69] hover:bg-[#FAF8F5]'
            }`}
          >
            Aprobadas ({approvedReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-[#C5A880] text-white shadow-xs'
                : 'text-[#7A6D69] hover:bg-[#FAF8F5]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Código QR</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'qr' ? (
        <ReviewQRShare />
      ) : activeTab === 'moderation' ? (
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center">
              <EmptyState
                icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                title="¡Todo al día!"
                description="No hay testimonios pendientes de aprobación en este momento."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <StarRating rating={r.rating} size="sm" />
                      <span className="text-xs font-bold text-[#2D2726]">
                        {r.customer_name}
                      </span>
                      {r.service && (
                        <span className="text-[11px] bg-[#FAF4ED] text-[#8C6D40] px-2 py-0.5 rounded-full border border-[#EBDBC9]">
                          {r.service.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#554C4A] italic">
                      "{r.comment}"
                    </p>
                    <span className="text-[11px] text-[#A39793] block">
                      Enviada el {formatDateSpanish(r.created_at.split('T')[0])}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handleApprove(r.id)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Aprobar
                    </Button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-[#A39793] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar testimonio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Approved Reviews */
        <div className="space-y-4">
          {approvedReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center">
              <EmptyState
                icon={<MessageSquare className="w-8 h-8 text-[#C5A880]" />}
                title="Aún no hay reseñas aprobadas"
                description="Aprueba los testimonios enviados para que aparezcan en tu web."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <StarRating rating={r.rating} size="sm" />
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Visible en Web
                      </span>
                    </div>
                    <p className="text-sm text-[#554C4A] italic">
                      "{r.comment}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F2ECE6] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#2D2726]">
                        {r.customer_name}
                      </h4>
                      {r.service && (
                        <span className="text-[11px] text-[#8C6D40]">
                          {r.service.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleReject(r.id)}
                        className="p-1.5 text-xs text-[#7A6D69] hover:text-[#2D2726] rounded hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Ocultar de la web"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-xs text-[#A39793] hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
