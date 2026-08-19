import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-[#EFECE8] rounded-md ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #EFECE8 0%, #F8F5F2 50%, #EFECE8 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};
