import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
const seatNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

// All seats available by default
const occupiedSeats = [];

const MoviePromotionsModal = ({ isOpen, onClose, onBookSuccess }) => {
  const [movieName, setMovieName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return;

    setIsBooked(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });

    if (onBookSuccess) {
      onBookSuccess(selectedSeats, movieName);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[28px] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-slate-900 my-auto"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center border border-red-100 shadow-sm">
                <Film size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Movie Promotions</span>
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Book your seats for upcoming movie promotions at the auditorium
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
            {isBooked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Seats Reserved Successfully!</h4>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
                  You have booked <span className="font-bold text-[#ED1C24]">{selectedSeats.length} seat(s)</span> ({selectedSeats.join(', ')}) for <strong className="text-slate-800">{movieName}</strong> at CMRTC Auditorium.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto text-xs space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Date:</span>
                    <span className="font-bold text-slate-800">{date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Time:</span>
                    <span className="font-bold text-slate-800">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Venue:</span>
                    <span className="font-bold text-slate-800">CMRTC Main Auditorium</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsBooked(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95 mt-4"
                >
                  Done & Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Form Fields: Movie Name, Date, Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Movie Name */}
                  <div className="sm:col-span-1 space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Movie Name
                    </label>
                    <input
                      type="text"
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                      placeholder="Enter movie name"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="04:00 PM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Seating Layout Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Your Seats
                    </h4>
                    <span className="text-xs font-semibold text-slate-500">
                      {selectedSeats.length} seat(s) selected
                    </span>
                  </div>

                  {/* Screen Representation */}
                  <div className="w-full max-w-sm mx-auto text-center my-2">
                    <div className="bg-slate-200/80 text-slate-600 font-bold px-8 py-1.5 rounded-t-full text-[10px] tracking-[0.2em] uppercase shadow-inner mx-auto w-48 border border-slate-300">
                      SCREEN
                    </div>
                  </div>

                  {/* Interactive Seat Grid Container */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 max-h-64 overflow-auto shadow-inner">
                    <div className="flex flex-col gap-2 min-w-[550px]">
                      {rows.map((row) => (
                        <div key={row} className="flex items-center gap-2">
                          <span className="w-5 text-center text-xs font-bold text-slate-400">
                            {row}
                          </span>
                          
                          {/* Seats 1..10 */}
                          <div className="flex items-center gap-1.5 flex-1 justify-end">
                            {seatNumbers.slice(0, 10).map((num) => {
                              const seatId = `${row}${num}`;
                              const isOccupied = occupiedSeats.includes(seatId);
                              const isSelected = selectedSeats.includes(seatId);

                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  disabled={isOccupied}
                                  onClick={() => toggleSeat(seatId)}
                                  className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                    isOccupied
                                      ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-[#ED1C24] text-white border border-red-600 shadow-md scale-110'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:border-red-400 hover:bg-red-50'
                                  }`}
                                  title={isOccupied ? `Seat ${seatId} (Booked)` : `Seat ${seatId}`}
                                >
                                  {num}
                                </button>
                              );
                            })}
                          </div>

                          {/* Center Aisle Spacer */}
                          <div className="w-6 text-center text-[10px] font-bold text-slate-300">|</div>

                          {/* Seats 11..20 */}
                          <div className="flex items-center gap-1.5 flex-1 justify-start">
                            {seatNumbers.slice(10, 20).map((num) => {
                              const seatId = `${row}${num}`;
                              const isOccupied = occupiedSeats.includes(seatId);
                              const isSelected = selectedSeats.includes(seatId);

                              return (
                                <button
                                  key={seatId}
                                  type="button"
                                  disabled={isOccupied}
                                  onClick={() => toggleSeat(seatId)}
                                  className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                                    isOccupied
                                      ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-[#ED1C24] text-white border border-red-600 shadow-md scale-110'
                                      : 'bg-white text-slate-600 border border-slate-200 hover:border-red-400 hover:bg-red-50'
                                  }`}
                                  title={isOccupied ? `Seat ${seatId} (Booked)` : `Seat ${seatId}`}
                                >
                                  {num}
                                </button>
                              );
                            })}
                          </div>

                          <span className="w-5 text-center text-xs font-bold text-slate-400">
                            {row}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seat Status Legend */}
                  <div className="flex items-center justify-center gap-6 pt-1 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-white border border-slate-300 shadow-sm" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#ED1C24] border border-red-600 shadow-sm" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300" />
                      <span>Booked</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">Seats: </span>
                    <span className="font-bold text-slate-800">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={selectedSeats.length === 0}
                      onClick={handleBooking}
                      className="px-6 py-2.5 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer transition-all active:scale-95"
                    >
                      Book Seats
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MoviePromotionsModal;
