import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, MessageSquare, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#FAF9FF] via-[#FAF9FF] to-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#7C3AED]/15 via-[#C084FC]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#8B5CF6]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C084FC]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
        {/* Left Side: Dramatic Editorial Story */}
        <div className="flex-1 text-center lg:text-left z-10">
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E9E2F5] shadow-[0_2px_12px_rgba(124,58,237,0.1)] text-xs font-semibold text-[#7C3AED] mb-6 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
            </span>
            <span className="tracking-wide">🚀 LIVE PEER-TO-PEER LEARNING</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-[68px] font-heading font-extrabold text-[#171329] leading-[1.08] tracking-tight"
          >
            Your next <br className="hidden sm:inline" />
            breakthrough is <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] bg-clip-text text-transparent">
              one peer away.
            </span>
          </motion.h1>

          {/* Supporting paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 text-lg sm:text-xl text-[#6B6680] leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans"
          >
            Get unstuck faster. Connect with students who know what you need, share your skills, and solve complex problems together—in real-time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link to="/dashboard">
              <Button size="lg" iconRight={ArrowRight} className="w-full sm:w-auto shadow-[0_10px_30px_rgba(124,58,237,0.4)]">
                Find Help Now
              </Button>
            </Link>
            <Link to="/dashboard/explore-doubts">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Become a Helper
              </Button>
            </Link>
          </motion.div>

          {/* Live Proof Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-11 pt-6 border-t border-[#E9E2F5]/80 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-xs font-medium text-[#6B6680]"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] ring-4 ring-[#A3E635]/20 animate-pulse" />
              <strong className="text-[#171329]">1,280+</strong> students online
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <strong className="text-[#171329]">4.9/5</strong> satisfaction score
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#7C3AED]" />
              <strong className="text-[#171329]">~8 min</strong> avg resolve time
            </span>
          </motion.div>
        </div>

        {/* Right Side: Floating Interactive Composition */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl min-h-[460px] hidden md:block">
          {/* Main Floating Doubt Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.25 }}
            className="absolute top-2 left-2 right-6 bg-white/95 rounded-3xl p-6 shadow-[0_20px_50px_rgba(91,33,182,0.12)] border border-[#E9E2F5] backdrop-blur-md z-20 animate-float-gentle"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Badge variant="urgent" size="sm">Urgent Priority</Badge>
                <span className="text-xs text-[#6B6680] flex items-center gap-1">
                  <Clock size={12} /> 4m ago
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_2px_10px_rgba(124,58,237,0.3)]">
                +45 pts bounty
              </span>
            </div>

            {/* Title & Body */}
            <h3 className="font-heading font-bold text-[#171329] text-base leading-snug">
              How to properly implement Red-Black Tree delete fixup rotations?
            </h3>
            <p className="mt-2 text-xs text-[#6B6680] line-clamp-2 leading-relaxed">
              Stuck when the sibling node is black with red children during deletion. Need a 15-min walkthrough of case 3 &amp; 4 rotations.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3.5">
              <Badge size="xs">DSA</Badge>
              <Badge size="xs">C++</Badge>
              <Badge size="xs">Algorithms</Badge>
              <span className="text-[10px] text-[#7C3AED] bg-[#F5F0FF] px-2 py-0.5 rounded-full border border-[#E9E2F5] font-semibold">
                15 min session
              </span>
            </div>

            {/* Bottom response status */}
            <div className="mt-4 pt-3.5 border-t border-[#E9E2F5] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#6B6680]">
                <MessageSquare size={14} className="text-[#7C3AED]" />
                <span><strong className="text-[#171329]">3 peers</strong> offered help</span>
              </div>
              <span className="text-xs font-semibold text-[#7C3AED] flex items-center gap-1 group">
                Help this student
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>

          {/* Floating Student Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.4 }}
            className="absolute top-52 right-0 w-72 bg-white/95 rounded-2xl p-4 shadow-[0_16px_40px_rgba(91,33,182,0.14)] border border-[#E9E2F5] backdrop-blur-md z-30 animate-float-reverse"
          >
            <div className="flex items-center gap-3">
              <Avatar
                initials="AS"
                name="Ananya Sharma"
                size="md"
                statusDot="online"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-heading font-bold text-sm text-[#171329] truncate">Ananya Sharma</p>
                  <CheckCircle2 size={14} className="text-[#7C3AED] shrink-0" />
                </div>
                <p className="text-xs text-[#6B6680] truncate">IIT Delhi &middot; 4th Year</p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E9E2F5] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-semibold text-[#171329]">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                4.95 (142 reviews)
              </span>
              <span className="text-[11px] font-semibold text-[#65A30D] bg-[#F7FEE7] px-2 py-0.5 rounded-full border border-[#ECFCCB]">
                Available now
              </span>
            </div>
          </motion.div>

          {/* Floating Skill Match Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.55 }}
            className="absolute top-44 -left-4 bg-white/90 rounded-2xl p-3 shadow-[0_12px_32px_rgba(124,58,237,0.18)] border border-[#E9E2F5] backdrop-blur-md z-30 flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[10px] text-[#6B6680] font-semibold uppercase tracking-wider">AI Skill Match</p>
              <p className="text-xs font-bold text-[#171329]">98% Match Score</p>
            </div>
          </motion.div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-10 -right-2 w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#C084FC] opacity-20 blur-md pointer-events-none" />
          <div className="absolute bottom-6 left-12 w-20 h-20 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#EDE9FE] opacity-40 blur-lg pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
