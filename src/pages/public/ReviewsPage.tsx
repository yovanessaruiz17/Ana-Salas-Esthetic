import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReviews } from '../../hooks/useReviews';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { StarRating } from '../../components/reviews/StarRating';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Sparkles, MessageSquare, Star, Plus } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, averageRating, totalReviews, ratingCounts, loading } = useReviews(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Experiencias & Testimonios</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2726]">
          Opiniones de Nuestras Clientas
        </h1>
        <p className="text-sm sm:text-base text-[#6E625F] leading-relaxed">
          La satisfacción y confianza de cada persona que pasa por nuestras manos es nuestra mayor recompensa.
        </p>
      </div>

      {/* Ratings Summary Card */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Average Rating Score */}
          <div className="md:col-span-4 text-center md:border-r md:border-[#E8DFC8] md:pr-8">
            <div className="font-serif text-5xl sm:text-6xl font-extrabold text-[#2D2726] mb-2">
              {averageRating > 0 ? averageRating : '5.0'}
            </div>
            <div className="flex justify-center mb-2">
              <StarRating rating={Math.round(averageRating) || 5} size="md" />
            </div>
            <p className="text-xs text-[#8C7E7A] font-medium">
              Basado en {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas verificadas'}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="md:col-span-5 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                  className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${
                    filterRating === stars ? 'bg-[#FAF4ED]' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="w-12 text-left font-medium text-[#7A6D69] flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-[#F2ECE6] overflow-hidden">
                    <div
                      className="h-full bg-[#C5A880] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-[#A39793] font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="md:col-span-3 text-center md:pl-4">
            <h4 className="font-serif text-sm font-bold text-[#2D2726] mb-1">
              ¿Fuiste atendida recientemente?
            </h4>
            <p className="text-xs text-[#7A6D69] mb-4">
              Comparte tus impresiones y ayuda a otras clientas.
            </p>
            <Link to="/resenas/nueva">
              <Button
                variant="gold"
                size="sm"
                fullWidth
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Escribir Reseña
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter notice if applied */}
      {filterRating && (
        <div className="flex items-center justify-between max-w-4xl mx-auto px-2">
          <span className="text-xs text-[#6E625F]">
            Filtrando por opiniones de <strong>{filterRating} estrellas</strong>
          </span>
          <button
            onClick={() => setFilterRating(null)}
            className="text-xs font-semibold text-[#8C6D40] hover:underline cursor-pointer"
          >
            Quitar filtro (Ver todas)
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8DFC8] space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-8 h-8 text-[#C5A880]" />}
          title="Aún no hay reseñas en esta categoría"
          description="Sé la primera en compartir tu experiencia en nuestro estudio."
          actionLabel="Escribir Reseña"
          onAction={() => window.location.assign('/resenas/nueva')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};
