import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../contexts/ToastContext';
import { formatTime12h, formatDateSpanish, formatDuration, formatCurrency } from '../../utils/formatters';
import { BookingStatus, Booking } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, updateBookingStatus, deleteBooking, loading } = useBookings();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingForDelete, setSelectedBookingForDelete] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.customer_phone.includes(search) ||
        (b.service && b.service.name.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    const res = await updateBookingStatus(id, status);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Estado Actualizado',
        message: `La cita se cambió a ${status}.`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo actualizar la cita.',
      });
    }
  };

  const confirmDelete = async () => {
    if (!selectedBookingForDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteBooking(selectedBookingForDelete.id);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Cita Eliminada',
          message: 'El registro ha sido eliminado correctamente.',
        });
        setSelectedBookingForDelete(null);
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: res.error || 'No se pudo eliminar la cita.',
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = () => {
    const headers = 'ID,Fecha,Hora,Clienta,Telefono,Email,Servicio,Precio,Estado,Notas\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.appointment_date}","${b.start_time}","${b.customer_name}","${b.customer_phone}","${b.customer_email || ''}","${b.service?.name || ''}","${b.service?.price || ''}","${b.status}","${b.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `citas-anamariasalas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C7E7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por clienta, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#E2D8CC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A880] text-[#231F20]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#C5A880] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#7A6D69] hover:bg-[#F2ECE6]'
                }`}
              >
                {status === 'all'
                  ? 'Todas'
                  : status === 'pending'
                  ? 'Pendientes'
                  : status === 'confirmed'
                  ? 'Confirmadas'
                  : status === 'completed'
                  ? 'Completadas'
                  : 'Canceladas'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            leftIcon={<Download className="w-4 h-4" />}
            title="Exportar listado a archivo CSV"
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Bookings Table / Card List */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl w-full" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={<Calendar className="w-8 h-8 text-[#C5A880]" />}
              title="No se encontraron citas"
              description="No hay citas que coincidan con los filtros seleccionados."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#7A6D69] uppercase font-bold tracking-wider border-b border-[#E8DFC8]">
                <tr>
                  <th className="py-4 px-6">Fecha & Hora</th>
                  <th className="py-4 px-6">Clienta</th>
                  <th className="py-4 px-6">Tratamiento</th>
                  <th className="py-4 px-6">Inversión</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE6]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF4ED]/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-[#2D2726] capitalize">
                        {formatDateSpanish(b.appointment_date)}
                      </div>
                      <div className="text-[#8C6D40] font-mono font-medium">
                        {formatTime12h(b.start_time)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-[#2D2726]">
                        {b.customer_name}
                      </div>
                      <div className="flex items-center gap-2 text-[#7A6D69] mt-0.5">
                        <span className="font-mono">{b.customer_phone}</span>
                        <a
                          href={`https://wa.me/${String(b.customer_phone || '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-[#2D2726]">
                        {b.service?.name || 'Servicio'}
                      </div>
                      <div className="text-[#A39793]">
                        {formatDuration(b.service?.duration_minutes || 60)}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-[#38302E]">
                      {formatCurrency(b.service?.price || 0, 'fixed')}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingStatus)
                        }
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : b.status === 'completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedBookingForDelete(b)}
                        className="p-2 text-[#A39793] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar registro de cita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        isOpen={!!selectedBookingForDelete}
        onClose={() => setSelectedBookingForDelete(null)}
        title="¿Eliminar esta cita?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#6E625F] leading-relaxed">
            Esta acción eliminará de forma permanente la reserva de{' '}
            <strong>{selectedBookingForDelete?.customer_name}</strong> para el día{' '}
            <strong>{selectedBookingForDelete?.appointment_date}</strong>.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedBookingForDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Sí, Eliminar Cita
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
