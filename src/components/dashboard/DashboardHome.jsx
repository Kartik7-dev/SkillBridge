import {
  HelpCircle,
  Video,
  Award,
  Users,
  Plus,
  Star,
  ArrowUpRight,
  MessageSquare,
  Clock,
  Sparkles,
  TrendingUp,
  HandHeart,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import Avatar from '../shared/Avatar';
import AnimatedCounter from '../shared/AnimatedCounter';
import { featuredHelpers } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function DashboardHome() {
  const {
    doubts,
    currentUser,
    activeDoubtsCount,
    sessions,
    helpOffers,
    respondToOffer,
    openPostDoubtModal,
    openOfferHelpModal,
    openSmartMatchModal,
  } = useApp();

  const pendingIncomingRequests = helpOffers.filter(
    (o) => o.status === 'pending'
  );

  const completedSessionsCount = sessions.filter(
    (s) => s.status === 'completed'
  ).length;

  const dynamicStats = [
    {
      label: 'Active Doubts',
      value: activeDoubtsCount,
      change: '+1 today',
      icon: HelpCircle,
      gradient: 'from-[#FAF7FF] to-[#F3EDFF]',
    },
    {
      label: 'Sessions Solved',
      value: completedSessionsCount,
      change: '+2 this week',
      icon: Video,
      gradient: 'from-[#FAF7FF] to-[#EDE9FE]',
    },
    {
      label: 'Bounty Points',
      value: currentUser?.points || 280,
      change: '+45 this week',
      icon: Award,
      gradient: 'from-[#FAF7FF] to-[#E6D8FF]',
      isPoints: true,
    },
    {
      label: 'Online Mentors',
      value: 52,
      change: 'in your courses',
      icon: Users,
      gradient: 'from-[#FAF7FF] to-[#F5F0FF]',
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
      {/* Light Lavender Hero Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative bg-gradient-to-br from-[#F5F0FF] via-white to-[#EDE9FE] rounded-3xl p-7 sm:p-9 border border-[#E9E2F5] shadow-[0_16px_40px_rgba(124,58,237,0.08)] overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#7C3AED]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] mb-3.5 shadow-xs">
              <Zap size={13} className="fill-[#7C3AED]" />
              <span>Workspace Active &middot; {currentUser?.college || 'IIT Bombay'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#171329] tracking-tight leading-tight">
              Hey {currentUser?.name || 'Kartik'}, what are we solving today?
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-[#6B6680] leading-relaxed">
              You have <span className="font-bold text-[#7C3AED]">{activeDoubtsCount} open doubts</span> on the board and{' '}
              <span className="font-bold text-[#171329]">52 peer mentors</span> currently online in your subjects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              size="md"
              onClick={openPostDoubtModal}
              icon={Plus}
              className="shadow-[0_8px_24px_rgba(124,58,237,0.35)]"
            >
              Post a Doubt
            </Button>
            <Link to="/dashboard/find-helpers">
              <Button
                variant="secondary"
                size="md"
              >
                Find Helper
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Live / Upcoming Session Quick Banner */}
      {sessions.some((s) => s.status === 'in-progress' || s.status === 'upcoming') && (
        (() => {
          const liveSession =
            sessions.find((s) => s.status === 'in-progress') ||
            sessions.find((s) => s.status === 'upcoming');
          const isLive = liveSession.status === 'in-progress';
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-5 border border-[#E9E2F5] shadow-[0_10px_30px_rgba(124,58,237,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isLive
                      ? 'bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] animate-pulse'
                      : 'bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]'
                  }`}
                >
                  <Video size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isLive
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent'
                          : 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5]'
                      }`}
                    >
                      {isLive ? 'Live Session Now' : 'Scheduled Today'}
                    </span>
                    <span className="text-xs text-[#6B6680]">{liveSession.time}</span>
                  </div>
                  <h3 className="text-sm font-heading font-bold text-[#171329] mt-0.5">{liveSession.topic}</h3>
                </div>
              </div>
              <Link
                to={`/session/${liveSession.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white font-semibold text-xs shadow-[0_6px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_26px_rgba(124,58,237,0.45)] transition-all shrink-0 cursor-pointer"
              >
                <Video size={15} />
                {isLive ? 'Resume Session Room' : 'Join Session Room'}
              </Link>
            </motion.div>
          );
        })()
      )}

      {/* Pending Incoming Mentorship Requests Banner */}
      {pendingIncomingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FAF7FF] via-[#F5F0FF] to-[#EDE9FE] rounded-3xl p-5 border border-[#7C3AED]/30 shadow-[0_10px_30px_rgba(124,58,237,0.1)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-ping" />
              <h3 className="font-heading font-bold text-sm text-[#171329]">
                Action Required: {pendingIncomingRequests.length} Pending Peer Help {pendingIncomingRequests.length === 1 ? 'Request' : 'Requests'}
              </h3>
            </div>
            <Link
              to="/dashboard/my-sessions"
              className="text-xs font-bold text-[#7C3AED] hover:underline"
            >
              View in My Sessions &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingIncomingRequests.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-4 border border-[#E9E2F5] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#171329] truncate">{req.studentName || 'Student'}</span>
                    <span className="text-[#7C3AED] font-semibold bg-[#F5F0FF] px-2 py-0.5 rounded-full text-[10px]">
                      +{req.bounty || 25} pts
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6680] truncate mt-0.5 font-medium">{req.doubtTitle}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => respondToOffer(req.id, 'accepted')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToOffer(req.id, 'rejected')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#6B6680] hover:text-[#E11D48] hover:bg-[#FFF1F2] border border-[#E9E2F5] transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dynamicStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.015 }}
              className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-5 sm:p-6 border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E9E2F5] shadow-xs flex items-center justify-center text-[#7C3AED]">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4D7C0F] bg-[#F7FEE7] px-2 py-0.5 rounded-full border border-[#ECFCCB]">
                  <TrendingUp size={11} />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-heading font-extrabold text-[#171329] tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-xs font-semibold text-[#6B6680] mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended Helpers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#171329]">Recommended Helpers</h2>
            <p className="text-xs text-[#6B6680]">Peers who match your enrolled course topics</p>
          </div>
          <Link
            to="/dashboard/find-helpers"
            className="text-xs font-semibold text-[#7C3AED] hover:text-[#5B21B6] flex items-center gap-1 transition-colors"
          >
            View All Helpers <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {featuredHelpers.map((helper, i) => (
            <motion.div
              key={helper.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: 'easeOut' }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-5 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] hover:border-[#7C3AED]/40 transition-all duration-200 min-w-[280px] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3 mb-3.5">
                  <Avatar initials={helper.initials} size="md" statusDot={helper.available ? 'online' : 'busy'} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-heading font-bold text-[#171329] truncate group-hover:text-[#7C3AED] transition-colors">{helper.name}</h4>
                    <p className="text-xs text-[#6B6680] truncate">{helper.college} &middot; {helper.year}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5] px-2 py-0.5 rounded-full text-xs font-bold">
                    <Sparkles size={11} />
                    <span>{helper.matchScore}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {helper.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} size="xs" variant="default">{skill}</Badge>
                  ))}
                  {helper.skills.length > 3 && (
                    <span className="text-[10px] text-[#6B6680] bg-[#FAF9FF] px-2 py-0.5 rounded-full border border-[#E9E2F5]">
                      +{helper.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E9E2F5] text-xs">
                <div className="flex items-center gap-2 text-[#6B6680]">
                  <span className="flex items-center gap-0.5 text-[#171329] font-bold">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {helper.rating}
                  </span>
                  <span>&middot;</span>
                  <span>{helper.sessions} solved</span>
                </div>
                <Link
                  to="/dashboard/find-helpers"
                  className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-0.5"
                >
                  Connect <ArrowUpRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Doubts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-heading font-bold text-[#171329]">Recent Doubts</h2>
            <p className="text-xs text-[#6B6680]">Solve peer problems and earn bounty points</p>
          </div>
          <Link
            to="/dashboard/explore-doubts"
            className="text-xs font-semibold text-[#7C3AED] hover:text-[#5B21B6] flex items-center gap-1 transition-colors"
          >
            Browse All Doubts <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doubts.slice(0, 6).map((doubt, i) => {
            const isOwnDoubt =
              doubt.postedBy === currentUser?.fullName ||
              doubt.postedBy === currentUser?.name ||
              doubt.postedBy === 'Kartik M.';

            const isUrgent = doubt.urgency === 'high';

            return (
              <motion.div
                key={doubt.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.35, ease: 'easeOut' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-5 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] hover:border-[#7C3AED]/40 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge
                        size="xs"
                        variant={isUrgent ? 'urgent' : 'default'}
                      >
                        {isUrgent ? '⚡ Urgent' : 'Normal'}
                      </Badge>
                      {isOwnDoubt && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                          Your Doubt
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]">
                      +{doubt.bounty} pts
                    </span>
                  </div>

                  <h4 className="text-sm font-heading font-bold text-[#171329] leading-snug mb-2 group-hover:text-[#7C3AED] transition-colors">
                    {doubt.title}
                  </h4>

                  <p className="text-xs text-[#6B6680] line-clamp-2 mb-4 leading-relaxed font-sans">
                    {doubt.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {doubt.skills.map((skill) => (
                      <Badge key={skill} size="xs" variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9E2F5] flex items-center justify-between text-xs text-[#6B6680]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {doubt.postedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {doubt.responses || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doubt.status === 'resolved' ? (
                      <span className="text-[11px] font-semibold text-[#4D7C0F] bg-[#F7FEE7] px-2.5 py-1 rounded-xl border border-[#ECFCCB]">
                        Resolved
                      </span>
                    ) : doubt.status === 'matched' ? (
                      <span className="text-[11px] font-semibold text-[#7C3AED] bg-[#F5F0FF] px-2.5 py-1 rounded-xl border border-[#E9E2F5] flex items-center gap-1">
                        <Sparkles size={11} /> Matched
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => openSmartMatchModal(doubt)}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isOwnDoubt
                              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-xs'
                              : 'bg-[#F5F0FF] text-[#7C3AED] hover:bg-[#EDE9FE] border border-[#E9E2F5]'
                          }`}
                          title="Run smart matching algorithm to find top peer mentors"
                        >
                          <Sparkles size={12} /> Find Peer
                        </button>
                        {!isOwnDoubt && (
                          <button
                            onClick={() => openOfferHelpModal(doubt)}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-[#FAF9FF] text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF] px-2.5 py-1.5 rounded-xl transition-all cursor-pointer border border-[#E9E2F5]"
                          >
                            <HandHeart size={12} /> Help
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
