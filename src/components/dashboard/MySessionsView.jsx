import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  HandHeart,
  Check,
  X,
  Coins,
  Star,
  Flame,
  Sparkles,
} from 'lucide-react';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import { useApp } from '../../context/AppContext';

function SessionCard({ session, onCancel, onOpenFeedback }) {
  const navigate = useNavigate();
  const { startSession } = useApp();

  const statusConfig = {
    upcoming: {
      icon: Play,
      label: 'Scheduled',
      badge: 'bg-[#F5F0FF] text-[#7C3AED] border-[#E9E2F5]',
    },
    'in-progress': {
      icon: Flame,
      label: 'In Progress',
      badge: 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white border-transparent animate-pulse',
    },
    completed: {
      icon: CheckCircle2,
      label: 'Completed',
      badge: 'bg-[#F7FEE7] text-[#4D7C0F] border-[#ECFCCB]',
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelled',
      badge: 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]',
    },
  };

  const { icon: StatusIcon, label, badge } =
    statusConfig[session.status] || statusConfig.upcoming;

  const handleJoin = () => {
    startSession(session.id);
    navigate(`/session/${session.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-6 hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] hover:border-[#7C3AED]/40 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar initials={session.helper?.initials || 'SB'} size="md" statusDot="online" />
            <div>
              <h4 className="text-sm font-heading font-bold text-[#171329] group-hover:text-[#7C3AED] transition-colors">
                {session.helper?.name}
              </h4>
              <p className="text-xs text-[#6B6680]">
                {session.helper?.college}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${badge}`}
            >
              <StatusIcon size={12} />
              {label}
            </span>
            {session.bounty && (
              <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F0FF] px-2.5 py-1 rounded-full border border-[#E9E2F5] flex items-center gap-1">
                <Coins size={12} className="text-[#7C3AED]" />
                {session.bounty} pts
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-heading font-bold text-[#171329] mb-2 leading-snug">
          {session.topic}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {session.skills?.map((skill) => (
            <Badge key={skill} size="xs" variant="default">
              {skill}
            </Badge>
          ))}
          {session.duration && (
            <span className="text-[11px] text-[#6B6680] bg-[#FAF9FF] px-2.5 py-0.5 rounded-full border border-[#E9E2F5]">
              {session.duration}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#6B6680] mb-4 pt-3 border-t border-[#E9E2F5]">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#7C3AED]" />
            {session.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#7C3AED]" />
            {session.time}
          </span>
        </div>

        {/* Notes preview if completed */}
        {session.status === 'completed' && session.notes && (
          <div className="p-3.5 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] text-xs text-[#6B6680] mb-4 font-mono">
            <span className="font-bold text-[#7C3AED] block mb-1">Solution Takeaways:</span>
            <p className="line-clamp-2 leading-relaxed">{session.notes}</p>
          </div>
        )}

        {/* Rating preview if completed */}
        {session.status === 'completed' && session.rating && (
          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(session.rating)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400" />
              ))}
            </div>
            <span className="text-[#6B6680] italic">&ldquo;{session.feedback}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#E9E2F5]">
        {session.status === 'upcoming' && (
          <>
            <button
              onClick={handleJoin}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Video size={14} /> Join Session Room
            </button>
            <button
              onClick={() => onCancel(session.id)}
              className="p-2.5 rounded-2xl text-[#6B6680] hover:text-[#E11D48] hover:bg-[#FFF1F2] border border-[#E9E2F5] transition-colors cursor-pointer"
              title="Cancel session"
            >
              <X size={16} />
            </button>
          </>
        )}

        {session.status === 'in-progress' && (
          <button
            onClick={handleJoin}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_6px_22px_rgba(124,58,237,0.35)] animate-pulse cursor-pointer"
          >
            <Flame size={15} /> Resume Live Session
          </button>
        )}

        {session.status === 'completed' && (
          <div className="w-full flex items-center justify-between text-xs">
            <span className="text-[#4D7C0F] font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Session Resolved
            </span>
            <button
              onClick={() => onOpenFeedback(session)}
              className="text-[#7C3AED] font-semibold hover:underline text-xs cursor-pointer"
            >
              Update Rating
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MySessionsView() {
  const {
    sessions,
    helpOffers,
    respondToOffer,
    cancelSession,
    openFeedbackModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingSessions = sessions.filter((s) => s.status === 'upcoming');
  const inProgressSessions = sessions.filter((s) => s.status === 'in-progress');
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const pendingOffers = helpOffers.filter((o) => o.status === 'pending');

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E2F5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5] text-xs font-semibold text-[#7C3AED] mb-2">
            <span>Session Coordinator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#171329]">
            My Mentorship Sessions
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6680] mt-0.5">
            Manage your scheduled, active, and completed 1-on-1 peer learning rooms.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2.5 border-b border-[#E9E2F5] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
              : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF]'
          }`}
        >
          <span>Scheduled</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-[#FAF9FF] text-[#6B6680]'}`}>
            {upcomingSessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('in-progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'in-progress'
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
              : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF]'
          }`}
        >
          <span>In Progress</span>
          {inProgressSessions.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E11D48] text-white font-bold">
              {inProgressSessions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
              : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF]'
          }`}
        >
          <span>Completed</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-[#FAF9FF] text-[#6B6680]'}`}>
            {completedSessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'offers'
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]'
              : 'text-[#6B6680] hover:text-[#7C3AED] hover:bg-[#F5F0FF]'
          }`}
        >
          <span>Offers &amp; Requests</span>
          {pendingOffers.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'offers' ? 'bg-white text-[#7C3AED]' : 'bg-[#7C3AED] text-white'}`}>
              {pendingOffers.length} pending
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'upcoming' && (
        upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onCancel={cancelSession}
                onOpenFeedback={openFeedbackModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E9E2F5] rounded-3xl p-14 text-center shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 border border-[#E9E2F5]">
              <Calendar size={26} />
            </div>
            <h3 className="font-heading font-bold text-base text-[#171329] mb-1">
              No scheduled sessions
            </h3>
            <p className="text-xs text-[#6B6680]">
              Post a doubt or explore open peer requests to schedule your next session.
            </p>
          </div>
        )
      )}

      {activeTab === 'in-progress' && (
        inProgressSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onCancel={cancelSession}
                onOpenFeedback={openFeedbackModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E9E2F5] rounded-3xl p-14 text-center shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 border border-[#E9E2F5]">
              <Video size={26} />
            </div>
            <h3 className="font-heading font-bold text-base text-[#171329] mb-1">
              No active sessions right now
            </h3>
            <p className="text-xs text-[#6B6680]">
              When an upcoming session begins, you can collaborate in real time here.
            </p>
          </div>
        )
      )}

      {activeTab === 'completed' && (
        completedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onCancel={cancelSession}
                onOpenFeedback={openFeedbackModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E9E2F5] rounded-3xl p-14 text-center shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 border border-[#E9E2F5]">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="font-heading font-bold text-base text-[#171329] mb-1">
              No completed sessions yet
            </h3>
            <p className="text-xs text-[#6B6680]">
              Your resolved doubts and earned bounty transactions will appear here.
            </p>
          </div>
        )
      )}

      {activeTab === 'offers' && (
        pendingOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingOffers.map((offer) => {
              const displayName = offer.isDirectRequest
                ? `${offer.helper?.name || 'Assigned Peer'}`
                : `${offer.helper?.name || offer.offeredBy?.name || 'Helper'}`;
              const collegeName = offer.helper?.college || offer.offeredBy?.college || 'Verified Campus Peer';

              return (
                <motion.div
                  key={offer.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl border border-[#E9E2F5] shadow-[0_8px_24px_rgba(91,33,182,0.05)] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={offer.helper?.initials || offer.helper?.avatar || 'SB'} size="md" statusDot="online" />
                        <div>
                          <h4 className="text-sm font-heading font-bold text-[#171329]">
                            {displayName}
                          </h4>
                          <p className="text-xs text-[#6B6680]">
                            {collegeName}
                          </p>
                        </div>
                      </div>
                      {offer.isDirectRequest ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#F5F0FF] text-[#7C3AED] border border-[#DDD6FE]">
                          <Sparkles size={11} /> Smart Match
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white">
                          Help Offer
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 bg-[#FAF9FF] rounded-2xl border border-[#E9E2F5] text-xs text-[#171329] mb-4">
                      <span className="font-bold text-[#7C3AED] block mb-1">Doubt: {offer.doubtTitle}</span>
                      <p className="text-[#6B6680] italic">&ldquo;{offer.message}&rdquo;</p>
                    </div>

                    <div className="text-xs text-[#6B6680] mb-4 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#7C3AED]" />
                      <span>Window: <strong className="text-[#171329]">{offer.proposedSlot || offer.timeSlot || 'Flexible'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#E9E2F5]">
                    <button
                      onClick={() => respondToOffer(offer.id, 'accepted')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_22px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
                    >
                      <Check size={14} /> Accept &amp; Schedule
                    </button>
                    <button
                      onClick={() => respondToOffer(offer.id, 'rejected')}
                      className="inline-flex items-center justify-center p-2.5 rounded-2xl text-[#6B6680] hover:text-[#E11D48] hover:bg-[#FFF1F2] border border-[#E9E2F5] transition-colors cursor-pointer"
                      title="Decline"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#E9E2F5] rounded-3xl p-14 text-center shadow-xs max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 border border-[#E9E2F5]">
              <HandHeart size={26} />
            </div>
            <h3 className="font-heading font-bold text-base text-[#171329] mb-1">
              No pending help offers or requests
            </h3>
            <p className="text-xs text-[#6B6680]">
              When peers match your doubt or students offer guidance, their requests will appear here.
            </p>
          </div>
        )
      )}
    </div>
  );
}
