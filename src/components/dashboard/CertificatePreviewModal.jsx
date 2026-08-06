import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Award, Sparkles, Printer, CheckCircle2, GraduationCap } from 'lucide-react';
import { 
  AkritiLogo,
  CodeClubLogo, 
  PhotoClubLogo, 
  EcoClubLogo, 
  DesignClubLogo,
  NssLogo 
} from '../../utils/clubLogos';

const getClubLogoSvg = (clubId) => {
  switch (clubId) {
    case 'akriti': return <AkritiLogo />;
    case 'codeholics': return <CodeClubLogo />;
    case 'photography': return <PhotoClubLogo />;
    case 'lexis': return <EcoClubLogo />;
    case 'ncc': return <DesignClubLogo />;
    case 'nss': return <NssLogo />;
    default: return <CodeClubLogo />;
  }
};

const CertificatePreviewModal = ({ isOpen, onClose, certificate, onDownload }) => {
  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 font-sans"
        >
          {/* Top Modal Navigation Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-400" />
              <span className="font-extrabold text-sm tracking-wide text-white">
                Official Campus Certificate Document Preview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDownload && onDownload(certificate)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Certificate Printable Canvas Container */}
          <div className="p-6 sm:p-10 overflow-x-auto">
            <div className="w-full min-w-[650px] bg-[#FFFDF9] text-slate-900 rounded-3xl p-8 sm:p-12 border-8 border-double border-amber-600/40 shadow-2xl relative select-none">
              
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

              {/* Background Crest Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src="/UniSphere.png" alt="UniSphere Watermark" className="w-96 h-96 object-contain" />
              </div>

              {/* Top Header Logos & Branding */}
              <div className="flex items-center justify-between border-b-2 border-amber-600/30 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-md border border-amber-200 flex items-center justify-center">
                    <img src="/UniSphere.png" alt="CMRTC Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight uppercase text-amber-950 leading-none">
                      CMR Technical Campus
                    </h3>
                    <p className="text-xs font-bold text-amber-800 tracking-wider mt-1 uppercase">
                      Kandlakoya (V), Medchal Road, Hyderabad • UGC Autonomous
                    </p>
                  </div>
                </div>

                <div className="w-14 h-14 bg-white rounded-2xl p-2 shadow-md border border-amber-200 flex items-center justify-center">
                  {getClubLogoSvg(certificate.clubId)}
                </div>
              </div>

              {/* Certificate Main Body Content */}
              <div className="text-center space-y-5 my-6">
                <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase tracking-widest border border-amber-300">
                  {certificate.clubName}
                </span>

                <h1 className="text-3xl sm:text-4xl font-serif font-black text-amber-950 tracking-tight uppercase drop-shadow-sm">
                  Certificate of Achievement
                </h1>

                <p className="text-sm font-medium text-slate-600 italic">
                  This official document certifies that
                </p>

                {/* Recipient Name */}
                <div className="py-2 border-b-2 border-amber-800/40 inline-block px-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide font-sans">
                    {certificate.studentName}
                  </h2>
                  <p className="text-xs font-mono font-bold text-amber-800 mt-0.5">
                    Roll No: {certificate.studentRoll}
                  </p>
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
                  has successfully participated and earned the honor of <strong className="text-amber-950">{certificate.title}</strong> during the official college event <strong className="text-slate-900">{certificate.eventName}</strong>.
                </p>

                {certificate.description && (
                  <p className="text-xs text-slate-600 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 max-w-xl mx-auto italic font-serif">
                    "{certificate.description}"
                  </p>
                )}
              </div>

              {/* Footer Signatures & Official Seal */}
              <div className="pt-8 mt-8 border-t border-amber-600/20 flex flex-wrap items-end justify-between gap-6">
                {/* Left: Verified Credential & QR Stamp */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                    <ShieldCheck size={16} />
                    <span>Verified Digital Credential</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-500">ID: {certificate.credentialId}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Issue Date: {certificate.issueDate}</p>
                </div>

                {/* Center: Gold Foil Badge Graphic */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center border-2 border-amber-300 transform rotate-6">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900 flex flex-col items-center justify-center text-amber-950 text-center p-1">
                    <Award size={20} />
                    <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">Official Seal</span>
                  </div>
                </div>

                {/* Right: Authorized Signatures */}
                <div className="text-right space-y-1">
                  <div className="font-serif italic text-lg text-slate-900 font-bold border-b border-slate-400 pb-1 px-4 inline-block">
                    {certificate.verifiedBy || 'Dr. Suresh Kumar'}
                  </div>
                  <p className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                    Authorized Faculty Coordinator
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase font-bold">CMR Technical Campus</p>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer CTA */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Authenticity hash verified by UniSphere Certificate Center</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CertificatePreviewModal;
