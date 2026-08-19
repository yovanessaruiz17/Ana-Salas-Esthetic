import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { Button } from '../common/Button';
import { Input, TextArea } from '../common/Input';
import { useReviews } from '../../hooks/useReviews';
import { useServices } from '../../hooks/useServices';
import { useToast } from '../../contexts/ToastContext';
import { Sparkles, Send, User, MessageSquare } from 'lucide-react';

interface ReviewFormProps {
  onSuccess?: () => void;
  initialServiceId?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSuccess,
  initialServiceId,
}) => {
  const { services } = useServices(false);
  const { submitReview } = useReviews();
  const { showToast } = useToast();

  const [rating, setRating] = useState<number>(5);
  const [customerName, setCustomerName] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>(initialServiceId || '');
  const [comment, setComment] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'Por favor escribe tu nombre';
    }
    if (!comment.trim() || comment.trim().length < 10) {
      errs.comment = 'Por favor escribe una opinión de al menos 10 caracteres';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent anti-spam
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const result = await submitReview({
        customer_name: customerName,
        rating,
        comment,
        service_id: serviceId || undefined,
      });

      if (result.success) {
        showToast({
          type: 'success',
          title: '¡Muchas gracias!',
          message: 'Tu testimonio ha sido enviado y pasará a revisión.',
        });
        setCustomerName('');
        setComment('');
        setRating(5);
        if (onSuccess) onSuccess();
      } else {
        showToast({
          type: 'error',
          title: 'Error al enviar',
          message: result.error || 'No fue posible guardar tu testimonio.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error inesperado',
        message: err.message || 'Ocurrió un error al enviar tu reseña.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#2D2726]">
          Comparte tu Experiencia
        </h3>
        <p className="text-xs sm:text-sm text-[#7A6D69] mt-1">
          Tu opinión nos ayuda a mantener los más altos estándares de calidad y atención personalizada.
        </p>
      </div>

      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="review_user_check"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Rating Picker */}
      <div className="flex flex-col items-center justify-center py-3 bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8]">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#8C6D40] mb-2">
          ¿Cómo calificarías tu atención?
        </label>
        <StarRating
          rating={rating}
          maxRating={5}
          interactive={true}
          onChange={(newRating) => setRating(newRating)}
          size="lg"
        />
        <span className="text-xs text-[#7A6D69] mt-2 font-medium">
          {rating === 5 && '🌟 ¡Excelente experiencia!'}
          {rating === 4 && '✨ Muy buen servicio'}
          {rating === 3 && '👍 Buen servicio'}
          {rating === 2 && '😐 Regular'}
          {rating === 1 && '👎 Requiere atención'}
        </span>
      </div>

      <div className="space-y-4">
        <Input
          label="Tu Nombre *"
          placeholder="Ej. Sofía Morales"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          error={errors.customerName}
          icon={<User className="w-4 h-4" />}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E625F] mb-1.5">
            Tratamiento Realizado (Opcional)
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2.5 bg-white border border-[#E2D8CC] rounded-xl text-sm text-[#231F20] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
          >
            <option value="">Selecciona el tratamiento recibido</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name}
              </option>
            ))}
          </select>
        </div>

        <TextArea
          label="Tu Testimonio *"
          placeholder="Cuéntanos qué te pareció el resultado, la atención, la puntualidad..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={errors.comment}
          rows={4}
        />
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        rightIcon={<Send className="w-4 h-4" />}
      >
        Publicar Opinión
      </Button>
    </form>
  );
};
