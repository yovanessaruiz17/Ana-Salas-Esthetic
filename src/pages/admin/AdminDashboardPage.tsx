import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Phone,
  QrCode,
  Plus,
} from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useServices } from '../../hooks/useServices';
import { useReviews } from '../../hooks/useReviews';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency, formatDateSpanish, formatTime12h } from '../../utils/formatters';
import { getTodayDateString } from '../../utils/dates';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { BookingStatus } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { bookings, updateBookingStatus, loading: bookingsLoading } = useBookings();
  const { services } = useServices(true);
  const { reviews, pendingReviewsCount } = useReviews(false);
  const { showToast } = useToast();

  const todayStr = getTodayDateString();

  // Metrics
  const todayBookings = bookings.filter((b) => b.appointment_date === todayStr);
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  // Revenue estimation
  const totalRevenueThisMonth = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.service?.price || 0), 0);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    const res = await updateBookingStatus(id, status);
    if (res.success) {
      showToast({
        type: 'success',
        title: 'Estado Actualizado',
        message: `La cita ahora está en estado "${status}".`,
      });
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: res.error || 'No se pudo actualizar el estado.',
      });
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Confirmada
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Pendiente
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Completada
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
            Resumen General
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
            Bienvenida a tu centro de control diario.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/agenda">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Ver Agenda Completa
            </Button>
          </Link>
          <Link to="/admin/servicios">
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Gestionar Servicios
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
              Citas para Hoy
            </span>
            <span className="font-serif text-3xl font-bold text-[#2D2726] mt-1 block">
              {todayBookings.length}
            </span>
            <span className="text-[11px] text-[#8C6D40] mt-1 block font-medium">
              {todayBookings.filter((b) => b.status === 'confirmed').length} confirmadas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
              Citas Pendientes
            </span>
            <span className="font-serif text-3xl font-bold text-amber-700 mt-1 block">
              {pendingBookings.length}
            </span>
            <span className="text-[11px] text-[#8C7E7A] mt-1 block">
              Por validar con clienta
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
              Ingresos Activos
            </span>
            <span className="font-serif text-2xl font-bold text-[#2D2726] mt-1 block">
              {formatCurrency(totalRevenueThisMonth, 'fixed')}
            </span>
            <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
              Citas confirmadas & listas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Reviews Waiting */}
        <div className="bg-white rounded-2xl border border-[#E8DFC8] p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A39793] block">
              Reseñas por Aprobar
            </span>
            <span className="font-serif text-3xl font-bold text-[#2D2726] mt-1 block">
              {pendingReviewsCount}
            </span>
            <span className="text-[11px] text-[#8C7E7A] mt-1 block">
              Testimonios pendientes
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40]">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Split: Upcoming Today + Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Today's Appointments List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2ECE6] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D2726]">
                Citas de Hoy ({formatDateSpanish(todayStr)})
              </h3>
              <p className="text-xs text-[#7A6D69]">
                Turnos agendados para la jornada de hoy.
              </p>
            </div>
            <Link
              to="/admin/citas"
              className="text-xs font-semibold text-[#8C6D40] hover:text-[#2D2726] flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl w-full" />
              ))}
            </div>
          ) : todayBookings.length === 0 ? (
            <div className="text-center py-10 text-[#7A6D69] space-y-2">
              <Calendar className="w-10 h-10 text-[#C5A880] mx-auto opacity-50" />
              <p className="text-sm">No tienes citas programadas para hoy.</p>
              <p className="text-xs text-[#A39793]">
                ¡Un día ideal para planificar o atender citas espontáneas!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-[#E8DFC8] bg-[#FAF8F5] hover:bg-[#FAF4ED] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-[#EBDBC9] font-serif font-bold text-sm text-[#8C6D40] text-center min-w-[70px]">
                      {formatTime12h(b.start_time)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2D2726]">
                          {b.customer_name}
                        </h4>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-xs text-[#7A6D69] mt-0.5">
                        {b.service?.name || 'Servicio Personalizado'} •{' '}
                        <span className="font-mono">{b.customer_phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`https://wa.me/${String(b.customer_phone || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-[#E2D8CC] text-[#25D366] hover:bg-emerald-50 transition-colors"
                      title="Contactar por WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(b.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Tools & QR Shortcut */}
        <div className="lg:col-span-4 space-y-6">
          {/* QR Review Quick Card */}
          <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4ED] border border-[#EBDBC9] flex items-center justify-center text-[#8C6D40] mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#2D2726]">
                QR para Reseñas
              </h4>
              <p className="text-xs text-[#7A6D69] mt-1">
                Haz que tus clientas califiquen tu servicio directamente al finalizar su cita.
              </p>
            </div>
            <Link to="/admin/resenas" className="block">
              <Button variant="secondary" size="sm" fullWidth>
                Ver & Descargar Código QR
              </Button>
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-xs space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#2D2726] uppercase tracking-wider">
              Acciones Frecuentes
            </h4>
            <div className="space-y-2">
              <Link
                to="/admin/servicios/nuevo"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E8DFC8] hover:bg-[#FAF8F5] transition-colors text-xs font-semibold text-[#2D2726]"
              >
                <span>➕ Crear Nuevo Servicio</span>
                <ArrowRight className="w-4 h-4 text-[#8C6D40]" />
              </Link>
              <Link
                to="/admin/horarios"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E8DFC8] hover:bg-[#FAF8F5] transition-colors text-xs font-semibold text-[#2D2726]"
              >
                <span>⏰ Ajustar Horarios Semanales</span>
                <ArrowRight className="w-4 h-4 text-[#8C6D40]" />
              </Link>
              <Link
                to="/admin/configuracion"
                className="flex items-center justify-between p-3 rounded-xl border border-[#E8DFC8] hover:bg-[#FAF8F5] transition-colors text-xs font-semibold text-[#2D2726]"
              >
                <span>⚙️ Configurar Teléfono & WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-[#8C6D40]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
