import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
} from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Service } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminServicesPage: React.FC = () => {
  const { services, categories, toggleServiceActive, deleteService, loading } = useServices(true);
  const { showToast } = useToast();

  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async (id: string, active: boolean) => {
    const res = await toggleServiceActive(id, active);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Servicio Actualizado',
        message: `El servicio ahora está ${active ? 'activo' : 'desactivado'}.`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo actualizar.',
      });
    }
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteService(serviceToDelete.id);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Servicio Eliminado',
          message: 'El tratamiento fue removido del catálogo.',
        });
        setServiceToDelete(null);
      } else {
        showToast({
          type: 'error',
          title: 'Error al eliminar',
          message: res.error || 'No se pudo eliminar el servicio.',
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
            Catálogo de Servicios
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
            Crea, edita, activa o desactiva los tratamientos visibles en tu sitio público.
          </p>
        </div>

        <Link to="/admin/servicios/nuevo">
          <Button
            variant="gold"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Servicio
          </Button>
        </Link>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl w-full" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<Sparkles className="w-8 h-8 text-[#C5A880]" />}
              title="No hay servicios registrados"
              description="Comienza creando los tratamientos que ofreces a tus clientas."
              actionLabel="Crear Primer Servicio"
              onAction={() => window.location.assign('/admin/servicios/nuevo')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#7A6D69] uppercase font-bold tracking-wider border-b border-[#E8DFC8]">
                <tr>
                  <th className="py-4 px-6">Tratamiento</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Duración</th>
                  <th className="py-4 px-6">Inversión</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE6]">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#FAF4ED]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {svc.image_url ? (
                          <img
                            src={svc.image_url}
                            alt={svc.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E8DFC8]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-[#2D2726] flex items-center gap-1.5">
                            <span>{svc.name}</span>
                            {svc.featured && (
                              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" title="Destacado" />
                            )}
                          </div>
                          <p className="text-[#8C7E7A] text-[11px] line-clamp-1 max-w-xs">
                            {svc.short_description || svc.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF4ED] text-[#8C6D40] border border-[#EBDBC9]">
                        {svc.category?.name || 'General'}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-medium text-[#2D2726]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        {formatDuration(svc.duration_minutes)}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold font-serif text-[#2D2726] text-sm">
                      {formatCurrency(svc.price, svc.price_type)}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggle(svc.id, !svc.is_active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          svc.is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border border-stone-300'
                        }`}
                      >
                        {svc.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/servicios/editar/${svc.id}`}
                          className="p-2 text-[#7A6D69] hover:text-[#2D2726] hover:bg-[#FAF4ED] rounded-lg transition-colors"
                          title="Editar servicio"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setServiceToDelete(svc)}
                          className="p-2 text-[#A39793] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar servicio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        title="¿Eliminar este servicio?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#6E625F] leading-relaxed">
            ¿Estás segura de eliminar <strong>{serviceToDelete?.name}</strong>? Las citas previas asociadas se conservarán pero el servicio no volverá a aparecer en la web.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setServiceToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Sí, Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
