import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, ThumbsUp } from 'lucide-react';
import { 
  hasStudentSubmittedFeedback, 
  saveEventFeedback, 
  getEventFeedbackSummary 
} from '../../utils/mockEventFeedback';

const EventFeedbackModal = ({ 
  isOpen, 
  onClose, 
  event, 
  studentRoll = '237R1A05BA', 
  studentName = 'Student Member',
  onToast 
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  // Check if student already submitted feedback
  useEffect(() => {
    if (!event) return;
    const alreadySubmitted = hasStudentSubmittedFeedback(event.id, studentRoll);
    setIsSubmitted(alreadySubmitted);
    if (alreadySubmitted) {
      const summary = getEventFeedbackSummary(event.id);
      const match = summary.feedbackList.find(r => r.rollNo.toUpperCase() === studentRoll.toUpperCase());
      setExistingReview(match);
    }
  }, [event?.id, studentRoll, event]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = saveEventFeedback({
      eventId: event.id,
      eventTitle: event.title,
      clubId: event.clubId,
      clubName: event.clubName,
      rating,
      comment,
      studentRoll,
      studentName
    });

    if (res.success) {
      setIsSubmitted(true);
      setExistingReview(res.newReview);
      if (onToast) {
        onToast(`⭐ Feedback submitted for "${event.title}"! Thank you for rating.`, 'success');
      }
    } else {
      if (onToast) {
        onToast(res.message, 'warning');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden text-slate-100 select-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              <span className="font-extrabold text-sm tracking-wide text-white">
                Student Event Feedback System
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
            <div className="space-y-1 text-center">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-500/30">
                {event.clubName}
              </span>
              <h3 className="text-2xl font-black text-white">{event.title}</h3>
              <p className="text-xs text-slate-400">Share your experience and help improve upcoming campus club events.</p>
            </div>

            {isSubmitted ? (
              /* Already Submitted View */
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-500/30">
                    Feedback Submitted ✓
                  </span>
                  <h4 className="text-base font-extrabold text-white pt-2">Thank you for your rating!</h4>
                  <p className="text-xs text-slate-400">Multiple submissions are not allowed for the same event.</p>
                </div>

                {existingReview && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < existingReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{existingReview.date}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium italic">"{existingReview.comment}"</p>
                  </div>
                )}
              </div>
            ) : (
              /* Form Submission View */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                
                {/* 1. Star Rating Selector */}
                <div className="space-y-2 text-center">
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                    Rate Event Quality (1 to 5 Stars) *
                  </label>
                  
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform duration-150 hover:scale-125 focus:outline-none"
                      >
                        <Star 
                          size={32} 
                          className={
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                              : 'text-slate-700'
                          } 
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-extrabold text-amber-400 font-mono">
                    {hoverRating || rating} / 5 Stars
                  </p>
                </div>

                {/* 2. Feedback Comment Textarea */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Feedback & Comments *
                  </label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="What did you enjoy most about this event? Any suggestions for improvement?"
                    className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all resize-none"
                  />
                </div>

                {/* 3. Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Submit Official Event Feedback</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Verified Student Review • {studentRoll}</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventFeedbackModal;
