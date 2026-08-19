import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const { settings } = useSettings();

  const businessName = settings.business_name || 'Ana María Salas';
  const tagline = settings.tagline || 'Cejista & Maquillista';

  // If custom logo image URL is configured, display image with fallback
  if (settings.logo_url && settings.logo_url.trim().length > 0) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={settings.logo_url}
          alt={businessName}
          referrerPolicy="no-referrer"
          className={`object-contain ${
            size === 'sm' ? 'h-8' : size === 'lg' ? 'h-16' : 'h-12'
          }`}
        />
      </div>
    );
  }

  // Pure SVG/Typography brand logo mirroring the requested aesthetic:
  // Golden monogram / circle crest + Serif Brand Name + Script Descriptor
  const sizeConfig = {
    sm: {
      crest: 'w-7 h-7 text-xs',
      title: 'text-sm tracking-[0.18em]',
      tagline: 'text-xs',
    },
    md: {
      crest: 'w-10 h-10 text-sm',
      title: 'text-lg md:text-xl tracking-[0.2em]',
      tagline: 'text-sm md:text-base',
    },
    lg: {
      crest: 'w-16 h-16 text-xl',
      title: 'text-2xl md:text-3xl tracking-[0.22em]',
      tagline: 'text-lg md:text-xl',
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Golden Geometric Crest */}
      <div
        className={`relative ${currentSize.crest} rounded-full border border-[#C5A880] flex items-center justify-center bg-gradient-to-tr from-[#FAF8F5] via-[#F5EFEB] to-[#EBDBC9] shadow-sm flex-shrink-0`}
      >
        <span className="font-serif font-bold text-[#8C6D40] tracking-tighter">
          {businessName.substring(0, 2).toUpperCase()}
        </span>
        <div className="absolute inset-[2px] rounded-full border border-[#C5A880]/30" />
      </div>

      {/* Typography Block */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-semibold text-[#2D2726] uppercase leading-none ${currentSize.title}`}
        >
          {businessName}
        </span>
        {showTagline && tagline && (
          <span
            className={`font-script text-[#B38F5C] leading-tight mt-0.5 ${currentSize.tagline}`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};
