import React from 'react';
import { StarRating } from './StarRating';
import { Review } from '../../types';
import { formatDateSpanish } from '../../utils/formatters';
import { Quote } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={review.rating} size="sm" />
          {review.appointment_date && (
            <span className="text-[11px] text-[#A39793]">
              {formatDateSpanish(review.appointment_date)}
            </span>
          )}
        </div>

        <div className="relative mb-4">
          <Quote className="w-6 h-6 text-[#EBDBC9] absolute -top-2 -left-2 -z-0 opacity-60" />
          <p className="text-sm text-[#554C4A] leading-relaxed relative z-10 italic">
            "{review.comment}"
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#F2ECE6] flex items-center justify-between">
        <div>
          <h4 className="font-serif font-bold text-sm text-[#2D2726]">
            {review.customer_name}
          </h4>
          {review.service && (
            <span className="text-[11px] text-[#8C6D40] font-medium block">
              {review.service.name}
            </span>
          )}
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-xs font-bold text-[#8C6D40]">
          {review.customer_name.substring(0, 1).toUpperCase()}
        </div>
      </div>
    </div>
  );
};
