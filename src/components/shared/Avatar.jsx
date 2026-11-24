const gradientBgs = [
  'bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white',
  'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white',
  'bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] text-white',
  'bg-gradient-to-br from-[#6D28D9] to-[#9333EA] text-white',
  'bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] text-white',
];

function bgFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradientBgs[Math.abs(hash) % gradientBgs.length];
}

export default function Avatar({
  src,
  initials,
  name = '',
  size = 'md',
  className = '',
  statusDot,
  ring = true,
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-13 h-13 text-base font-bold',
    xl: 'w-18 h-18 text-xl font-bold',
  };

  const dotSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  const dotPositions = {
    sm: '-bottom-0.5 -right-0.5',
    md: '-bottom-0.5 -right-0.5',
    lg: 'bottom-0 right-0',
    xl: 'bottom-0.5 right-0.5',
  };

  const bg = bgFromName(name || initials || '');

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ${ring ? 'ring-2 ring-white shadow-xs' : ''}`}
        />
      ) : (
        <div
          className={`${sizes[size]} ${bg} rounded-full flex items-center justify-center font-heading font-semibold tracking-tight shadow-[0_4px_12px_rgba(124,58,237,0.2)] select-none ${ring ? 'ring-2 ring-white' : ''}`}
        >
          {initials ||
            (name
              ? name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'SB')}
        </div>
      )}

      {statusDot && (
        <span
          className={`absolute ${dotPositions[size] || dotPositions.md} ${
            dotSizes[size] || dotSizes.md
          } rounded-full ring-2 ring-white ${
            statusDot === 'online' || statusDot === true
              ? 'bg-[#A3E635]'
              : statusDot === 'busy'
              ? 'bg-[#F43F5E]'
              : 'bg-[#9CA3AF]'
          }`}
          title={statusDot === true ? 'Available' : statusDot}
        />
      )}
    </div>
  );
}
