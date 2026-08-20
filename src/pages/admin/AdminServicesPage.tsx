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
  FolderPlus,
  Layers,
  Tag,
  Save,
} from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Service, ServiceCategory } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Input, TextArea } from '../../components/common/Input';

export const AdminServicesPage: React.FC = () => {
  const { 
    services, 
    categories, 
    toggleServiceActive, 
    deleteService, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    toggleCategoryActive, 
    loading 
  } = useServices(true);
  
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  // Service deletion state
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeletingService, setIsDeletingService] = useState(false);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 1,
    active: true,
  });
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const handleToggleService = async (id: string, active: boolean) => {
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

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setIsDeletingService(true);
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
      setIsDeletingService(false);
    }
  };

  // Category handlers
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      display_order: categories.length + 1,
      active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      display_order: cat.display_order || 1,
      active: cat.active,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast({
        type: 'warning',
        title: 'Campo requerido',
        message: 'Ingresa un nombre para la categoría.',
      });
      return;
    }

    try {
      setIsSubmittingCategory(true);
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, categoryFormData);
        if (res.success) {
          showToast({
            type: 'success',
            title: 'Categoría Actualizada',
            message: 'La categoría fue actualizada correctamente.',
          });
          setIsCategoryModalOpen(false);
        } else {
          showToast({
            type: 'error',
            title: 'Error',
            message: res.error || 'No se pudo actualizar la categoría.',
          });
        }
      } else {
        const res = await createCategory(categoryFormData);
        if (res.success) {
          showToast({
            type: 'success',
            title: 'Categoría Creada',
            message: 'La nueva categoría ha sido añadida.',
          });
          setIsCategoryModalOpen(false);
        } else {
          showToast({
            type: 'error',
            title: 'Error',
            message: res.error || 'No se pudo crear la categoría.',
          });
        }
      }
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleToggleCategory = async (id: string, active: boolean) => {
    const res = await toggleCategoryActive(id, active);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Categoría Actualizada',
        message: `La categoría ahora está ${active ? 'activa' : 'desactivada'}.`,
      });
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeletingCategory(true);
      const res = await deleteCategory(categoryToDelete.id);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Categoría Eliminada',
          message: 'La categoría fue eliminada con éxito.',
        });
        setCategoryToDelete(null);
      } else {
        showToast({
          type: 'error',
          title: 'No se puede eliminar',
          message: res.error || 'No se pudo eliminar la categoría.',
        });
      }
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
            Catálogo & Categorías
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
            Crea, edita y organiza tus categorías y tratamientos visibles en la web.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'services' ? (
            <Link to="/admin/servicios/nuevo">
              <Button
                variant="gold"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Nuevo Servicio
              </Button>
            </Link>
          ) : (
            <Button
              variant="gold"
              size="md"
              leftIcon={<FolderPlus className="w-4 h-4" />}
              onClick={openNewCategoryModal}
            >
              Nueva Categoría
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E8DFC8] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#FAF4ED] text-[#8C6D40] border border-[#EBDBC9]'
              : 'text-[#7A6D69] hover:text-[#2D2726] hover:bg-[#FAF8F5]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tratamientos / Servicios ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#FAF4ED] text-[#8C6D40] border border-[#EBDBC9]'
              : 'text-[#7A6D69] hover:text-[#2D2726] hover:bg-[#FAF8F5]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categorías ({categories.length})</span>
        </button>
      </div>

      {/* Tab Content: Services */}
      {activeTab === 'services' && (
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
                          onClick={() => handleToggleService(svc.id, !svc.is_active)}
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
      )}

      {/* Tab Content: Categories */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs">
          {categories.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={<Layers className="w-8 h-8 text-[#C5A880]" />}
                title="No hay categorías registradas"
                description="Crea categorías para organizar tus servicios (ej. Diseño de Cejas, Pestañas, Maquillaje, Micropigmentación)."
                actionLabel="Crear Categoría"
                onAction={openNewCategoryModal}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#7A6D69] uppercase font-bold tracking-wider border-b border-[#E8DFC8]">
                  <tr>
                    <th className="py-4 px-6">Orden</th>
                    <th className="py-4 px-6">Categoría</th>
                    <th className="py-4 px-6">Servicios Asociados</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE6]">
                  {categories.map((cat) => {
                    const count = services.filter((s) => s.category_id === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-[#FAF4ED]/40 transition-colors">
                        <td className="py-4 px-6 font-mono text-[#8C6D40] font-bold">
                          #{cat.display_order || 1}
                        </td>

                        <td className="py-4 px-6">
                          <div>
                            <div className="font-bold text-sm text-[#2D2726] flex items-center gap-2">
                              <Tag className="w-4 h-4 text-[#C5A880]" />
                              <span>{cat.name}</span>
                            </div>
                            {cat.description && (
                              <p className="text-[#8C7E7A] text-[11px] mt-0.5 max-w-md">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF4ED] text-[#8C6D40] border border-[#EBDBC9]">
                            {count} {count === 1 ? 'servicio' : 'servicios'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleToggleCategory(cat.id, !cat.active)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              cat.active
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-stone-100 text-stone-600 border border-stone-300'
                            }`}
                          >
                            {cat.active ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Activa</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Inactiva</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-2 text-[#7A6D69] hover:text-[#2D2726] hover:bg-[#FAF4ED] rounded-lg transition-colors cursor-pointer"
                              title="Editar categoría"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="p-2 text-[#A39793] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Category Create / Edit Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría de Servicios'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Nombre de la Categoría *"
            placeholder="Ej. Micropigmentación & Cejas"
            value={categoryFormData.name}
            onChange={(e) =>
              setCategoryFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <TextArea
            label="Descripción (Opcional)"
            placeholder="Breve descripción de los tratamientos agrupados bajo esta categoría..."
            value={categoryFormData.description}
            onChange={(e) =>
              setCategoryFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Orden de Visualización"
              type="number"
              min="1"
              value={categoryFormData.display_order}
              onChange={(e) =>
                setCategoryFormData((prev) => ({
                  ...prev,
                  display_order: parseInt(e.target.value, 10) || 1,
                }))
              }
            />

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#2D2726]">
                <input
                  type="checkbox"
                  checked={categoryFormData.active}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880]"
                />
                <span>Categoría Activa</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              isLoading={isSubmittingCategory}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Service Confirmation Modal */}
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
              onClick={confirmDeleteService}
              isLoading={isDeletingService}
            >
              Sí, Eliminar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="¿Eliminar categoría?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#6E625F] leading-relaxed">
            ¿Deseas eliminar la categoría <strong>{categoryToDelete?.name}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDeleteCategory}
              isLoading={isDeletingCategory}
            >
              Eliminar Categoría
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
