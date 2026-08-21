import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Eye, Download, ShieldCheck, Sparkles, Calendar, Building2, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentCertificates } from '../../utils/mockCertificates';
import { downloadCertificatePDF } from '../../utils/pdfGenerator';
import CertificatePreviewModal from './CertificatePreviewModal';

const StudentCertificates = ({ onToast }) => {
  const { user } = useAuth();
  const studentRoll = user?.rollNumber || user?.rollNo || (user?.email ? user.email.split('@')[0].toUpperCase() : '237R1A05BA');
  const studentName = user?.name || 'Student Member';

  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync certificates dynamically
  useEffect(() => {
    const loadCerts = () => {
      const studentCerts = getStudentCertificates(studentRoll, studentName).map(cert => ({
        ...cert,
        studentName: studentName,
        studentRoll: studentRoll
      }));
      setCertificates(studentCerts);
    };
    loadCerts();
    window.addEventListener('storage', loadCerts);
    return () => window.removeEventListener('storage', loadCerts);
  }, [studentRoll, studentName]);

  const handlePreview = (cert) => {
    setSelectedCertificate({
      ...cert,
      studentName: studentName,
      studentRoll: studentRoll
    });
    setIsPreviewOpen(true);
  };

  const handleDownload = (cert) => {
    const certWithStudent = {
      ...cert,
      studentName: studentName,
      studentRoll: studentRoll
    };
    if (onToast) {
      onToast(`📄 Generating Official PDF for "${cert.title}"...`, 'info');
    }
    const result = downloadCertificatePDF(certWithStudent, user);
    if (result.success && onToast) {
      setTimeout(() => {
        onToast(`🎉 Certificate downloaded: ${result.filename}`, 'success');
      }, 500);
    }
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
        <div className="p-12 rounded-[32px] bg-slate-900/60 border border-slate-800 text-center space-y-3 shadow-xl">
          <Award size={40} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-slate-200">No Certificates Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Certificates will automatically appear here once event coordinators and faculty verify your attendance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {filteredCerts.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[28px] bg-slate-900 border border-slate-800 hover:border-amber-500/40 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between h-full transition-all duration-300"
            >
              {/* Card Header Info */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider border border-amber-500/30">
                    {cert.clubName}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{cert.issueDate}</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="text-lg font-extrabold text-white leading-snug tracking-tight">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>Event:</span>
                    <span className="text-slate-200 font-medium">{cert.eventName}</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 font-medium">Credential ID</span>
                    <span className="text-[11px] font-mono text-slate-200 font-bold bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {cert.credentialId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/50">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span>Verified by</span>
                    </span>
                    <strong className="text-[11px] text-emerald-400 font-bold">{cert.verifiedBy}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Preview & Download */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => handlePreview(cert)}
                  className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs cursor-pointer transition-colors border border-slate-700 flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Eye size={14} className="text-amber-400" />
                  <span>Preview Certificate</span>
                </button>

                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Download size={14} />
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
