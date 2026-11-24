import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { prefersReducedMotion } from '../../config/animations';

const variants = {
  primary:
    'bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-[0_6px_22px_rgba(124,58,237,0.32)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.45)] border border-white/20 font-semibold',
  secondary:
    'bg-white text-[#171329] border border-[#E9E2F5] shadow-xs hover:border-[#7C3AED]/50 hover:bg-[#F5F0FF] hover:text-[#7C3AED] font-semibold',
  outline:
    'bg-transparent text-[#7C3AED] border border-[#7C3AED]/40 hover:bg-[#F5F0FF] hover:border-[#7C3AED] font-medium',
  ghost:
    'bg-transparent text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] font-medium',
  glow:
    'bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_8px_30px_rgba(124,58,237,0.45)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.6)] font-semibold border border-white/25',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    iconRight: IconRight,
    ...props
  },
  ref,
) {
  const isReduced = prefersReducedMotion();

  return (
    <motion.button
      ref={ref}
      whileHover={isReduced ? {} : { scale: 1.02, y: -1.5 }}
      whileTap={isReduced ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={`inline-flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none tracking-tight ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0 transition-transform group-hover:translate-x-1" />}
    </motion.button>
  );
});

export default Button;
