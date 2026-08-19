import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Sparkles className="w-8 h-8 text-[#C5A880]" />,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#E2D8CC] rounded-2xl bg-white/40">
      <div className="w-14 h-14 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center mb-4 text-[#8C6D40]">
        {icon}
      </div>
      <h3 className="font-serif text-lg md:text-xl font-bold text-[#38302E] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#7A6D69] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="gold" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
