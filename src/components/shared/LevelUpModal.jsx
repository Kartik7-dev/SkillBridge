import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, X, ChevronRight } from 'lucide-react';
import { prefersReducedMotion } from '../../config/animations';

export default function LevelUpModal({ levelUpData, onClose }) {
  if (!levelUpData) return null;

  const isReduced = prefersReducedMotion();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex items-center justify-center p-4 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#171329]/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: isReduced ? 1 : 0.85, opacity: 0, y: isReduced ? 0 : 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: isReduced ? 1 : 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-7 text-center shadow-[0_25px_70px_rgba(124,58,237,0.35)] border border-[#E9E2F5] overflow-hidden z-10 space-y-5"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#C084FC]/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-[#9333EA]/20 to-[#EDE9FE]/20 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#FAF9FF] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Glowing Animated Icon Badge */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center mt-2">
            {!isReduced && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] blur-xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="absolute -inset-1 rounded-full border-2 border-dashed border-[#7C3AED]/40"
                />
              </>
            )}

            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] shadow-[0_10px_28px_rgba(124,58,237,0.45)] flex items-center justify-center text-white">
              <Trophy size={40} className="drop-shadow-md" />
            </div>
          </div>

          {/* Celebratory Text */}
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#DDD6FE] text-[#7C3AED] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} /> Level Up Achieved!
            </span>
            <h2 className="text-2xl font-heading font-extrabold text-[#171329] tracking-tight">
              Level {levelUpData.level}: {levelUpData.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6680] max-w-xs mx-auto leading-relaxed">
              Your mentorship activity unlocked a new campus reputation tier. Your rank on the leaderboard is soaring!
            </p>
          </div>

          {/* Level Stats Pill */}
          <div className="p-3.5 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] flex items-center justify-around text-xs">
            <div>
              <span className="text-[#6B6680] block text-[11px]">Total XP</span>
              <strong className="text-[#171329] font-bold text-sm">{levelUpData.currentXp} XP</strong>
            </div>
            <div className="h-6 w-px bg-[#E9E2F5]" />
            <div>
              <span className="text-[#6B6680] block text-[11px]">Rank Tier</span>
              <strong className="text-[#7C3AED] font-bold text-sm">Tier {levelUpData.level}</strong>
            </div>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={isReduced ? {} : { scale: 1.02 }}
            whileTap={isReduced ? {} : { scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-xs sm:text-sm font-semibold shadow-[0_6px_22px_rgba(124,58,237,0.35)] hover:shadow-[0_8px_28px_rgba(124,58,237,0.48)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Mentoring</span>
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
