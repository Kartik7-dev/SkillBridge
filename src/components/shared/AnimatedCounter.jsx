import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '../../config/animations';

export default function AnimatedCounter({ value, duration = 800, prefix = '', suffix = '' }) {
  const numValue = Number(value) || 0;
  const isReduced = prefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(() => (isReduced ? numValue : 0));

  useEffect(() => {
    if (isReduced) {
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(easedProgress * numValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [numValue, duration, isReduced]);

  const output = isReduced ? numValue : displayValue;

  return (
    <span>
      {prefix}
      {output}
      {suffix}
    </span>
  );
}
