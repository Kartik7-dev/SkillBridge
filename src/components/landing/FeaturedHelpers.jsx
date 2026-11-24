import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { featuredHelpers } from '../../data/mockData';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import SectionHeading from '../shared/SectionHeading';

export default function FeaturedHelpers() {
  return (
    <section id="find-helpers" className="py-24 bg-[#FAF9FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          tag="TOP TALENT"
          title="Meet our verified peer helpers."
          subtitle="Top students from leading universities, recognized by their peers for quick, high-clarity micro-mentorship."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredHelpers.map((helper, i) => (
            <motion.div
              key={helper.id}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E9E2F5] shadow-[0_12px_36px_rgba(91,33,182,0.06)] hover:border-[#7C3AED]/40 hover:shadow-[0_20px_48px_rgba(124,58,237,0.14)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      initials={helper.initials}
                      name={helper.name}
                      size="lg"
                      statusDot={helper.available ? 'online' : 'busy'}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-[#171329] text-base group-hover:text-[#7C3AED] transition-colors">
                          {helper.name}
                        </h3>
                        <CheckCircle2 size={15} className="text-[#7C3AED] shrink-0" />
                      </div>
                      <p className="text-xs text-[#6B6680] mt-0.5">
                        {helper.college} &middot; {helper.year}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      helper.available
                        ? 'bg-[#F7FEE7] text-[#4D7C0F] border-[#ECFCCB]'
                        : 'bg-[#FAF9FF] text-[#6B6680] border-[#E9E2F5]'
                    }`}
                  >
                    {helper.available ? '● Available' : 'In Session'}
                  </span>
                </div>

                {/* Rating + Sessions Card */}
                <div className="grid grid-cols-2 gap-2 my-5 p-3.5 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] text-xs">
                  <div>
                    <span className="text-[#6B6680] block text-[11px] font-medium">Rating</span>
                    <span className="font-bold text-[#171329] flex items-center gap-1 mt-0.5">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      {helper.rating} ({helper.reviewsCount || 48})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B6680] block text-[11px] font-medium">Sessions</span>
                    <span className="font-bold text-[#171329] mt-0.5 block">
                      {helper.sessionsCompleted} solved
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {helper.skills.map((skill) => (
                    <Badge key={skill} size="xs" variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-[#E9E2F5] flex items-center justify-between">
                <span className="text-xs text-[#6B6680]">
                  Bounty rate: <strong className="text-[#7C3AED]">15–30 pts</strong>
                </span>
                <Link to="/dashboard/find-helpers">
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/dashboard/find-helpers">
            <Button size="md" iconRight={ArrowRight}>
              Explore All 350+ Student Helpers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
