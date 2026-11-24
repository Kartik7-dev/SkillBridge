import { useState } from 'react';
import { Star, X, CheckCircle2, Award, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Avatar from '../shared/Avatar';
import Button from '../shared/Button';

export default function FeedbackModal({ onCompleted }) {
  const { isFeedbackOpen, closeFeedbackModal, activeFeedbackSession, completeSession } = useApp();

  const [resolutionStatus, setResolutionStatus] = useState('resolved');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isFeedbackOpen || !activeFeedbackSession) return null;

  const ratingLabels = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Session',
    4: 'Very Helpful Mentor!',
    5: 'Exceptional Mentorship! 🌟',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      completeSession(activeFeedbackSession.id, {
        resolutionStatus,
        rating,
        feedback: feedback.trim() || 'Great session! Problem solved successfully.',
      });

      setIsSubmitting(false);
      closeFeedbackModal();
      if (onCompleted) onCompleted();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171329]/40 backdrop-blur-xs transition-opacity"
        onClick={closeFeedbackModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_24px_60px_rgba(91,33,182,0.22)] border border-[#E9E2F5] overflow-hidden z-10 animate-scale-in my-8">
        {/* Header banner */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-[#FAF7FF] via-[#F5F0FF] to-[#EDE9FE] border-b border-[#E9E2F5] text-center relative">
          <button
            onClick={closeFeedbackModal}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] shadow-[0_6px_20px_rgba(124,58,237,0.35)] flex items-center justify-center mx-auto mb-3 text-white">
            <Sparkles size={26} />
          </div>

          <h2 className="text-xl font-heading font-extrabold text-[#171329]">Session Completed!</h2>
          <p className="text-xs sm:text-sm text-[#6B6680] mt-1">
            How was your micro-mentorship experience for{' '}
            <span className="font-bold text-[#7C3AED]">&ldquo;{activeFeedbackSession.topic}&rdquo;</span>?
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Peer profile card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5]">
            <Avatar initials={activeFeedbackSession.helper?.initials || 'SB'} size="md" statusDot="online" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-heading font-bold text-[#171329]">
                {activeFeedbackSession.helper?.name}
              </p>
              <p className="text-xs text-[#6B6680]">
                {activeFeedbackSession.helper?.college} &middot; Mentor
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#6B6680] block font-semibold uppercase">Bounty Reward</span>
              <span className="text-xs font-bold text-[#7C3AED] px-2.5 py-0.5 rounded-full bg-white border border-[#E9E2F5] shadow-xs">
                +{activeFeedbackSession.bounty || 25} pts
              </span>
            </div>
          </div>

          {/* Resolution Outcome Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-2 text-center">
              Did this session solve your doubt?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setResolutionStatus('resolved')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  resolutionStatus === 'resolved'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
                    : 'bg-[#FAF9FF] text-[#6B6680] border-[#E9E2F5] hover:bg-[#F5F0FF]'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>Yes, Solved</span>
              </button>

              <button
                type="button"
                onClick={() => setResolutionStatus('partially-resolved')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  resolutionStatus === 'partially-resolved'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
                    : 'bg-[#FAF9FF] text-[#6B6680] border-[#E9E2F5] hover:bg-[#F5F0FF]'
                }`}
              >
                <AlertCircle size={16} />
                <span>Partially Solved</span>
              </button>

              <button
                type="button"
                onClick={() => setResolutionStatus('open')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  resolutionStatus === 'open'
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
                    : 'bg-[#FAF9FF] text-[#6B6680] border-[#E9E2F5] hover:bg-[#F5F0FF]'
                }`}
              >
                <HelpCircle size={16} />
                <span>Still Need Help</span>
              </button>
            </div>
          </div>

          {/* Star Rating Selection */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-2.5">
              Rate Mentor Performance
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 hover:scale-120 transition-transform cursor-pointer focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={
                        filled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-[#E9E2F5] fill-transparent'
                      }
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-bold text-[#7C3AED] h-4">
              {ratingLabels[hoverRating || rating]}
            </p>
          </div>

          {/* Feedback Comments */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171329] mb-1.5">
              Peer Endorsement / Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave a short note about how clear, quick, or helpful the explanation was..."
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E9E2F5] text-sm text-[#171329] placeholder-[#9892AB] focus:outline-none focus:border-[#7C3AED] bg-[#FAF9FF] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Reward confirmation alert */}
          <div className="p-3.5 rounded-2xl bg-[#F5F0FF] border border-[#E9E2F5] flex items-start gap-3 text-xs text-[#6B6680]">
            <Award size={18} className="text-[#7C3AED] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Submitting transfers <strong className="text-[#7C3AED]">+{activeFeedbackSession.bounty || 25} bounty pts</strong> to {activeFeedbackSession.helper?.name} and marks the doubt resolved on the community board.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#E9E2F5] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeFeedbackModal}
            >
              Skip For Now
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Finalizing Reward...' : 'Complete & Award Points'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
