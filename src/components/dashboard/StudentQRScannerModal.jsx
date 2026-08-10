import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Camera, CheckCircle2, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { markStudentPresent } from '../../utils/mockQRAttendance';

const StudentQRScannerModal = ({ isOpen, onClose, event, studentRoll = '237R1A05BA', studentName = 'Student Member', onToast, onSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !event) return null;

  const handleScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      markStudentPresent(event.id, studentRoll, studentName);
      setIsScanning(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      if (onToast) {
        onToast(`🟢 Attendance Marked Present for "${event.title}"!`, 'success');
      }
    }, 1500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 select-none text-center"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-emerald-400" />
              <span className="font-extrabold text-sm tracking-wide text-white">
                Mobile QR Attendance Scanner
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {!isSuccess ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                    Scan Event QR Code
                  </span>
                  <h3 className="text-xl font-black text-white">{event.title}</h3>
                  <p className="text-xs text-slate-400">Point your phone camera at the venue QR display to mark present.</p>
                </div>

                {/* Camera Viewfinder Box */}
                <div className="relative w-56 h-56 mx-auto rounded-3xl bg-slate-950 border-4 border-emerald-500/50 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
                  {/* Corner Viewfinder Indicators */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-emerald-400 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-emerald-400 pointer-events-none" />

                  {/* Scanning Laser Beam */}
                  {isScanning ? (
                    <motion.div
                      animate={{ y: [-90, 90, -90] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981]"
                    />
                  ) : (
                    <div className="space-y-2 text-center p-4">
                      <QrCode size={48} className="mx-auto text-emerald-400 animate-pulse" />
                      <p className="text-[11px] font-mono text-slate-400">Ready to Scan Event Pass</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    disabled={isScanning}
                    onClick={handleScanSimulation}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Smartphone size={16} />
                    <span>{isScanning ? 'Scanning QR Code...' : 'Simulate Camera QR Scan'}</span>
                  </button>

                  <p className="text-[11px] text-slate-500 font-medium">
                    Student Account: <strong className="text-white">{studentRoll}</strong> ({studentName})
                  </p>
                </div>
              </div>
            ) : (
              /* Success Celebration State */
              <div className="space-y-6 py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 size={44} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Attendance Marked Present!</h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Your attendance for <strong className="text-emerald-400">{event.title}</strong> has been officially logged in CMRTC records.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs text-slate-400">
                  <p>Student Roll: <strong className="text-white">{studentRoll}</strong></p>
                  <p>Status: <strong className="text-emerald-400 font-bold">Present (Verified ✔)</strong></p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">Hash Pass: CMRTC-QR-ATT-{Date.now()}</p>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase cursor-pointer"
                >
                  Done & Close Scanner
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentQRScannerModal;
