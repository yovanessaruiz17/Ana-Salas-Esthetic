import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewForm } from '../../components/reviews/ReviewForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NewReviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D40] hover:text-[#231F20] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Reseñas</span>
      </button>

      <ReviewForm onSuccess={() => navigate('/resenas')} />
    </div>
  );
};
