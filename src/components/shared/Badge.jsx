export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]',
    primary: 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)] font-semibold',
    secondary: 'bg-white text-[#6B6680] border border-[#E9E2F5]',
    urgent: 'bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6] font-semibold',
    danger: 'bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6] font-semibold',
    success: 'bg-[#F7FEE7] text-[#4D7C0F] border border-[#ECFCCB] font-semibold',
    warning: 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] font-semibold',
    dark: 'bg-[#171329] text-white',
    outline: 'border border-[#E9E2F5] text-[#6B6680] bg-white/80',
    glass: 'bg-white/80 backdrop-blur-md text-[#7C3AED] border border-white/60 shadow-xs',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] leading-tight font-medium',
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-tight whitespace-nowrap transition-all duration-200 ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
