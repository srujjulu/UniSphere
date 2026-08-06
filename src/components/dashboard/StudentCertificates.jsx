import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Eye, Download, ShieldCheck, Sparkles, Calendar, Building2, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentCertificates } from '../../utils/mockCertificates';
import CertificatePreviewModal from './CertificatePreviewModal';

const StudentCertificates = ({ onToast }) => {
  const { user } = useAuth();
  const studentRoll = user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA';

  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync certificates dynamically
  useEffect(() => {
    const loadCerts = () => {
      const studentCerts = getStudentCertificates(studentRoll);
      setCertificates(studentCerts);
    };
    loadCerts();
    window.addEventListener('storage', loadCerts);
    return () => window.removeEventListener('storage', loadCerts);
  }, [studentRoll]);

  const handlePreview = (cert) => {
    setSelectedCertificate(cert);
    setIsPreviewOpen(true);
  };

  const handleDownload = (cert) => {
    if (onToast) {
      onToast(`📄 Generating Official PDF for "${cert.title}"...`, 'info');
    }
    setTimeout(() => {
      if (onToast) {
        onToast(`🎉 Certificate downloaded: ${cert.credentialId}.pdf`, 'success');
      }
    }, 1200);
  };

  const filteredCerts = certificates.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans select-none pb-8">
      {/* Top Banner Header */}
      <div className="bg-slate-900/60 p-6 sm:p-8 rounded-[32px] border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] uppercase tracking-widest border border-amber-500/30 flex items-center gap-1.5">
              <Award size={14} />
              <span>Official Campus Certificate Center</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Event Certificates & Credentials
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            View, preview, and download authentic event certificates issued by CMRTC club coordinators and faculty leads.
          </p>
        </div>

        <div className="bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700 text-right space-y-0.5 w-full sm:w-auto">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Certificates</p>
          <p className="text-2xl font-black text-amber-400">{certificates.length} Verified</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search certificates by title, event, or club name..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {/* Certificates Cards Grid */}
      {filteredCerts.length === 0 ? (
        <div className="p-12 rounded-[32px] bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <Award size={36} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-slate-300">No Certificates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Certificates will automatically appear here once event coordinators and faculty verify your attendance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCerts.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[28px] bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between transition-all duration-300"
            >
              {/* Card Header Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-500/30">
                    {cert.clubName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                    <Calendar size={13} className="text-slate-500" />
                    <span>{cert.issueDate}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-white leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400/90">
                    Event: {cert.eventName}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1 text-xs text-slate-300">
                  <p className="text-[11px] font-mono text-slate-400">
                    Credential ID: <span className="text-slate-200 font-bold">{cert.credentialId}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>Verified by: <strong className="text-slate-200">{cert.verifiedBy}</strong></span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Preview & Download */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => handlePreview(cert)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Eye size={15} className="text-amber-400" />
                  <span>Preview Certificate</span>
                </button>

                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <Download size={15} />
                  <span>Download PDF</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        certificate={selectedCertificate}
        onDownload={(cert) => handleDownload(cert)}
      />
    </div>
  );
};

export default StudentCertificates;
