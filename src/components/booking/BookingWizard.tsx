import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Service, BookingFormData } from '../../types';
import { useServices } from '../../hooks/useServices';
import { useBookings } from '../../hooks/useBookings';
import { useAvailability } from '../../hooks/useAvailability';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { formatCurrency, formatDuration, formatDateSpanish, formatTime12h } from '../../utils/formatters';
import { getTodayDateString } from '../../utils/dates';
import { Button } from '../common/Button';
import { Input, TextArea } from '../common/Input';
import { TimeSlotPicker } from './TimeSlotPicker';
import { Skeleton } from '../common/Skeleton';

interface BookingWizardProps {
  initialServiceId?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ initialServiceId }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const { services, categories, loading: servicesLoading } = useServices(false);
  const { createBooking } = useBookings();

  // Wizard Steps: 1: Service, 2: Date & Time, 3: Customer Details, 4: Recap
  const [currentStep, setCurrentStep] = useState<number>(initialServiceId ? 2 : 1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || '');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Customer details form state
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    notes: string;
    honeypot: string; // Anti-spam hidden input
  }>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    honeypot: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Find selected service
  const selectedService = services.find((s) => s.id === selectedServiceId) || null;

  // If initialServiceId passed or changes
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      setCurrentStep(2);
    }
  }, [initialServiceId]);

  // Hook availability calculation
  const {
    slots,
    isClosed,
    closedReason,
    loading: availabilityLoading,
  } = useAvailability(
    selectedDate,
    selectedService ? selectedService.duration_minutes : 60
  );

  // Validate customer details step
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Por favor ingresa tu nombre y apellido';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = 'Ingresa un número de WhatsApp / teléfono válido';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato de correo electrónico no es válido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedServiceId) {
        showToast({
          type: 'warning',
          title: 'Servicio Requerido',
          message: 'Por favor selecciona el servicio que deseas agendar.',
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        showToast({
          type: 'warning',
          title: 'Fecha y Hora Requeridas',
          message: 'Por favor selecciona la fecha y el horario disponible para tu cita.',
        });
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validateForm()) {
        showToast({
          type: 'error',
          title: 'Campos Incompletos',
          message: 'Revisa los campos obligatorios del formulario.',
        });
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    // Spam check
    if (formData.honeypot) {
      return;
    }

    if (!selectedService) return;

    try {
      setIsSubmitting(true);
      const bookingData: BookingFormData = {
        service_id: selectedService.id,
        appointment_date: selectedDate,
        start_time: selectedTime,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        notes: formData.notes,
      };

      const result = await createBooking(bookingData, selectedService.duration_minutes);

      if (result.success && result.bookingId) {
        showToast({
          type: 'success',
          title: '¡Solicitud Registrada!',
          message: 'Tu cita ha sido guardada. Ahora confírmala por WhatsApp.',
        });
        navigate(`/reserva/confirmacion/${result.bookingId}`, {
          state: {
            booking: {
              ...bookingData,
              id: result.bookingId,
              status: 'pending',
            },
            service: selectedService,
          },
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error al reservar',
          message: result.error || 'No fue posible completar la reserva. Intenta de nuevo.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error inesperado',
        message: err.message || 'Ocurrió un error al procesar tu cita.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Min date today
  const minDate = getTodayDateString();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Wizard Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E8DFC8] w-full z-0" />
          {[
            { step: 1, label: 'Servicio', icon: <Sparkles className="w-4 h-4" /> },
            { step: 2, label: 'Fecha y Hora', icon: <CalendarIcon className="w-4 h-4" /> },
            { step: 3, label: 'Tus Datos', icon: <User className="w-4 h-4" /> },
            { step: 4, label: 'Confirmación', icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div
                key={item.step}
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (item.step < currentStep) setCurrentStep(item.step);
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-[#C5A880] text-white'
                      : isCurrent
                      ? 'bg-[#FAF8F5] text-[#8C6D40] border-2 border-[#C5A880] ring-4 ring-[#C5A880]/20 shadow-sm'
                      : 'bg-white text-[#A39793] border border-[#E2D8CC]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.icon}
                </div>
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider mt-2 hidden sm:block ${
                    isCurrent ? 'text-[#8C6D40]' : 'text-[#8C7E7A]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-10 shadow-sm">
        {/* ================= STEP 1: SERVICE SELECTOR ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2D2726]">
                1. Elige el servicio deseado
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D69] mt-1">
                Selecciona el tratamiento que deseas realizarte.
              </p>
            </div>

            {servicesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {services.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#FAF4ED] border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-xs'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#E8DFC8]'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center mt-1 sm:mt-0 flex-shrink-0 ${
                            isSelected
                              ? 'border-[#C5A880] bg-[#C5A880] text-white'
                              : 'border-[#D8C7B2] bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#2D2726]">
                            {service.name}
                          </h4>
                          <p className="text-xs text-[#7A6D69] line-clamp-1 mt-0.5">
                            {service.short_description || service.description}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#8C7E7A]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                              {formatDuration(service.duration_minutes)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right pl-10 sm:pl-0">
                        <span className="font-serif text-base sm:text-lg font-bold text-[#38302E]">
                          {formatCurrency(service.price, service.price_type)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: DATE & TIME SELECTOR ================= */}
        {currentStep === 2 && selectedService && (
          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D40] block">
                  Servicio Seleccionado
                </span>
                <span className="font-serif font-bold text-base text-[#2D2726]">
                  {selectedService.name}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#8C6D40] bg-white px-2.5 py-1 rounded-lg border border-[#EBDBC9]">
                {formatDuration(selectedService.duration_minutes)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Date selection input */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D2726] mb-1">
                    Selecciona el día
                  </h3>
                  <p className="text-xs text-[#7A6D69]">
                    Elige la fecha en la que deseas tu cita.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="booking-date-input"
                    className="text-xs font-semibold uppercase tracking-wider text-[#6E625F] block"
                  >
                    Fecha de la cita
                  </label>
                  <input
                    id="booking-date-input"
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset slot on date change
                    }}
                    className="w-full min-h-[48px] px-4 py-3 bg-[#FAF8F5] border border-[#E2D8CC] rounded-xl text-sm font-medium text-[#231F20] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
                  />
                  {selectedDate && (
                    <p className="text-xs text-[#8C6D40] font-medium capitalize mt-1">
                      📅 {formatDateSpanish(selectedDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Time Slots column */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2D2726] mb-1">
                    Horarios disponibles
                  </h3>
                  <p className="text-xs text-[#7A6D69]">
                    Selecciona una hora disponible para tu atención.
                  </p>
                </div>

                <TimeSlotPicker
                  slots={slots}
                  selectedSlot={selectedTime}
                  onSelectSlot={(time) => setSelectedTime(time)}
                  loading={availabilityLoading}
                  isClosed={isClosed}
                  closedReason={closedReason}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CUSTOMER INFORMATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2D2726]">
                3. Tus datos de contacto
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D69] mt-1">
                Necesitamos tus datos para registrar y enviarte la confirmación de la cita.
              </p>
            </div>

            {/* Anti-spam honeypot */}
            <input
              type="text"
              name="website_url_check"
              value={formData.honeypot}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, honeypot: e.target.value }))
              }
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Input
                  label="Nombre y Apellido *"
                  placeholder="Ej. María Fernanda Gómez"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  error={formErrors.name}
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="WhatsApp / Celular *"
                  placeholder="Ej. 310 123 4567"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  error={formErrors.phone}
                  helperText="Para enviarte la confirmación y recordatorio."
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Correo Electrónico (Opcional)"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  error={formErrors.email}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div className="sm:col-span-2">
                <TextArea
                  label="Notas o Requerimientos Especiales (Opcional)"
                  placeholder="¿Tienes alguna preferencia, alergia o detalle especial que debamos conocer?"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: RECAP & CONFIRMATION ================= */}
        {currentStep === 4 && selectedService && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2D2726]">
                4. Revisa y confirma tu cita
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6D69] mt-1">
                Verifica que todos los datos sean correctos antes de enviar la solicitud.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                    Servicio
                  </span>
                  <span className="font-serif text-xl font-bold text-[#2D2726]">
                    {selectedService.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                    Inversión
                  </span>
                  <span className="font-serif text-xl font-bold text-[#8C6D40]">
                    {formatCurrency(selectedService.price, selectedService.price_type)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-sm">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                    Fecha & Hora
                  </span>
                  <span className="font-medium text-[#2D2726] capitalize">
                    {formatDateSpanish(selectedDate)} a las {formatTime12h(selectedTime)}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                    Duración Estimada
                  </span>
                  <span className="font-medium text-[#2D2726]">
                    {formatDuration(selectedService.duration_minutes)}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                    Clienta
                  </span>
                  <span className="font-medium text-[#2D2726]">
                    {formData.name} ({formData.phone})
                  </span>
                </div>

                {formData.email && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
                      Email
                    </span>
                    <span className="font-medium text-[#2D2726]">
                      {formData.email}
                    </span>
                  </div>
                )}
              </div>

              {formData.notes && (
                <div className="pt-3 border-t border-[#E8DFC8] text-xs text-[#6E625F]">
                  <span className="font-bold text-[#38302E] block mb-1">Notas:</span>
                  <p className="italic">{formData.notes}</p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Al enviar la solicitud, se generará tu cita y serás redirigida a la pantalla de confirmación donde podrás abrir WhatsApp con un solo clic para coordinar con {settings.professional_name || 'Ana'}.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 pt-6 border-t border-[#E8DFC8] flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrevStep}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              Atrás
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              variant="gold"
              size="md"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continuar
            </Button>
          ) : (
            <Button
              variant="gold"
              size="lg"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Confirmar Reserva
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
