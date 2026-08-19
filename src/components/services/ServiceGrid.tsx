import React, { useState, useMemo } from 'react';
import { Service, ServiceCategory } from '../../types';
import { ServiceCard } from './ServiceCard';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { Sparkles, Search } from 'lucide-react';

interface ServiceGridProps {
  services: Service[];
  categories: ServiceCategory[];
  loading?: boolean;
  onOpenDetails?: (service: Service) => void;
  showCategoryFilters?: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  categories,
  loading = false,
  onOpenDetails,
  showCategoryFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === 'all' || service.category_id === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.short_description &&
          service.short_description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-[#E8DFC8] p-4 space-y-4"
          >
            <Skeleton className="h-48 rounded-xl w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      {showCategoryFilters && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C5A880] text-white shadow-xs'
                  : 'bg-white text-[#7A6D69] hover:bg-[#F2ECE6] border border-[#E2D8CC]'
              }`}
            >
              Todos ({services.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A880] text-white shadow-xs'
                    : 'bg-white text-[#7A6D69] hover:bg-[#F2ECE6] border border-[#E2D8CC]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8C7E7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E2D8CC] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C5A880] text-[#231F20] placeholder-[#A39793]"
            />
          </div>
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-8 h-8 text-[#C5A880]" />}
          title="No se encontraron servicios"
          description="Intenta cambiar los filtros de categoría o el término de búsqueda."
          actionLabel="Ver todos los servicios"
          onAction={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};
