import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from './components/common/Toast';

// Public Layout & Pages
import { PublicLayout } from './components/layout/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { BookingPage } from './pages/public/BookingPage';
import { BookingConfirmationPage } from './pages/public/BookingConfirmationPage';
import { ReviewsPage } from './pages/public/ReviewsPage';
import { NewReviewPage } from './pages/public/NewReviewPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';

// Admin Layout & Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAgendaPage } from './pages/admin/AdminAgendaPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminServiceFormPage } from './pages/admin/AdminServiceFormPage';
import { AdminBusinessHoursPage } from './pages/admin/AdminBusinessHoursPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

// Scroll to top helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <ScrollToTop />
            <ToastContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="servicios" element={<ServicesPage />} />
                <Route path="servicios/:id" element={<ServiceDetailPage />} />
                <Route path="reservar" element={<BookingPage />} />
                <Route path="reservar/:serviceId" element={<BookingPage />} />
                <Route
                  path="reserva/confirmacion/:bookingId"
                  element={<BookingConfirmationPage />}
                />
                <Route path="resenas" element={<ReviewsPage />} />
                <Route path="resenas/nueva" element={<NewReviewPage />} />
                <Route path="contacto" element={<ContactPage />} />
                <Route path="privacidad" element={<PrivacyPage />} />
                <Route path="terminos" element={<TermsPage />} />
              </Route>

              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="agenda" element={<AdminAgendaPage />} />
                <Route path="citas" element={<AdminBookingsPage />} />
                <Route path="reservas" element={<AdminBookingsPage />} />
                <Route path="servicios" element={<AdminServicesPage />} />
                <Route path="servicios/nuevo" element={<AdminServiceFormPage />} />
                <Route path="servicios/editar/:id" element={<AdminServiceFormPage />} />
                <Route path="horarios" element={<AdminBusinessHoursPage />} />
                <Route path="resenas" element={<AdminReviewsPage />} />
                <Route path="configuracion" element={<AdminSettingsPage />} />
                <Route path="perfil" element={<AdminProfilePage />} />
              </Route>

              {/* Catch-all 404 redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
