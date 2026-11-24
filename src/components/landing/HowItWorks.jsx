import { HelpCircle, Search, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import SectionHeading from '../shared/SectionHeading';

const steps = [
  {
    num: '01',
    title: 'Post your doubt',
    description:
      'Describe your problem, tag the relevant course or skill, and set a bounty points reward. Takes under 30 seconds.',
    icon: HelpCircle,
    color: 'from-[#7C3AED] to-[#9333EA]',
  },
  {
    num: '02',
    title: 'Find the right peer',
    description:
      'Browse verified peer helpers filtered by subject match, ratings, and university. Pick someone who just aced your exact problem.',
    icon: Search,
    color: 'from-[#5B21B6] to-[#7C3AED]',
  },
  {
    num: '03',
    title: 'Solve it together',
    description:
      'Jump into a live interactive session with screen share, solution notes, and live chat. Rate your mentor and transfer points.',
    icon: Users,
    color: 'from-[#8B5CF6] to-[#C084FC]',
    highlight: true,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FAF9FF] relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeading
          tag="WORKFLOW"
          title="Three steps from stuck to breakthrough."
          subtitle="SkillBridge eliminates the friction of waiting days for office hours. Connect directly with peer mentors who mastered the same curriculum."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.12 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`relative bg-white rounded-3xl p-8 border ${
                  step.highlight
                    ? 'border-[#7C3AED]/40 shadow-[0_16px_40px_rgba(124,58,237,0.12)]'
                    : 'border-[#E9E2F5] shadow-[0_12px_32px_rgba(91,33,182,0.06)]'
                } group transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top: Icon + Big Step Number */}
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-[0_6px_20px_rgba(124,58,237,0.3)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2`}
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>
                    <span className="font-heading font-extrabold text-5xl text-[#E9E2F5] group-hover:text-[#7C3AED]/20 transition-colors select-none">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-[#171329] mb-3 group-hover:text-[#7C3AED] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#6B6680] leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E9E2F5]/80 flex items-center justify-between text-xs font-semibold text-[#7C3AED]">
                  <span>Step {i + 1} of 3</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
