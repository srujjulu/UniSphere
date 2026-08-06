import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CoordinatorPinModal = ({ isOpen, onClose, onSuccess }) => {
  const { authenticateCoordinator } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = authenticateCoordinator(pin);
    if (res.success) {
      setPin('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090E1B]/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-[28px] p-6 shadow-2xl z-10 text-center space-y-4"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock size={28} />
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-pink-600 tracking-wider uppercase bg-pink-100/80 px-2.5 py-1 rounded-full border border-pink-200 inline-block mb-1">
              Restricted Coordinator Access
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Coordinator Verification Needed
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1.5 max-w-xs mx-auto">
              The Campus Influencer Sheet contains student contacts & audition calling tools reserved exclusively for official **Club Coordinators & Faculty Leads**.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-left">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Coordinator Security PIN *</span>
                <span className="text-[10px] text-pink-600 font-mono font-extrabold lowercase">Default PIN: 2026</span>
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Security PIN (e.g. 2026)"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-pink-500 transition-all bg-slate-50"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Verify & Unlock Influencer Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPin('2026');
                const res = authenticateCoordinator('2026');
                if (res.success) {
                  if (onSuccess) onSuccess();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-pink-200"
            >
              <Sparkles size={14} />
              <span>Quick Unlock Demo (PIN: 2026)</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CoordinatorPinModal;
