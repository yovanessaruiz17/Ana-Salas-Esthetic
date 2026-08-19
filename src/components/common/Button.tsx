import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] cursor-pointer active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase rounded-md',
    md: 'px-6 py-2.5 text-sm tracking-wide rounded-lg',
    lg: 'px-8 py-3.5 text-base tracking-wide rounded-lg font-semibold shadow-sm',
  };

  const variantStyles = {
    gold: 'bg-[#C5A880] hover:bg-[#B38F5C] text-[#FAF8F5] focus:ring-[#C5A880] shadow-[0_4px_14px_0_rgba(197,168,128,0.39)] border border-[#B38F5C]/30',
    outline:
      'bg-transparent border border-[#C5A880] text-[#8C6D40] hover:bg-[#F5EFEB] hover:text-[#5A4526] focus:ring-[#C5A880]',
    ghost:
      'bg-transparent text-[#6E625F] hover:bg-[#F2ECE6] hover:text-[#231F20] focus:ring-[#C5A880]',
    danger:
      'bg-[#D9534F] hover:bg-[#C9302C] text-white focus:ring-[#D9534F] shadow-sm',
    secondary:
      'bg-[#EFE9E1] hover:bg-[#E2D8CC] text-[#38302E] focus:ring-[#C5A880]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2 inline-flex">{leftIcon}</span>
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
      {!isLoading && rightIcon ? (
        <span className="ml-2 inline-flex">{rightIcon}</span>
      ) : null}
    </button>
  );
};
