// Reusable Motion Variants for SkillBridge Purple / Lavender UI

export const popIn = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: custom * 0.08,
    },
  }),
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 24,
      delay: custom * 0.08,
    },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const cardHoverProps = {
  whileHover: {
    y: -6,
    scale: 1.015,
    transition: { type: 'spring', stiffness: 350, damping: 22 },
  },
  whileTap: { scale: 0.985 },
};

export const buttonMotionProps = {
  whileHover: {
    scale: 1.03,
    y: -2,
    transition: { type: 'spring', stiffness: 400, damping: 18 },
  },
  whileTap: { scale: 0.96 },
};
