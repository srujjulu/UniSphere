import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-[360px] pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                p-4 rounded-2xl border flex items-start gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)] 
                pointer-events-auto backdrop-blur-xl transition-all duration-300
                ${isSuccess 
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
                  : 'bg-red-950/80 border-red-500/30 text-red-200'
                }
              `}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={18} className="text-red-400" />
                )}
              </div>
              
              {/* Message Details */}
              <div className="flex-1 text-left leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-[1.5px] block opacity-60">
                  {isSuccess ? 'Success' : 'Notice'}
                </span>
                <p className="text-sm font-semibold mt-1 text-white">{toast.message}</p>
              </div>

              {/* Close Trigger */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white cursor-pointer transition-colors p-0.5 hover:bg-white/5 rounded focus:outline-none"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
