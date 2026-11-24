import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { prefersReducedMotion } from '../../config/animations';

export default function XpFloatingCelebration({ celebration, onComplete }) {
  useEffect(() => {
    if (celebration && celebration.amount) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1900);
      return () => clearTimeout(timer);
    }
  }, [celebration, onComplete]);

  if (!celebration || !celebration.amount) return null;

  const isReduced = prefersReducedMotion();

  return (
    <div className="fixed top-20 right-6 sm:right-12 z-70 pointer-events-none select-none">
      <AnimatePresence>
        <motion.div
          key={celebration.id || celebration.amount}
          initial={{ opacity: 0, y: isReduced ? 0 : 20, scale: 0.8 }}
          animate={{ opacity: 1, y: isReduced ? 0 : -35, scale: 1.05 }}
          exit={{ opacity: 0, y: isReduced ? 0 : -60, scale: 0.95 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#9333EA] text-white shadow-[0_12px_32px_rgba(124,58,237,0.45)] border border-white/30 backdrop-blur-md"
        >
          <Sparkles size={16} className="text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="font-heading font-black text-sm tracking-wide">
            +{celebration.amount} XP
          </span>
          <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-full uppercase">
            Earned
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
