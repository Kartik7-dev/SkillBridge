import { useState, useEffect } from 'react';
import {
  X,
  Coins,
  Clock,
  Send,
  AlertCircle,
  HandHeart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import Badge from '../shared/Badge';

const timeSlots = [
  'Today, 4:00 PM — 4:45 PM',
  'Today, 6:00 PM — 6:30 PM',
  'Tomorrow, 11:00 AM — 11:45 AM',
  'Tomorrow, 3:00 PM — 3:45 PM',
];

export default function OfferHelpModal() {
  const {
    isOfferHelpOpen,
    closeOfferHelpModal,
    selectedDoubtForHelp,
    offerHelp,
  } = useApp();

  const [message, setMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedDoubtForHelp) {
      setMessage(
        `Hey ${selectedDoubtForHelp.postedBy}! I've worked extensively on ${
          selectedDoubtForHelp.skills?.[0] || 'this topic'
        } and would love to help you get this solved.`
      );
      setError('');
    }
  }, [selectedDoubtForHelp]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOfferHelpOpen) {
        closeOfferHelpModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOfferHelpOpen, closeOfferHelpModal]);

  if (!isOfferHelpOpen || !selectedDoubtForHelp) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please add a brief message for the student');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = offerHelp(
        selectedDoubtForHelp.id,
        message,
        selectedSlot
      );
      setIsSubmitting(false);
      if (success) {
        closeOfferHelpModal();
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171329]/40 backdrop-blur-xs transition-opacity"
        onClick={closeOfferHelpModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_24px_60px_rgba(91,33,182,0.22)] border border-[#E9E2F5] overflow-hidden z-10 animate-scale-in my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E9E2F5] bg-gradient-to-r from-[#FAF7FF] to-[#F5F0FF]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] shadow-[0_4px_14px_rgba(124,58,237,0.3)] flex items-center justify-center text-white">
              <HandHeart size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#171329]">
                Offer Assistance
              </h2>
              <p className="text-xs text-[#6B6680]">
                Send a mentorship proposal to solve this doubt together
              </p>
            </div>
          </div>
          <button
            onClick={closeOfferHelpModal}
            className="p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Doubt Summary Card */}
          <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#6B6680] font-semibold uppercase tracking-wider">
                Target Doubt
              </span>
              <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#E9E2F5]">
                <Coins size={13} className="text-[#7C3AED]" />
                +{selectedDoubtForHelp.bounty} pts
              </span>
            </div>
            <h3 className="text-sm font-heading font-bold text-[#171329] line-clamp-1 mb-1.5">
              {selectedDoubtForHelp.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedDoubtForHelp.skills?.map((s) => (
                <Badge key={s} size="xs" variant="default">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Introduction &amp; Solution Approach <span className="text-[#E11D48]">*</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError('');
              }}
              placeholder="Tell the student how you can help them break through this roadblock..."
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] bg-[#FAF9FF] focus:bg-white transition-all ${
                error ? 'border-[#E11D48] bg-[#FFF1F2]' : 'border-[#E9E2F5]'
              }`}
            />
            {error && (
              <p className="text-xs text-[#E11D48] mt-1 flex items-center gap-1">
                <AlertCircle size={13} /> {error}
              </p>
            )}
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Available Time Window
            </label>
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all ${
                    selectedSlot === slot
                      ? 'border-[#7C3AED] bg-[#F5F0FF] text-[#7C3AED] font-bold shadow-xs'
                      : 'border-[#E9E2F5] bg-white text-[#6B6680] hover:text-[#171329]'
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    checked={selectedSlot === slot}
                    onChange={() => setSelectedSlot(slot)}
                    className="accent-[#7C3AED]"
                  />
                  <Clock size={14} className="text-[#7C3AED]" />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E9E2F5] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeOfferHelpModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
              icon={Send}
            >
              {isSubmitting ? 'Sending Proposal...' : 'Send Help Offer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
