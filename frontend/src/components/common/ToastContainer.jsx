import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border bg-white ${t.type === 'error' ? 'border-red-100' : t.type === 'success' ? 'border-green-100' : 'border-blue-100'}`}
          >
            {t.type === 'success' && <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />}
            {t.type === 'error' && <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" />}
            {t.type === 'info' && <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-bold text-elppa-obsidian max-w-[250px]">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 text-elppa-gray hover:text-black">
              <X className="w-4 h-4 flex-shrink-0" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
