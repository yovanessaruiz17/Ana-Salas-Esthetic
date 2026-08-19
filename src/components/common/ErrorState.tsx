import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ha ocurrido un inconveniente',
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-rose-200 rounded-2xl bg-rose-50/40">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg font-bold text-[#38302E] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[#7A6D69] max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Intentar nuevamente
        </Button>
      )}
    </div>
  );
};
