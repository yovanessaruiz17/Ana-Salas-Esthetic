import React from 'react';
import { BookingStatus, ReviewStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'gray' | 'green' | 'red' | 'blue' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-wide',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-wide',
  };

  const variantStyles = {
    gold: 'bg-[#F5EFEB] text-[#8C6D40] border border-[#E2D3BE]',
    gray: 'bg-[#EFECE9] text-[#554C4A] border border-[#DDD5CC]',
    green: 'bg-[#EBF7EE] text-[#1E7E34] border border-[#C3E6CB]',
    red: 'bg-[#FDEDEC] text-[#C0392B] border border-[#F5C6CB]',
    blue: 'bg-[#EBF5FB] text-[#2471A3] border border-[#BEE5EB]',
    purple: 'bg-[#F4ECF7] text-[#7D3C98] border border-[#D7BDE2]',
    amber: 'bg-[#FEF9E7] text-[#B7950B] border border-[#F9E79F]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: BookingStatus | ReviewStatus }> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="amber">Pendiente</Badge>;
    case 'confirmed':
    case 'approved':
      return <Badge variant="green">Confirmada</Badge>;
    case 'completed':
      return <Badge variant="blue">Completada</Badge>;
    case 'cancelled':
    case 'rejected':
      return <Badge variant="red">Cancelada</Badge>;
    case 'no_show':
      return <Badge variant="gray">No Asistió</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
};
