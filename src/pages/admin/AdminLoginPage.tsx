import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated, redirect declaratively
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor ingresa tu correo y contraseña.',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        showToast({
          type: 'success',
          title: '¡Bienvenida!',
          message: 'Has iniciado sesión correctamente.',
        });
        navigate(from, { replace: true });
      } else {
        showToast({
          type: 'error',
          title: 'Credenciales inválidas',
          message: result.error || 'Correo o contraseña incorrectos.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error de autenticación',
        message: err.message || 'Ocurrió un error al intentar iniciar sesión.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const result = await login('admin@anamariasalas.com', 'admin123');
    setLoading(false);
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Acceso Demo Concedido',
        message: 'Has entrado al panel en modo demostración.',
      });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF4ED] border border-[#C5A880] flex items-center justify-center text-[#8C6D40] shadow-sm mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
          Panel de Administración
        </h2>
        <p className="mt-1 text-xs text-[#7A6D69]">
          Acceso exclusivo para Ana María Salas Studio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-6">
          {!isSupabaseConfigured && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Modo Demostración Activo</span>
              </div>
              <p>
                Supabase no está configurado con claves en este entorno. Puedes acceder inmediatamente al panel para probar todas las funciones de agenda, servicios y reservas.
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Entrar en Modo Demo con 1 Clic
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@anamariasalas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#F2ECE6]">
            <Link
              to="/"
              className="text-xs text-[#8C6D40] hover:text-[#231F20] font-medium transition-colors"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
