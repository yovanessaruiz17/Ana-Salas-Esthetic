import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useBusinessHours } from '../../hooks/useBusinessHours';
import { formatTime12h, formatDateSpanish, formatDuration, formatCurrency } from '../../utils/formatters';
import { getTodayDateString, addDays, getDayOfWeekIndex } from '../../utils/dates';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Booking, BookingStatus } from '../../types';
import { useToast } from '../../contexts/ToastContext';

export const AdminAgendaPage: React.FC = () => {
  const { bookings, updateBookingStatus, loading } = useBookings();
  const { isDateClosed } = useBusinessHours();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Filter bookings for the selected date
  const dayBookings = bookings
    .filter((b) => b.appointment_date === selectedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Date Navigation handlers
  const handlePrevDay = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const handleStatusChange = async (status: BookingStatus) => {
    if (!selectedBooking) return;
    const res = await updateBookingStatus(selectedBooking.id, status);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Estado Actualizado',
        message: `La cita ha sido marcada como "${status}".`,
      });
      setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo actualizar el estado.',
      });
    }
  };

  const dayClosedInfo = isDateClosed(selectedDate);

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FAF8F5] border border-[#E2D8CC] rounded-xl p-1">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-lg hover:bg-white text-[#2D2726] transition-colors cursor-pointer"
              aria-label="Día anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white text-[#2D2726] transition-colors cursor-pointer"
            >
              Hoy
            </button>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-lg hover:bg-white text-[#2D2726] transition-colors cursor-pointer"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2D2726] capitalize">
              {formatDateSpanish(selectedDate)}
            </h2>
            <span className="text-xs text-[#8C7E7A]">
              {dayBookings.length} {dayBookings.length === 1 ? 'cita programada' : 'citas programadas'}
            </span>
          </div>
        </div>

        {/* Date picker quick input */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#E2D8CC] rounded-xl text-xs font-semibold text-[#2D2726] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
          />
        </div>
      </div>

      {/* Closed Day Banner if applicable */}
      {dayClosedInfo.closed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Día no laboral:</strong> {dayClosedInfo.reason || 'Cerrado según horario comercial o fecha bloqueada.'}
          </span>
        </div>
      )}

      {/* Agenda Timeline List */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-xs">
        {dayBookings.length === 0 ? (
          <div className="text-center py-16 text-[#7A6D69] space-y-3">
            <CalendarIcon className="w-12 h-12 text-[#C5A880] mx-auto opacity-50" />
            <h4 className="font-serif text-lg font-bold text-[#2D2726]">
              No hay citas para este día
            </h4>
            <p className="text-xs text-[#8C7E7A] max-w-sm mx-auto">
              No se han registrado reservas para la fecha seleccionada.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayBookings.map((b) => {
              const statusColors: Record<BookingStatus, string> = {
                confirmed: 'border-emerald-300 bg-emerald-50/40',
                pending: 'border-amber-300 bg-amber-50/40',
                completed: 'border-blue-300 bg-blue-50/40',
                cancelled: 'border-rose-300 bg-rose-50/40 opacity-70',
                no_show: 'border-stone-300 bg-stone-50/40 opacity-60',
              };

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBooking(b);
                    setIsDetailModalOpen(true);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    statusColors[b.status] || 'border-[#E8DFC8] bg-white'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="px-4 py-2.5 rounded-xl bg-white border border-[#EBDBC9] font-serif font-bold text-base text-[#8C6D40] text-center min-w-[90px] shadow-xs">
                      {formatTime12h(b.start_time)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-[#2D2726]">
                          {b.customer_name}
                        </h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-200 text-emerald-900'
                              : b.status === 'pending'
                              ? 'bg-amber-200 text-amber-900'
                              : b.status === 'completed'
                              ? 'bg-blue-200 text-blue-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6D69] mt-1 font-medium">
                        {b.service?.name || 'Tratamiento'} •{' '}
                        <span>{formatDuration(b.service?.duration_minutes || 60)}</span>
                      </p>
                      {b.notes && (
                        <p className="text-xs text-[#8C7E7A] italic mt-1 line-clamp-1">
                          Nota: "{b.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <a
                      href={`https://wa.me/${String(b.customer_phone || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-white border border-[#E2D8CC] text-[#25D366] hover:bg-emerald-50 transition-colors shadow-xs"
                      title="Abrir chat en WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(b);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles de la Cita"
        subtitle={`Ref: #${selectedBooking?.id.slice(-6)}`}
        maxWidth="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A39793] uppercase font-bold block">
                  Estado Actual
                </span>
                <span className="font-serif font-bold text-base capitalize text-[#2D2726]">
                  {selectedBooking.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedBooking.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  >
                    Confirmar
                  </button>
                )}
                {selectedBooking.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                  >
                    Completar
                  </button>
                )}
                {selectedBooking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-[#E8DFC8] bg-white">
                <span className="text-[#A39793] font-bold uppercase block mb-1">
                  Clienta
                </span>
                <p className="font-serif font-bold text-sm text-[#2D2726]">
                  {selectedBooking.customer_name}
                </p>
                <p className="text-[#7A6D69] mt-0.5">{selectedBooking.customer_phone}</p>
                {selectedBooking.customer_email && (
                  <p className="text-[#7A6D69]">{selectedBooking.customer_email}</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-[#E8DFC8] bg-white">
                <span className="text-[#A39793] font-bold uppercase block mb-1">
                  Servicio
                </span>
                <p className="font-serif font-bold text-sm text-[#2D2726]">
                  {selectedBooking.service?.name}
                </p>
                <p className="text-[#8C6D40] font-semibold mt-0.5">
                  {formatCurrency(selectedBooking.service?.price || 0, 'fixed')}
                </p>
                <p className="text-[#7A6D69]">
                  {formatDuration(selectedBooking.service?.duration_minutes || 60)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E8DFC8] bg-white">
                <span className="text-[#A39793] font-bold uppercase block mb-1">
                  Fecha & Hora
                </span>
                <p className="font-medium text-[#2D2726] capitalize">
                  {formatDateSpanish(selectedBooking.appointment_date)}
                </p>
                <p className="text-[#8C6D40] font-bold text-sm mt-0.5">
                  {formatTime12h(selectedBooking.start_time)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E8DFC8] bg-white">
                <span className="text-[#A39793] font-bold uppercase block mb-1">
                  Contacto Directo
                </span>
                <a
                  href={`https://wa.me/${String(selectedBooking.customer_phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline mt-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chatear por WhatsApp</span>
                </a>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs">
                <span className="font-bold text-[#2D2726] block mb-1">
                  Notas de la reserva:
                </span>
                <p className="text-[#6E625F] italic">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
