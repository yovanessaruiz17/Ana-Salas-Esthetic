import React, { useState } from 'react';
import { User, Lock, Save, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminProfilePage: React.FC = () => {
  const { user, profile, updatePassword } = useAuth();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast({
        type: 'warning',
        title: 'Contraseña muy corta',
        message: 'La nueva contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Las contraseñas no coinciden',
        message: 'Por favor verifica que ambas contraseñas sean idénticas.',
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await updatePassword(newPassword);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Contraseña Actualizada',
          message: 'Tu contraseña de acceso ha sido cambiada correctamente.',
        });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: res.error || 'No se pudo cambiar la contraseña.',
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2726]">
          Mi Perfil & Seguridad
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6D69] mt-0.5">
          Información de tu cuenta de administradora y cambio de contraseña.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#2D2726] border-b border-[#F2ECE6] pb-3">
          Datos de la Cuenta
        </h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF4ED] border-2 border-[#C5A880] flex items-center justify-center text-[#8C6D40] font-serif text-2xl font-bold">
            {profile?.full_name?.substring(0, 1) || 'A'}
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-[#2D2726]">
              {profile?.full_name || 'Ana María Salas'}
            </h4>
            <p className="text-xs text-[#7A6D69] flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'admin@anamariasalas.com'}</span>
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              Rol: {profile?.role || 'Super Administradora'}
            </span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white rounded-3xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-[#F2ECE6] pb-3">
          <Lock className="w-5 h-5 text-[#8C6D40]" />
          <h3 className="font-serif text-lg font-bold text-[#2D2726]">
            Cambiar Contraseña
          </h3>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Estás en modo demostración. El cambio de contraseña se simulará con éxito.
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            placeholder="Repite la nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-4 border-t border-[#F2ECE6] flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={isUpdatingPassword}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </div>
  );
};
