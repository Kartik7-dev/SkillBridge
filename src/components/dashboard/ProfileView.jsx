import {
  GraduationCap,
  Award,
  Video,
  HelpCircle,
  Calendar,
  TrendingUp,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Sparkles,
  CheckCircle2,
  Trophy,
  HandHeart,
} from 'lucide-react';
import { motion } from 'motion/react';
import AnimatedCounter from '../shared/AnimatedCounter';
import { useApp } from '../../context/AppContext';
import { getUserLevel, getEarnedBadges, BADGE_DEFINITIONS } from '../../config/gamification';

function StatBlock({ icon: Icon, value, label }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl border border-[#E9E2F5] p-5 sm:p-6 text-center shadow-[0_8px_24px_rgba(91,33,182,0.05)] hover:shadow-[0_16px_36px_rgba(124,58,237,0.1)] transition-all"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] border border-[#E9E2F5] flex items-center justify-center mx-auto mb-3 text-[#7C3AED]">
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <p className="text-3xl font-heading font-extrabold text-[#171329]">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-xs font-semibold text-[#6B6680] mt-1">{label}</p>
    </motion.div>
  );
}

export default function ProfileView() {
  const {
    currentUser,
    sessions,
    activeDoubtsCount,
    transactions,
    leaderboard,
    userAvailability,
    setUserAvailability,
  } = useApp();

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const userRankEntry = leaderboard?.find(
    (e) => e.name === currentUser?.fullName || e.isCurrentUser
  );
  const currentRank = userRankEntry ? userRankEntry.rank : currentUser?.rank || 4;

  const currentXp = currentUser?.xp || currentUser?.points || 280;
  const levelInfo = getUserLevel(currentXp);
  const earnedBadges = getEarnedBadges({
    sessionsCount: completedCount,
    doubtsSolved: completedCount,
    rating: 4.9,
  });

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));

  const badgeIconMap = {
    HandHeart: HandHeart,
    CheckCircle2: CheckCircle2,
    Zap: Zap,
    Award: Award,
    Trophy: Trophy,
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-7 animate-fade-in font-sans">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_12px_36px_rgba(91,33,182,0.06)] overflow-hidden">
        {/* Cover panel — Vibrant purple gradient */}
        <div className="h-36 bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#A855F7] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/25 text-xs font-bold text-white backdrop-blur-md">
            <Zap size={13} className="fill-white" />
            <span>Verified Peer Scholar</span>
          </div>
        </div>

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          {/* Avatar + name */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] ring-4 ring-white shadow-[0_8px_30px_rgba(124,58,237,0.35)] flex items-center justify-center">
              <span className="text-2xl font-heading font-extrabold text-white">{currentUser?.initials || 'KM'}</span>
            </div>
            <div className="flex-1 sm:pb-1">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171329]">{currentUser?.fullName || 'Kartik Mehta'}</h1>
              <div className="flex flex-wrap items-center gap-3.5 mt-1.5 text-xs sm:text-sm text-[#6B6680]">
                <span className="flex items-center gap-1 font-semibold text-[#171329]">
                  <GraduationCap size={15} className="text-[#7C3AED]" />
                  {currentUser?.college || 'IIT Bombay'}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Calendar size={15} className="text-[#7C3AED]" />
                  {currentUser?.year || '2nd Year'}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 text-[#7C3AED] font-bold">
                  <Award size={15} />
                  Rank #{currentRank}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Availability selector */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] text-xs">
                <button
                  onClick={() => setUserAvailability('available')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    userAvailability === 'available'
                      ? 'bg-white text-[#4D7C0F] shadow-xs border border-[#ECFCCB]'
                      : 'text-[#6B6680] hover:text-[#171329]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#A3E635]" />
                  <span>Available</span>
                </button>
                <button
                  onClick={() => setUserAvailability('busy')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    userAvailability === 'busy'
                      ? 'bg-white text-amber-700 shadow-xs border border-amber-200'
                      : 'text-[#6B6680] hover:text-[#171329]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Busy</span>
                </button>
                <button
                  onClick={() => setUserAvailability('offline')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    userAvailability === 'offline'
                      ? 'bg-white text-slate-700 shadow-xs border border-slate-200'
                      : 'text-[#6B6680] hover:text-[#171329]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Offline</span>
                </button>
              </div>
            </div>
          </div>

          {/* XP Progression Bar */}
          <div className="mt-6 pt-5 border-t border-[#E9E2F5]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#171329] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#7C3AED]" />
                Level {levelInfo.level} — <strong className="text-[#7C3AED]">{levelInfo.title}</strong> ({levelInfo.currentXp} XP &middot; {levelInfo.xpNeededForNext > 0 ? `${levelInfo.xpNeededForNext} XP to Level ${levelInfo.level + 1}` : 'Max Level Legend'})
              </span>
              <span className="text-[#7C3AED] font-bold">{levelInfo.progressPercent}% Progress</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#FAF9FF] border border-[#E9E2F5] overflow-hidden p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Badges Section */}
      <div className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_10px_30px_rgba(91,33,182,0.05)] p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E9E2F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center">
              <Trophy size={16} />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-[#171329]">Reputation Badges</h2>
              <p className="text-xs text-[#6B6680]">Verified milestones achieved through active mentorship</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F0FF] px-2.5 py-1 rounded-full border border-[#E9E2F5]">
            {earnedBadges.length} / {BADGE_DEFINITIONS.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const IconComponent = badgeIconMap[badge.icon] || Award;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEarned
                    ? 'bg-gradient-to-br from-[#FAF7FF] to-white border-[#7C3AED]/30 shadow-xs'
                    : 'bg-[#FAF9FF]/60 border-[#E9E2F5] opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isEarned
                        ? 'bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white shadow-xs'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-heading font-bold text-[#171329]">
                        {badge.name}
                      </h4>
                      {isEarned && (
                        <span className="text-[10px] font-bold text-[#4D7C0F] bg-[#F7FEE7] px-1.5 py-0.2 rounded-full border border-[#ECFCCB]">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B6680] leading-snug mt-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <StatBlock icon={Award} value={currentUser?.points || 280} label="Helping Points" />
        <StatBlock icon={Video} value={completedCount} label="Sessions Solved" />
        <StatBlock icon={HelpCircle} value={activeDoubtsCount} label="Active Doubts" />
        <StatBlock icon={TrendingUp} value={`#${currentRank}`} label="Leaderboard Rank" />
      </div>

      {/* Point Transaction / Reward History */}
      <div className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_10px_30px_rgba(91,33,182,0.05)] p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#E9E2F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center">
              <Coins size={16} />
            </div>
            <h2 className="text-base font-heading font-bold text-[#171329]">Bounty &amp; Point Ledger</h2>
          </div>
          <span className="text-xs text-[#7C3AED] font-semibold">Real-time reward records</span>
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="divide-y divide-[#E9E2F5]/70">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tx.type === 'earned'
                        ? 'bg-[#F7FEE7] text-[#4D7C0F] border border-[#ECFCCB]'
                        : 'bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]'
                    }`}
                  >
                    {tx.type === 'earned' ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-[#171329] text-xs sm:text-sm">{tx.description}</p>
                    <p className="text-[11px] text-[#6B6680]">{tx.time}</p>
                  </div>
                </div>

                <span
                  className={`font-bold px-3 py-1 rounded-full text-xs ${
                    tx.amount > 0
                      ? 'bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]'
                      : 'bg-[#FAF9FF] text-[#6B6680] border border-[#E9E2F5]'
                  }`}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6B6680] py-6 text-center">
            No transactions yet. Complete peer sessions to earn bounty points.
          </p>
        )}
      </div>
    </div>
  );
}
