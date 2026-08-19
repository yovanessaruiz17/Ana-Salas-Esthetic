import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { TimeSlot } from '../../types';
import { Skeleton } from '../common/Skeleton';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (time: string) => void;
  loading: boolean;
  isClosed: boolean;
  closedReason?: string;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  isClosed,
  closedReason,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mx-auto mb-2">
          <Clock className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-base font-bold text-[#38302E] mb-1">
          Día No Disponible
        </h4>
        <p className="text-xs text-[#7A6D69] max-w-sm mx-auto">
          {closedReason || 'No hay atención disponible para la fecha seleccionada. Por favor elige otro día en el calendario.'}
        </p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-[#E8DFC8] text-center">
        <AlertCircle className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
        <h4 className="font-serif text-base font-bold text-[#38302E] mb-1">
          Sin horarios libres
        </h4>
        <p className="text-xs text-[#7A6D69] max-w-sm mx-auto">
          Todos los turnos para este día están reservados o no cumplen con la duración requerida. Por favor selecciona otra fecha.
        </p>
      </div>
    );
  }

  // Split into Morning (before 12:00) and Afternoon/Evening (12:00 onwards)
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.time.split(':')[0], 10);
    return hour >= 12;
  });

  const renderSlotGroup = (title: string, groupSlots: TimeSlot[]) => {
    if (groupSlots.length === 0) return null;

    return (
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D40] block">
          {title}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {groupSlots.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => onSelectSlot(slot.time)}
                title={slot.reason || slot.formattedTime}
                className={`py-3 px-3 rounded-xl text-xs font-semibold tracking-wider transition-all flex flex-col items-center justify-center border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C5A880] text-white border-[#B38F5C] shadow-md ring-2 ring-[#C5A880]/30'
                    : slot.available
                    ? 'bg-white hover:bg-[#FAF4ED] text-[#2D2726] border-[#E2D8CC] hover:border-[#C5A880]'
                    : 'bg-[#F2ECE6]/60 text-[#A39793] border-transparent cursor-not-allowed line-through opacity-60'
                }`}
              >
                <span>{slot.formattedTime}</span>
                {!slot.available && (
                  <span className="text-[10px] text-[#A39793] not-italic mt-0.5 no-underline">
                    Ocupado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSlotGroup('Turnos de la Mañana', morningSlots)}
      {renderSlotGroup('Turnos de la Tarde', afternoonSlots)}
    </div>
  );
};
