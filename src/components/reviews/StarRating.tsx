import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            } focus:outline-none`}
            aria-label={`${starValue} estrellas`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-[#D4AF37] text-[#D4AF37]'
                  : 'text-[#D8C7B2] fill-transparent'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
