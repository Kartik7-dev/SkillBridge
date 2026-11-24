import { motion } from 'motion/react';
import { prefersReducedMotion } from '../../config/animations';

export default function AmbientBackground() {
  const isReduced = prefersReducedMotion();

  if (isReduced) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#DDD6FE]/35 via-[#EDE9FE]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#C4B5FD]/25 via-[#FAF5FF]/10 to-transparent blur-3xl" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Orb 1: Top-Right Lavender / Purple Floating Glow */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -35, 15, 0],
          scale: [1, 1.08, 0.95, 1],
          opacity: [0.38, 0.48, 0.35, 0.38],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[-8%] right-[-6%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#7C3AED]/18 via-[#DDD6FE]/25 to-transparent blur-3xl"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Orb 2: Bottom-Left Soft Violet Glow */}
      <motion.div
        animate={{
          x: [0, -20, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.96, 1.06, 1],
          opacity: [0.28, 0.38, 0.25, 0.28],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-[-12%] left-[-8%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#8B5CF6]/15 via-[#EDE9FE]/20 to-transparent blur-3xl"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Orb 3: Center-Right Subtle Particle Halo */}
      <motion.div
        animate={{
          x: [0, 15, -20, 0],
          y: [0, 20, -15, 0],
          opacity: [0.15, 0.25, 0.18, 0.15],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute top-[40%] right-[15%] w-[380px] h-[380px] rounded-full bg-gradient-to-tl from-[#C084FC]/12 via-[#FAF5FF]/10 to-transparent blur-3xl"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
}
