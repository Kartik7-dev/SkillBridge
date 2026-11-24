import { Users, CheckCircle2, Video, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { impactStats } from '../../data/mockData';

const iconMap = {
  Users,
  CheckCircle2,
  Video,
  Sparkles,
};

export default function ImpactStats() {
  return (
    <section className="py-12 bg-transparent relative z-20 -mt-8 sm:-mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="bg-white/85 rounded-3xl p-6 sm:p-8 border border-[#E9E2F5] shadow-[0_20px_50px_rgba(91,33,182,0.08)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E9E2F5]/80">
            {impactStats.map((stat, i) => {
              const Icon = iconMap[stat.icon] || Sparkles;
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                    i > 0 ? 'pt-6 sm:pt-0 sm:pl-8' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mb-3.5 shadow-xs border border-[#E9E2F5]">
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <p className="text-3xl sm:text-4xl font-heading font-extrabold text-[#171329] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[#6B6680]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
