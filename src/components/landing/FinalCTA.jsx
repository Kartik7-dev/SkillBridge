import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '../shared/Button';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#FAF9FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#9333EA] px-8 py-16 sm:px-16 sm:py-20 text-center shadow-[0_24px_60px_rgba(91,33,182,0.35)]"
        >
          {/* Decorative glowing background orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#C084FC]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white mb-6 backdrop-blur-md">
              <Sparkles size={14} className="text-[#A3E635]" />
              <span>Join 12,000+ Students Learning Together</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-tight tracking-tight">
              Knowledge grows when it&rsquo;s shared.
            </h2>
            <p className="mt-5 text-base sm:text-xl text-[#EDE9FE] max-w-xl mx-auto font-sans leading-relaxed">
              Find your next breakthrough. Or help someone find theirs. Connect with motivated peers across top universities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-[#5B21B6] hover:bg-[#FAF9FF] hover:text-[#7C3AED] shadow-[0_10px_30px_rgba(0,0,0,0.15)] font-bold border-none"
                  iconRight={ArrowRight}
                >
                  Open SkillBridge
                </Button>
              </Link>
              <Link to="/dashboard/explore-doubts">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/40 hover:bg-white/10 hover:border-white"
                >
                  Explore Community
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
