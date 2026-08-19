import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../contexts/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#8C6D40] flex-shrink-0" />,
  };

  const bgMap = {
    success: 'bg-white border-emerald-200 text-[#231F20]',
    error: 'bg-white border-rose-200 text-[#231F20]',
    warning: 'bg-white border-amber-200 text-[#231F20]',
    info: 'bg-white border-[#E8DFC8] text-[#231F20]',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#38302E]">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm text-[#554C4A] mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A39793] hover:text-[#231F20] p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
