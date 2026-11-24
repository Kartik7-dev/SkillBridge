import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} className="text-[#65A30D] shrink-0" />,
    error: <AlertCircle size={18} className="text-[#E11D48] shrink-0" />,
    warning: <AlertCircle size={18} className="text-[#D97706] shrink-0" />,
    info: <Info size={18} className="text-[#7C3AED] shrink-0" />,
  };

  const borderMap = {
    success: 'border-[#ECFCCB] bg-white/95 text-[#171329] shadow-[0_8px_24px_rgba(101,163,13,0.12)]',
    error: 'border-[#FFE4E6] bg-white/95 text-[#171329] shadow-[0_8px_24px_rgba(225,29,72,0.12)]',
    warning: 'border-[#FEF3C7] bg-white/95 text-[#171329] shadow-[0_8px_24px_rgba(217,119,6,0.12)]',
    info: 'border-[#E9E2F5] bg-white/95 text-[#171329] shadow-[0_8px_24px_rgba(124,58,237,0.15)]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border backdrop-blur-md ${
              borderMap[toast.type] || borderMap.info
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {iconMap[toast.type] || iconMap.info}
              <p className="text-sm font-medium text-[#171329] leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-[#6B6680] hover:text-[#171329] hover:bg-[#F5F0FF] transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
