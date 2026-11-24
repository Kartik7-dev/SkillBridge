import { motion } from 'motion/react';

export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignment = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`max-w-3xl mb-12 sm:mb-16 ${alignment[align]} ${className}`}
    >
      {tag && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] shadow-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
          <span>{tag}</span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#171329] tracking-tight leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#6B6680] leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
