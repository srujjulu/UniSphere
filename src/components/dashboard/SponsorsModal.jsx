import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Handshake, Heart, Sparkles, Mail } from 'lucide-react';

const clubSponsorsMap = {
  akriti: [
    {
      tierName: 'Title Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 's1', name: 'CMR Group of Institutions', label: 'Title Sponsor', desc: 'Main Campus Sponsor' },
        { id: 's2', name: 'Telangana Cultural Society', label: 'Cultural Partner', desc: 'Arts & Heritage' }
      ]
    },
    {
      tierName: 'Key Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 's3', name: 'Red FM 93.5', label: 'Radio & Media Partner' },
        { id: 's4', name: 'Beat & Bass Sound Systems', label: 'Audio & Stage Partner' },
        { id: 's5', name: 'Campus Pulse', label: 'Promotional Partner' }
      ]
    },
    {
      tierName: 'Community Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 's6', name: 'Cafe Coffee Day', label: 'Beverage Partner' },
        { id: 's7', name: 'PrintCraft Hyderabad', label: 'Merchandise & Print' }
      ]
    }
  ],
  codeholics: [
    {
      tierName: 'Tech Title Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 'c1', name: 'GitHub Education', label: 'Title Tech Sponsor', desc: 'Developer Tools' },
        { id: 'c2', name: 'Vercel Platform', label: 'Cloud & Hosting Partner', desc: 'Web Infrastructure' }
      ]
    },
    {
      tierName: 'Key Hackathon Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 'c3', name: 'JetBrains', label: 'IDE & Tools Partner' },
        { id: 'c4', name: 'Devfolio', label: 'Hackathon Platform Partner' },
        { id: 'c5', name: 'Postman', label: 'API & Dev Partner' }
      ]
    },
    {
      tierName: 'Learning Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 'c6', name: 'GeeksforGeeks', label: 'Coding Education Partner' },
        { id: 'c7', name: 'DigitalOcean', label: 'Cloud Credits Supporter' }
      ]
    }
  ],
  ncc: [
    {
      tierName: 'Military & Defense Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 'n1', name: '1(T) Bn NCC Unit', label: 'Battalion Sponsor', desc: 'Military Operations' },
        { id: 'n2', name: 'Indian Armed Forces Welfare', label: 'National Defense Partner' }
      ]
    },
    {
      tierName: 'Defense Electronics Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 'n3', name: 'Bharat Electronics (BEL)', label: 'Defense Equipment Partner' },
        { id: 'n4', name: 'Defense Pensioners Guild', label: 'Cadet Support Network' }
      ]
    },
    {
      tierName: 'Cadet Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 'n5', name: 'National Cadet Welfare Fund', label: 'Scholarship Supporter' },
        { id: 'n6', name: 'CMR Drill & Sports Academy', label: 'Parade Ground Supporter' }
      ]
    }
  ],
  photography: [
    {
      tierName: 'Media Title Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 'p1', name: 'Canon India', label: 'Title Camera Partner', desc: 'Imaging Systems' },
        { id: 'p2', name: 'Sony Alpha', label: 'Cinematography Sponsor', desc: 'Mirrorless Gear' }
      ]
    },
    {
      tierName: 'Key Gear & Software Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 'p3', name: 'Adobe Creative Cloud', label: 'Editing Software Partner' },
        { id: 'p4', name: 'DJI Drones', label: 'Aerial & Drone Partner' },
        { id: 'p5', name: 'Nikon School', label: 'Workshop Partner' }
      ]
    },
    {
      tierName: 'Studio Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 'p6', name: 'PrintStop Hyderabad', label: 'Photo Print Partner' },
        { id: 'p7', name: 'Sankalp Media Studios', label: 'Studio Space Supporter' }
      ]
    }
  ],
  lexis: [
    {
      tierName: 'Literary Title Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 'l1', name: 'United Nations Information Centre (UNIC)', label: 'Diplomacy Partner' },
        { id: 'l2', name: 'Oxford University Press', label: 'Literary & Publication Sponsor' }
      ]
    },
    {
      tierName: 'Key Debate Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 'l3', name: 'Hyderabad MUN Circuit', label: 'Conference Circuit Partner' },
        { id: 'l4', name: 'Crossword Bookstores', label: 'Book & Award Partner' }
      ]
    },
    {
      tierName: 'Oratory Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 'l5', name: 'The Hindu Youth Guild', label: 'Journalism Partner' },
        { id: 'l6', name: 'Express Debating Society', label: 'Speech Supporter' }
      ]
    }
  ],
  nss: [
    {
      tierName: 'Social Service Title Sponsors',
      tierBadge: 'Top Contributor',
      sponsors: [
        { id: 'ns1', name: 'Indian Red Cross Society', label: 'Title Health Partner', desc: 'Blood Drive Partner' },
        { id: 'ns2', name: 'Ministry of Youth Affairs', label: 'Youth Service Sponsor' }
      ]
    },
    {
      tierName: 'Key Community Partners',
      tierBadge: 'Official Partners',
      sponsors: [
        { id: 'ns3', name: 'Rotary International Hyderabad', label: 'Community Service Partner' },
        { id: 'ns4', name: 'Gandhi Memorial Trust', label: 'Social Welfare Partner' }
      ]
    },
    {
      tierName: 'Health Supporters',
      tierBadge: 'Event Supporters',
      sponsors: [
        { id: 'ns5', name: 'CMR Medical & Blood Bank', label: 'Health Camp Supporter' },
        { id: 'ns6', name: 'Swachh Telangana Foundation', label: 'Sanitation Supporter' }
      ]
    }
  ]
};

