import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import SectionHeading from '../shared/SectionHeading';
import { useApp } from '../../context/AppContext';

export default function LiveDoubtBoard() {
  const { doubts } = useApp();

  return (
    <section id="explore-doubts" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <SectionHeading
            tag="REAL-TIME"
            title="Live doubts feed."
            subtitle="Students asking for micro-mentorship right now. Claim a doubt to earn points and peer endorsements."
            align="left"
            className="mb-0"
          />
          <Link to="/dashboard/explore-doubts" className="mt-4 md:mt-0">
            <Button variant="secondary" size="sm" iconRight={ArrowRight}>
              Open Full Doubt Board
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {doubts.slice(0, 6).map((doubt, i) => {
            const isUrgent = doubt.urgency === 'high';
            return (
              <motion.div
                key={doubt.id}
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.07 }}
                whileHover={{ y: -5, scale: 1.015 }}
                className="bg-[#FAF9FF] rounded-3xl p-6 sm:p-7 border border-[#E9E2F5] shadow-[0_10px_30px_rgba(91,33,182,0.05)] hover:border-[#7C3AED]/40 hover:bg-white hover:shadow-[0_20px_48px_rgba(124,58,237,0.12)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        size="xs"
                        variant={isUrgent ? 'urgent' : 'default'}
                      >
                        {isUrgent ? '⚡ Urgent Priority' : 'Normal'}
                      </Badge>
                      {doubt.isUserCreated && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                          Yours
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-[#6B6680]">
                      <Clock size={12} />
                      {doubt.postedTime}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-heading font-bold text-[#171329] text-base mb-2 group-hover:text-[#7C3AED] transition-colors leading-snug">
                    {doubt.title}
                  </h3>
                  <p className="text-xs text-[#6B6680] line-clamp-2 leading-relaxed mb-4 font-sans">
                    {doubt.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {doubt.skills?.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium text-[#7C3AED] bg-white px-2.5 py-0.5 rounded-full border border-[#E9E2F5] shadow-xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-[#E9E2F5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#7C3AED] border border-[#E9E2F5] shadow-xs">
                      +{doubt.bounty || 20} pts
                    </span>
                    <span className="text-xs text-[#6B6680]">
                      {doubt.duration || '15 min'}
                    </span>
                  </div>

                  <Link
                    to="/dashboard/explore-doubts"
                    className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Help now
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
