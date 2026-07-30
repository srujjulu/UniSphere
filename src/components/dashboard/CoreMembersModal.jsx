import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';

const defaultCoreMembers = [
  { id: 'm1', name: 'M. Rajender', role: 'Faculty Advisor', category: 'Advisor' },
  { id: 'm2', name: 'Akshay', role: 'President', category: 'Executive' },
  { id: 'm3', name: 'Sreeja', role: 'Vice President', category: 'Executive' },
  { id: 'm4', name: 'Rohit', role: 'General Secretary', category: 'Executive' },
  { id: 'm5', name: 'Haripriya', role: 'Joint Secretary', category: 'Executive' },
  { id: 'm6', name: 'Sumanth', role: 'Treasurer', category: 'Finance' },
  { id: 'm7', name: 'Akshitha', role: 'Treasurer', category: 'Finance' },
  { id: 'm8', name: 'Mamatha', role: 'Public Relation Manager', category: 'PR' },
  { id: 'm9', name: 'Shyam', role: 'Public Relation Manager', category: 'PR' },
  { id: 'm10', name: 'Vivek', role: 'Technical Head', category: 'Tech' },
  { id: 'm11', name: 'Sankeerthana', role: 'Technical Co-Head', category: 'Tech' },
  { id: 'm12', name: 'Eshwar', role: 'Technical Co-Head', category: 'Tech' },
  { id: 'm13', name: 'Harinath', role: 'Logistics Head', category: 'Logistics' },
  { id: 'm14', name: 'Shrimanth', role: 'Logistics Co-Head', category: 'Logistics' },
  { id: 'm15', name: 'Saketh', role: 'Dance Head', category: 'Arts' },
  { id: 'm16', name: 'Sandhya', role: 'Dance Co-Head', category: 'Arts' },
  { id: 'm17', name: 'Akshith', role: 'Dance Co-Head', category: 'Arts' },
  { id: 'm18', name: 'Ritika', role: 'Singing Head', category: 'Music' },
  { id: 'm19', name: 'Yeshmitha', role: 'Singing Head', category: 'Music' },
  { id: 'm20', name: 'Nikhila', role: 'Arts & Cultural Head', category: 'Cultural' },
  { id: 'm21', name: 'Yashwanth', role: 'Arts & Cultural Head', category: 'Cultural' }
];

const CoreMembersModal = ({ isOpen, onClose, clubName = 'AKRITI Club', members = defaultCoreMembers }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[28px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-slate-900 my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center border border-red-100 shadow-sm">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{clubName} Core Team Members</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Meet the dedicated team leading {clubName} (2K26-27)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body Grid */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group hover:-translate-y-0.5"
                >
                  {/* Circle Avatar badge */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7A000A] via-[#881337] to-[#ED1C24] text-white font-black text-xl flex items-center justify-center border-2 border-slate-900 shadow-md mb-3 group-hover:scale-105 transition-transform">
                    {member.name.charAt(0)}
                  </div>

                  {/* Member Name */}
                  <h4 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                    {member.name}
                  </h4>

                  {/* Role Badge */}
                  <div className="mt-2.5 w-full">
                    <span className={`inline-block w-full py-1 px-2 rounded-md text-[10px] font-black uppercase tracking-wider text-center shadow-xs ${
                      member.role.toLowerCase().includes('advisor')
                        ? 'bg-slate-900 text-amber-300'
                        : member.role.toLowerCase().includes('president')
                        ? 'bg-[#881337] text-white'
                        : member.role.toLowerCase().includes('secretary')
                        ? 'bg-[#991B1B] text-white'
                        : member.role.toLowerCase().includes('head')
                        ? 'bg-[#B91C1C] text-white'
                        : 'bg-[#881337] text-white'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total <span className="font-bold text-slate-900">{members.length}</span> Core Members
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CoreMembersModal;
