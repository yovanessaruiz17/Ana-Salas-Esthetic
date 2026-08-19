import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#6E625F] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7E7A]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[44px] px-4 py-2.5 text-sm bg-white border ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
              : 'border-[#E2D8CC] focus:ring-[#C5A880] focus:border-[#C5A880]'
          } rounded-lg text-[#231F20] placeholder-[#A39793] transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#8C7E7A]">{helperText}</p>
      ) : null}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#6E625F] mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-4 py-2.5 text-sm bg-white border ${
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-[#E2D8CC] focus:ring-[#C5A880] focus:border-[#C5A880]'
        } rounded-lg text-[#231F20] placeholder-[#A39793] transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#8C7E7A]">{helperText}</p>
      ) : null}
    </div>
  );
};
