import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, TextArea } from '../../components/common/Input';
import { ServiceFormData } from '../../types';

export const AdminServiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { services, categories, createService, updateService, loading } = useServices(true);
  const { showToast } = useToast();

  const isEditing = Boolean(id);
  const existingService = isEditing ? services.find((s) => s.id === id) : null;

  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    short_description: '',
    description: '',
    duration_minutes: 60,
    price: 50000,
    price_type: 'fixed',
    category_id: '',
    image_url: '',
    preparation_notes: '',
    aftercare_notes: '',
    featured: false,
    is_active: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingService) {
      setFormData({
        name: existingService.name || '',
        short_description: existingService.short_description || '',
        description: existingService.description || '',
        duration_minutes: existingService.duration_minutes || 60,
        price: existingService.price || 0,
        price_type: existingService.price_type || 'fixed',
        category_id: existingService.category_id || '',
        image_url: existingService.image_url || '',
        preparation_notes: existingService.preparation_notes || '',
        aftercare_notes: existingService.aftercare_notes || '',
        featured: existingService.featured || false,
        is_active: existingService.is_active ?? true,
      });
    } else if (categories.length > 0 && !formData.category_id) {
      setFormData((prev) => ({ ...prev, category_id: categories[0].id }));
    }
  }, [existingService, categories]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'El nombre del servicio es obligatorio';
    if (!formData.duration_minutes || formData.duration_minutes < 10) {
      errs.duration_minutes = 'La duración mínima es de 10 minutos';
    }
    if (formData.price < 0) errs.price = 'El precio debe ser un número positivo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (isEditing && id) {
        const res = await updateService(id, formData);
        if (res.success) {
          showToast({
            type: 'success',
            title: 'Servicio Actualizado',
            message: 'Los cambios fueron guardados exitosamente.',
          });
          navigate('/admin/servicios');
        } else {
          showToast({
            type: 'error',
            title: 'Error',
            message: res.error || 'No se pudo guardar el servicio.',
          });
        }
      } else {
        const res = await createService(formData);
        if (res.success) {
          showToast({
            type: 'success',
            title: 'Servicio Creado',
            message: 'El nuevo tratamiento ya está disponible.',
          });
          navigate('/admin/servicios');
        } else {
          showToast({
            type: 'error',
            title: 'Error',
            message: res.error || 'No se pudo crear el servicio.',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header with Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/servicios"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D40] hover:text-[#2D2726] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mt-1">
            Define los datos, tiempos y recomendaciones del tratamiento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <Input
              label="Nombre del Tratamiento *"
              placeholder="Ej. Diseño & Depilación con Hilo"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={errors.name}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E625F] mb-1.5">
                Categoría *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                }
                className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-[#E2D8CC] rounded-xl text-sm text-[#231F20] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Descripción Corta"
              placeholder="Resumen atractivo en una o dos oraciones para la tarjeta..."
              value={formData.short_description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, short_description: e.target.value }))
              }
              helperText="Aparece en el catálogo principal."
            />

            <TextArea
              label="Descripción Completa"
              placeholder="Detalla en profundidad el paso a paso, beneficios y técnicas empleadas..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
            />
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F2ECE6]">
            <div>
              <Input
                label="Duración (Minutos) *"
                type="number"
                step="5"
                min="10"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration_minutes: parseInt(e.target.value, 10) || 60,
                  }))
                }
                error={errors.duration_minutes}
                required
              />
            </div>

            <div>
              <Input
                label="Precio (COP / Moneda Local) *"
                type="number"
                step="1000"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                error={errors.price}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E625F] mb-1.5">
                Tipo de Tarifa
              </label>
              <select
                value={formData.price_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price_type: e.target.value as 'fixed' | 'from',
                  }))
                }
                className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-[#E2D8CC] rounded-xl text-sm text-[#231F20] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
              >
                <option value="fixed">Precio Fijo (Ej. $50.000)</option>
                <option value="from">Desde (Ej. Desde $120.000)</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="pt-4 border-t border-[#F2ECE6]">
            <Input
              label="URL de Imagen del Servicio"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image_url: e.target.value }))
              }
              helperText="Pega el enlace de una foto de alta calidad (Unsplash, Cloudinary, etc.)"
              icon={<ImageIcon className="w-4 h-4" />}
            />
          </div>

          {/* Preparation & Aftercare */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F2ECE6]">
            <TextArea
              label="Recomendaciones Previas (Preparación)"
              placeholder="Ej. No depilar las cejas 15 días antes..."
              value={formData.preparation_notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preparation_notes: e.target.value,
                }))
              }
              rows={3}
            />

            <TextArea
              label="Cuidados Posteriores (Aftercare)"
              placeholder="Ej. Evitar agua y vapor durante las primeras 24 horas..."
              value={formData.aftercare_notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aftercare_notes: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          {/* Flags: Featured & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F2ECE6]">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880]"
              />
              <div>
                <span className="text-xs font-bold text-[#2D2726] block">
                  Tratamiento Destacado
                </span>
                <span className="text-[11px] text-[#7A6D69]">
                  Aparece prioritariamente en el Hero y sección de servicios destacados.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl border border-[#E8DFC8] bg-[#FAF8F5] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880]"
              />
              <div>
                <span className="text-xs font-bold text-[#2D2726] block">
                  Servicio Activo
                </span>
                <span className="text-[11px] text-[#7A6D69]">
                  Permite a las clientas seleccionarlo en el sistema de agendamiento.
                </span>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-[#E8DFC8] flex items-center justify-end gap-3">
            <Link to="/admin/servicios">
              <Button variant="secondary" size="md">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
