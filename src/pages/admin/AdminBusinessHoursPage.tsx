import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useBusinessHours } from '../../hooks/useBusinessHours';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getDayNameSpanish } from '../../utils/dates';
import { BusinessHours, SpecialClosedDate } from '../../types';

export const AdminBusinessHoursPage: React.FC = () => {
  const {
    businessHours,
    specialClosedDates,
    saveBusinessHours,
    addSpecialClosedDate,
    removeSpecialClosedDate,
    loading,
  } = useBusinessHours();
  const { showToast } = useToast();

  const [hoursList, setHoursList] = useState<BusinessHours[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // New blackout date modal/form state
  const [newClosedDate, setNewClosedDate] = useState('');
  const [newClosedReason, setNewClosedReason] = useState('');

  // Sync state when data loaded
  React.useEffect(() => {
    if (businessHours.length > 0) {
      setHoursList(businessHours);
    }
  }, [businessHours]);

  const handleDayToggle = (dayOfWeek: number) => {
    setHoursList((prev) =>
      prev.map((item) =>
        item.day_of_week === dayOfWeek
          ? { ...item, is_closed: !item.is_closed }
          : item
      )
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'open_time' | 'close_time' | 'lunch_start' | 'lunch_end',
    val: string
  ) => {
    setHoursList((prev) =>
      prev.map((item) =>
        item.day_of_week === dayOfWeek ? { ...item, [field]: val } : item
      )
    );
  };

  const handleSaveHours = async () => {
    try {
      setIsSaving(true);
      const res = await saveBusinessHours(hoursList);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Horarios Guardados',
          message: 'La disponibilidad semanal ha sido actualizada.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error al guardar',
          message: res.error || 'No se pudieron actualizar los horarios.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClosedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosedDate) {
      showToast({
        type: 'warning',
        title: 'Fecha requerida',
        message: 'Por favor selecciona la fecha que deseas bloquear.',
      });
      return;
    }

    const res = await addSpecialClosedDate(newClosedDate, newClosedReason || 'Cerrado por motivos personales / festivo');
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Fecha Bloqueada',
        message: `El día ${newClosedDate} ya no permitirá reservas.`,
      });
      setNewClosedDate('');
      setNewClosedReason('');
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo agregar la fecha.',
      });
    }
  };

  const handleRemoveClosedDate = async (id: string) => {
    const res = await removeSpecialClosedDate(id);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Fecha Desbloqueada',
        message: 'El día vuelve a estar disponible para agendamiento.',
      });
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
          Horarios de Atención & Disponibilidad
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
          Configura tus días laborales, horas de apertura/cierre, recesos de almuerzo y fechas especiales bloqueadas.
        </p>
      </div>

      {/* Weekly Schedule Configuration */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE6]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8C6D40]" />
            <h3 className="font-serif text-lg font-bold text-[#2D2726]">
              Jornada Semanal
            </h3>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={handleSaveHours}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Horarios
          </Button>
        </div>

        <div className="divide-y divide-[#F2ECE6]">
          {hoursList.map((day) => {
            const dayName = getDayNameSpanish(day.day_of_week);

            return (
              <div
                key={day.day_of_week}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Day name & toggle */}
                <div className="flex items-center gap-3 w-40">
                  <button
                    type="button"
                    onClick={() => handleDayToggle(day.day_of_week)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                      !day.is_closed
                        ? 'bg-[#C5A880] border-[#C5A880] text-white'
                        : 'border-[#D8C7B2] bg-white'
                    }`}
                  >
                    {!day.is_closed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <span className={`text-sm font-bold capitalize ${day.is_closed ? 'text-[#A39793] line-through' : 'text-[#2D2726]'}`}>
                    {dayName}
                  </span>
                </div>

                {/* Times input if open */}
                {!day.is_closed ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#E8DFC8]">
                      <span className="text-[#8C7E7A] font-medium">Apertura:</span>
                      <input
                        type="time"
                        value={day.open_time}
                        onChange={(e) =>
                          handleTimeChange(day.day_of_week, 'open_time', e.target.value)
                        }
                        className="bg-transparent font-mono font-bold text-[#2D2726] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#E8DFC8]">
                      <span className="text-[#8C7E7A] font-medium">Cierre:</span>
                      <input
                        type="time"
                        value={day.close_time}
                        onChange={(e) =>
                          handleTimeChange(day.day_of_week, 'close_time', e.target.value)
                        }
                        className="bg-transparent font-mono font-bold text-[#2D2726] focus:outline-none"
                      />
                    </div>

                    {/* Lunch Break */}
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-2 rounded-xl border border-[#E8DFC8]">
                      <span className="text-[#8C7E7A] font-medium">Almuerzo:</span>
                      <input
                        type="time"
                        value={day.lunch_start || ''}
                        placeholder="13:00"
                        onChange={(e) =>
                          handleTimeChange(day.day_of_week, 'lunch_start', e.target.value)
                        }
                        className="bg-transparent font-mono font-bold text-[#2D2726] w-14 focus:outline-none"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={day.lunch_end || ''}
                        placeholder="14:00"
                        onChange={(e) =>
                          handleTimeChange(day.day_of_week, 'lunch_end', e.target.value)
                        }
                        className="bg-transparent font-mono font-bold text-[#2D2726] w-14 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    Cerrado (Sin atención)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Blackout / Vacation Dates */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#F2ECE6]">
          <Calendar className="w-5 h-5 text-[#8C6D40]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2D2726]">
              Fechas Especiales Bloqueadas
            </h3>
            <p className="text-xs text-[#7A6D69]">
              Festivos, vacaciones o días personales donde no habrá turnos disponibles.
            </p>
          </div>
        </div>

        {/* Add New Date Form */}
        <form
          onSubmit={handleAddClosedDate}
          className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] flex flex-col sm:flex-row items-end gap-3"
        >
          <div className="w-full sm:w-48">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D40] block mb-1">
              Fecha a Bloquear *
            </label>
            <input
              type="date"
              value={newClosedDate}
              onChange={(e) => setNewClosedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2D8CC] rounded-xl text-xs text-[#2D2726] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
              required
            />
          </div>

          <div className="flex-1 w-full">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D40] block mb-1">
              Motivo (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Día festivo / Capacitación profesional"
              value={newClosedReason}
              onChange={(e) => setNewClosedReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2D8CC] rounded-xl text-xs text-[#2D2726] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Bloquear Día
          </Button>
        </form>

        {/* Closed Dates List */}
        {specialClosedDates.length === 0 ? (
          <p className="text-xs text-[#A39793] italic text-center py-4">
            No tienes fechas bloqueadas actualmente.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialClosedDates.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/50 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-xs text-[#2D2726] font-mono block">
                    📅 {item.closed_date}
                  </span>
                  <span className="text-[11px] text-[#7A6D69]">
                    {item.reason || 'Cerrado'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveClosedDate(item.id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  title="Desbloquear fecha"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
