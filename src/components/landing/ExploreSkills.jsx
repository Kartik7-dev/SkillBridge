import {
  Code2,
  GitBranch,
  Calculator,
  PenTool,
  Cpu,
  Palette,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { skillCategories } from '../../data/mockData';
import SectionHeading from '../shared/SectionHeading';

const iconMap = {
  Code2,
  GitBranch,
  Calculator,
  PenTool,
  Cpu,
  Palette,
  GraduationCap,
};

export default function ExploreSkills() {
  return (
    <section id="explore-skills" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          tag="DISCOVERY"
          title="Explore doubts by subject area."
          subtitle="From algorithmic proofs to circuit analysis, UI design and calculus, find active peer mentors ready to pair."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {skillCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Code2;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ type: 'spring', stiffness: 240, damping: 22, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link
                  to="/dashboard/explore-doubts"
                  className="group bg-[#FAF9FF] rounded-2xl p-6 border border-[#E9E2F5] hover:border-[#7C3AED]/40 hover:bg-white hover:shadow-[0_16px_36px_rgba(124,58,237,0.12)] transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E9E2F5] shadow-xs flex items-center justify-center text-[#7C3AED] group-hover:bg-gradient-to-br group-hover:from-[#7C3AED] group-hover:to-[#9333EA] group-hover:text-white transition-all duration-300">
                        <Icon size={22} strokeWidth={2.2} />
                      </div>
                      <ArrowRight size={16} className="text-[#6B6680] group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-1" />
                    </div>

                    <h3 className="font-heading font-bold text-[#171329] text-base mb-1.5 group-hover:text-[#7C3AED] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#6B6680] line-clamp-2 leading-relaxed mb-4 font-sans">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E9E2F5]/80 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#6B6680]">{cat.helpersCount} helpers</span>
                    <span className="text-[#7C3AED] bg-[#F5F0FF] px-2 py-0.5 rounded-full border border-[#E9E2F5]">
                      {cat.doubtsCount} active
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
