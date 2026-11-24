import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', linkTo = '/' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-base', box: 'w-7 h-7 rounded-lg' },
    md: { icon: 19, text: 'text-xl', box: 'w-9 h-9 rounded-xl' },
    lg: { icon: 22, text: 'text-2xl', box: 'w-11 h-11 rounded-2xl' },
  };

  const { icon, text, box } = sizes[size] || sizes.md;

  return (
    <Link to={linkTo} className="inline-flex items-center gap-2.5 group select-none">
      <div
        className={`flex items-center justify-center ${box} bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1`}
      >
        <Zap size={icon} strokeWidth={2.5} className="fill-white" />
      </div>
      <div className="flex items-baseline">
        <span className={`${text} font-heading font-extrabold text-[#171329] tracking-tight`}>
          Skill<span className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent">Bridge</span>
        </span>
      </div>
    </Link>
  );
}
