import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServiceGrid } from '../../components/services/ServiceGrid';
import { useServices } from '../../hooks/useServices';
import { Service } from '../../types';
import { Sparkles } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, categories, loading } = useServices(false);
  const { onOpenServiceDetails } = useOutletContext<{
    onOpenServiceDetails: (service: Service) => void;
  }>();

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] text-[#8C6D40] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Menú de Tratamientos</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D2726]">
          Catálogo Exclusivo de Servicios
        </h1>
        <p className="text-sm sm:text-base text-[#6E625F] leading-relaxed">
          Procedimientos diseñados para potenciar tus rasgos con técnicas de vanguardia, bioseguridad rigurosa y productos de alta gama.
        </p>
      </div>

      {/* Grid with category filters and search */}
      <ServiceGrid
        services={services}
        categories={categories}
        loading={loading}
        onOpenDetails={onOpenServiceDetails}
      />
    </div>
  );
};