const SponsorsModal = ({ isOpen, onClose, clubName = 'AKRITI Club', clubId = 'akriti' }) => {
  if (!isOpen) return null;

  // Match club ID or normalized club name key
  const normalizedKey = (clubId || '').toLowerCase() || (clubName.toLowerCase().includes('code') ? 'codeholics' : clubName.toLowerCase().includes('ncc') ? 'ncc' : clubName.toLowerCase().includes('photo') ? 'photography' : clubName.toLowerCase().includes('lexis') ? 'lexis' : clubName.toLowerCase().includes('nss') ? 'nss' : 'akriti');
  const tiers = clubSponsorsMap[normalizedKey] || clubSponsorsMap.akriti;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[28px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-slate-900 my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center border border-red-100 shadow-sm">
                <Award size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Our Valued Sponsors</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Thank you to our amazing sponsors who make {clubName} events possible
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Sponsor Tiers (Ordered by Highest Contribution) */}
            {tiers.map((tier, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <div className={`w-1.5 h-5 rounded-full ${idx === 0 ? 'bg-[#ED1C24]' : idx === 1 ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    {tier.tierName}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">
                    {tier.tierBadge}
                  </span>
                </div>

                <div className={`grid ${idx === 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-3`}>
                  {tier.sponsors.map((sp) => (
                    <div
                      key={sp.id}
                      className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group cursor-pointer ${
                        idx === 0 ? 'p-5 bg-gradient-to-b from-red-50/30 to-white' : ''
                      }`}
                    >
                      {/* Handshake Icon Box */}
                      <div className={`rounded-2xl border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform ${
                        idx === 0
                          ? 'w-16 h-16 bg-red-50 text-[#ED1C24] border-red-200 shadow-sm'
                          : idx === 1
                          ? 'w-12 h-12 bg-amber-50 text-amber-600 border-amber-200'
                          : 'w-10 h-10 bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        <Handshake size={idx === 0 ? 28 : 20} />
                      </div>

                      {/* Sponsor Name */}
                      <h5 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                        {sp.name}
                      </h5>

                      {/* Sponsor Role / Label */}
                      <p className="text-[10px] font-medium text-slate-400 mt-1">
                        {sp.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Red Call-to-Action Sponsor Banner */}
            <div className="bg-gradient-to-br from-[#ED1C24] via-[#E11D48] to-[#C81E1E] rounded-2xl p-6 text-white text-center shadow-lg space-y-3">
              <h4 className="text-lg font-black tracking-tight">Become a Sponsor</h4>
              <p className="text-xs font-medium opacity-90 max-w-md mx-auto leading-relaxed">
                Partner with {clubName} and support student innovation while gaining visibility among 500+ talented students and event attendees.
              </p>
              <a
                href="mailto:sponsorships@cmrtc.ac.in?subject=Sponsorship%20Inquiry%20for%20CMRTC%20Club"
                className="inline-flex items-center gap-2 bg-white text-[#ED1C24] hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 mt-1"
              >
                <Mail size={15} />
                <span>Contact Us for Sponsorship</span>
              </a>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SponsorsModal;
