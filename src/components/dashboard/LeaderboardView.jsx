import { Medal, Award, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import Avatar from '../shared/Avatar';
import AnimatedCounter from '../shared/AnimatedCounter';
import { useApp } from '../../context/AppContext';
import { getUserLevel } from '../../config/gamification';

function PodiumCard({ entry, place }) {
  const configs = {
    1: {
      height: 'h-40',
      badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md',
      icon: Crown,
      size: 'w-22 h-22',
      order: 'order-2',
      border: 'border-t-4 border-t-[#7C3AED]',
      podiumBg: 'bg-gradient-to-b from-[#EDE9FE] to-white',
    },
    2: {
      height: 'h-32',
      badgeBg: 'bg-gradient-to-r from-slate-300 to-slate-400 text-white',
      icon: Medal,
      size: 'w-18 h-18',
      order: 'order-1',
      border: 'border-t-4 border-t-[#8B5CF6]/50',
      podiumBg: 'bg-gradient-to-b from-[#F5F0FF] to-white',
    },
    3: {
      height: 'h-24',
      badgeBg: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
      icon: Award,
      size: 'w-18 h-18',
      order: 'order-3',
      border: 'border-t-4 border-t-[#C084FC]/50',
      podiumBg: 'bg-gradient-to-b from-[#FAF9FF] to-white',
    },
  };

  const config = configs[place];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: place * 0.1 }}
      className={`flex flex-col items-center ${config.order}`}
    >
      <div className="relative mb-3">
        <div className={`${config.size} rounded-full ring-4 ring-white overflow-hidden shadow-[0_8px_24px_rgba(124,58,237,0.25)] flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#A855F7]`}>
          <span className={`font-heading font-extrabold text-white ${place === 1 ? 'text-2xl' : 'text-xl'}`}>
            {entry.initials}
          </span>
        </div>
        <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 ${config.badgeBg} w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs`}>
          {place === 1 ? <Crown size={14} className="fill-white" /> : <Icon size={13} className="text-white" />}
        </div>
      </div>
      <h3 className={`font-heading font-bold text-[#171329] text-center mt-2 ${place === 1 ? 'text-base' : 'text-sm'}`}>
        {entry.name}
      </h3>
      <p className="text-xs font-bold text-[#7C3AED] mt-0.5">{entry.points} pts</p>
      <p className="text-[11px] text-[#6B6680]">{entry.sessions} solved</p>

      {/* Podium block */}
      <div
        className={`${config.height} w-28 sm:w-36 mt-4 rounded-t-3xl border border-[#E9E2F5] ${config.border} ${config.podiumBg} flex items-center justify-center shadow-xs`}
      >
        <span className="font-heading font-bold text-lg text-[#7C3AED]/40">#{place}</span>
      </div>
    </motion.div>
  );
}

export default function LeaderboardView() {
  const { leaderboard, currentUser } = useApp();
  const top3 = leaderboard.slice(0, 3);
  const userRankEntry = leaderboard.find(
    (e) => e.name === currentUser.fullName || e.isCurrentUser
  );
  const currentRank = userRankEntry ? userRankEntry.rank : currentUser.rank || 4;

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="border-b border-[#E9E2F5] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] mb-2">
          <span>Peer Reputation Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171329]">
          Community Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6680] mt-0.5">
          Top-ranked student micro-mentors recognized for response speed, rating consistency, and doubts solved.
        </p>
      </div>

      {/* Your rank banner */}
      <div className="bg-gradient-to-r from-[#F5F0FF] via-white to-[#EDE9FE] rounded-3xl p-6 border border-[#E9E2F5] shadow-[0_8px_24px_rgba(124,58,237,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={currentUser.initials} size="md" statusDot="online" />
          <div>
            <p className="text-xs font-semibold text-[#6B6680] uppercase tracking-wider">Your Standings</p>
            <p className="text-xl font-heading font-bold text-[#171329]">
              Rank #{currentRank}{' '}
              <span className="text-sm font-normal text-[#6B6680]">
                &middot; {currentUser.points} points
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4D7C0F] bg-[#F7FEE7] border border-[#ECFCCB] px-3.5 py-1.5 rounded-full">
          <TrendingUp size={14} />
          <span>Top 5% Helper</span>
        </div>
      </div>

      {/* Purple Podium */}
      {top3.length >= 3 && (
        <div className="bg-white rounded-3xl border border-[#E9E2F5] p-8 pt-10 shadow-[0_12px_36px_rgba(91,33,182,0.05)]">
          <div className="flex justify-center items-end gap-3 sm:gap-6">
            <PodiumCard entry={top3[1]} place={2} />
            <PodiumCard entry={top3[0]} place={1} />
            <PodiumCard entry={top3[2]} place={3} />
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E9E2F5] flex items-center justify-between bg-[#FAF9FF]">
          <h2 className="font-heading font-bold text-sm text-[#171329]">Live Peer Rankings</h2>
          <span className="text-xs text-[#7C3AED] font-semibold">Updated in real-time</span>
        </div>

        <div className="divide-y divide-[#E9E2F5]/70">
          {leaderboard.map((entry, idx) => {
            const isUser = entry.name === currentUser.fullName || entry.isCurrentUser;

            const rankBadge =
              entry.rank === 1 ? (
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Crown size={12} className="fill-white" />
                </span>
              ) : entry.rank === 2 ? (
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-slate-300 to-slate-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  2
                </span>
              ) : entry.rank === 3 ? (
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  3
                </span>
              ) : (
                <span className="text-sm font-bold text-[#9892AB] w-6 text-center">
                  #{entry.rank}
                </span>
              );

            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + idx * 0.04, duration: 0.28, ease: 'easeOut' }}
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${
                  isUser ? 'bg-[#F5F0FF]/60 font-medium' : 'hover:bg-[#FAF9FF]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {rankBadge}
                  <Avatar initials={entry.initials} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-heading font-bold text-[#171329]">
                        {entry.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B6680]">
                      {entry.college || 'Engineering Peer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm">
                  <span className="hidden sm:inline-block text-[#6B6680]">
                    {entry.sessions} solved
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9FF] text-[#7C3AED] border border-[#E9E2F5] hidden md:inline-block">
                    Level {getUserLevel(entry.points).level} {getUserLevel(entry.points).title}
                  </span>
                  <span className="font-bold text-[#7C3AED] px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5]">
                    <AnimatedCounter value={entry.points} suffix=" pts" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
