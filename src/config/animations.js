/**
 * SkillBridge Centralized Animation Presets & Variants
 * Following standard UX principles:
 * - Micro-interactions: 150-200ms
 * - Transitions: 200-300ms
 * - Entrances: 350-500ms
 * - Celebrations: 1.2-1.8s
 * - Stagger: 50-80ms
 */

export const SPRINGS = {
  snappy: { type: 'spring', stiffness: 380, damping: 28 },
  gentle: { type: 'spring', stiffness: 220, damping: 24 },
  bouncy: { type: 'spring', stiffness: 450, damping: 20 },
  subtle: { type: 'spring', stiffness: 180, damping: 22 },
};

export const EASINGS = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  anticipate: [0.36, 0, 0.66, -0.56],
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Page Transition Variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: EASINGS.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : -6,
    transition: {
      duration: 0.18,
      ease: EASINGS.easeInOut,
    },
  },
};

// Stagger Container Variants
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : staggerChildren,
      delayChildren: prefersReducedMotion() ? 0 : delayChildren,
    },
  },
});

// Card & Item Entrance Variants
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion() ? 0 : 16,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: EASINGS.easeOut,
    },
  },
};

// Hover Lift & Press micro-interaction
export const cardHoverProps = prefersReducedMotion()
  ? {}
  : {
      whileHover: {
        y: -3,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      },
      whileTap: {
        scale: 0.99,
        transition: { duration: 0.1 },
      },
    };

export const buttonPressProps = prefersReducedMotion()
  ? {}
  : {
      whileHover: {
        scale: 1.02,
        transition: { duration: 0.15 },
      },
      whileTap: {
        scale: 0.97,
        transition: { duration: 0.1 },
      },
    };
