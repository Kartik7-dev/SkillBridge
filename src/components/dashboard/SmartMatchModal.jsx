import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  Star,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Loader2,
  Check,
} from 'lucide-react';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { useApp } from '../../context/AppContext';
import { findSmartMatches } from '../../utils/matchingAlgorithm';

// Smooth Animated Score Counter
function AnimatedScoreCounter({ value, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(easedProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{displayValue}%</span>;
}

export default function SmartMatchModal() {
  const {
    isSmartMatchOpen,
    closeSmartMatchModal,
    activeDoubtForMatching,
    peers,
    currentUser,
    requestPeerHelp,
    helpOffers,
  } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [broadenSearch, setBroadenSearch] = useState(false);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState(null);
  const [viewingPeerProfile, setViewingPeerProfile] = useState(null);
  const [requestStates, setRequestStates] = useState({});

  // Analysis simulation steps for smooth UX
  useEffect(() => {
    if (isSmartMatchOpen && activeDoubtForMatching) {
      setIsAnalyzing(true);
      setAnalyzingStep(0);
      setBroadenSearch(false);
      setExpandedBreakdownId(null);
      setViewingPeerProfile(null);
      setRequestStates({});

      const step1 = setTimeout(() => setAnalyzingStep(1), 450);
      const step2 = setTimeout(() => setAnalyzingStep(2), 900);
      const step3 = setTimeout(() => setAnalyzingStep(3), 1350);
      const step4 = setTimeout(() => setAnalyzingStep(4), 1750);
      const done = setTimeout(() => setIsAnalyzing(false), 2150);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(step4);
        clearTimeout(done);
      };
    }
  }, [isSmartMatchOpen, activeDoubtForMatching]);

  // Compute ranked matches
  const rankedMatches = useMemo(() => {
    if (!activeDoubtForMatching) return [];
    const doubtToMatch = broadenSearch
      ? { ...activeDoubtForMatching, skills: [...(activeDoubtForMatching.skills || []), 'General', 'Programming'] }
      : activeDoubtForMatching;

    return findSmartMatches(doubtToMatch, peers, currentUser);
  }, [activeDoubtForMatching, peers, currentUser, broadenSearch]);

  if (!isSmartMatchOpen || !activeDoubtForMatching) return null;

  const stepsText = [
    'Analyzing doubt context & required topics...',
    'Scanning verified campus peer skillsets...',
    'Checking live mentor availability status...',
    'Computing 100-point compatibility score...',
    'Best match identified! ⭐',
  ];

  const handleRequest = (peer) => {
    if (requestStates[peer.id] === 'loading') return;

    setRequestStates((prev) => ({ ...prev, [peer.id]: 'loading' }));

    setTimeout(() => {
      requestPeerHelp(activeDoubtForMatching.id, peer.id);
      setRequestStates((prev) => ({ ...prev, [peer.id]: 'success' }));

      setTimeout(() => {
        setRequestStates((prev) => ({ ...prev, [peer.id]: 'done' }));
      }, 500);
    }, 450);
  };

  const isRequestPending = (peerId, peerName) => {
    return (
      requestStates[peerId] === 'done' ||
      helpOffers.some(
        (o) =>
          o.doubtId === activeDoubtForMatching.id &&
          (o.helper?.id === peerId || o.helper?.name === peerName) &&
          o.status === 'pending'
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#171329]/50 backdrop-blur-xs transition-opacity"
        onClick={closeSmartMatchModal}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_24px_70px_rgba(91,33,182,0.25)] border border-[#E9E2F5] overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF7FF] via-[#F5F0FF] to-[#EDE9FE] border-b border-[#E9E2F5] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9333EA] shadow-[0_6px_20px_rgba(124,58,237,0.35)] flex items-center justify-center text-white shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#E9E2F5] text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] mb-1">
                  <span>Smart Peer Matchmaker</span>
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-extrabold text-[#171329] leading-tight">
                  Finding the Best Peer Mentors
                </h2>
              </div>
            </div>

            <button
              onClick={closeSmartMatchModal}
              className="p-2 rounded-xl text-[#6B6680] hover:text-[#7C3AED] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Doubt summary pill */}
          <div className="mt-3.5 p-3 rounded-2xl bg-white/80 border border-[#E9E2F5] flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <span className="text-[#6B6680] text-[11px] block font-medium">Matching for doubt:</span>
              <p className="font-heading font-bold text-[#171329] truncate">{activeDoubtForMatching.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-[#7C3AED] px-2.5 py-1 rounded-full bg-[#F5F0FF] border border-[#E9E2F5]">
                +{activeDoubtForMatching.bounty || 25} pts
              </span>
              <span className="text-[11px] font-semibold text-[#6B6680] bg-[#FAF9FF] px-2.5 py-1 rounded-full border border-[#E9E2F5]">
                {activeDoubtForMatching.category || 'General'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              /* Signature Radar Scanning State */
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="py-10 text-center flex flex-col items-center justify-center space-y-6"
              >
                {/* Visual Radar Container */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Concentric Circle 1 (Outer) */}
                  <div className="absolute inset-0 rounded-full border border-[#DDD6FE]/70 bg-gradient-to-br from-[#FAF7FF]/80 via-white/50 to-[#F5F0FF]/80 shadow-[0_0_35px_rgba(124,58,237,0.08)]" />

                  {/* Concentric Circle 2 (Middle) */}
                  <div className="absolute w-40 h-40 rounded-full border border-[#C4B5FD]/80" />

                  {/* Concentric Circle 3 (Inner) */}
                  <div className="absolute w-24 h-24 rounded-full border border-[#A78BFA]/85" />

                  {/* Crosshairs */}
                  <div className="absolute w-full h-[1px] bg-[#E9E2F5]" />
                  <div className="absolute h-full w-[1px] bg-[#E9E2F5]" />

                  {/* Expanding Sonar Pulse Waves */}
                  <motion.div
                    animate={{ scale: [0.3, 1.35], opacity: [0.75, 0] }}
                    transition={{ repeat: Infinity, duration: 2.1, ease: 'easeOut' }}
                    className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-[#7C3AED]/25 to-transparent pointer-events-none"
                  />
                  <motion.div
                    animate={{ scale: [0.3, 1.35], opacity: [0.75, 0] }}
                    transition={{ repeat: Infinity, duration: 2.1, delay: 1.05, ease: 'easeOut' }}
                    className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-[#9333EA]/20 to-transparent pointer-events-none"
                  />

                  {/* Rotating 360-degree Radar Sweep Beam */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
                    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(124, 58, 237, 0.42) 0deg, rgba(147, 51, 234, 0.12) 35deg, transparent 65deg)',
                    }}
                  />

                  {/* Center Radar Core */}
                  <div className="relative z-20 w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9333EA] shadow-[0_0_20px_rgba(124,58,237,0.6)] flex items-center justify-center text-white">
                    <Sparkles size={18} className="animate-pulse" />
                  </div>

                  {/* Detected Blip Points (Representing Real Candidate Discovery) */}
                  {analyzingStep >= 1 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-[28%] left-[24%] z-20 flex items-center gap-1"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                      </span>
                    </motion.div>
                  )}

                  {analyzingStep >= 2 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-[22%] right-[26%] z-20 flex items-center gap-1"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]" />
                      </span>
                    </motion.div>
                  )}

                  {analyzingStep >= 3 && (
                    <>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute bottom-[24%] right-[28%] z-20"
                      >
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute bottom-[26%] left-[28%] z-20"
                      >
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
                        </span>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Status indicator with progress bar */}
                <div className="max-w-md mx-auto space-y-2.5 px-4">
                  <div className="flex items-center justify-between text-[11px] text-[#6B6680] font-semibold">
                    <span>Smart Match Progress</span>
                    <span className="text-[#7C3AED] font-bold">
                      {Math.round(((analyzingStep + 1) / stepsText.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-64 sm:w-80 h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden mx-auto shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full"
                      animate={{ width: `${((analyzingStep + 1) / stepsText.length) * 100}%` }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.p
                      key={analyzingStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-semibold text-[#171329] h-5"
                    >
                      {stepsText[analyzingStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Analyzed tags preview */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm pt-1">
                  {(activeDoubtForMatching.skills || ['Core Concepts']).map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5]"
                    >
                      #{s}
                    </span>
                  ))}
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF9FF] text-[#6B6680] border border-[#E9E2F5]">
                    {activeDoubtForMatching.category}
                  </span>
                </div>
              </motion.div>
            ) : rankedMatches.length > 0 ? (
              /* Ranked Results List */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-[#6B6680] px-1">
                  <span>
                    Found <strong className="text-[#171329]">{rankedMatches.length} matching peers</strong> ranked by algorithmic score:
                  </span>
                  <span className="text-[11px] text-[#7C3AED] font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} /> 100-Point Match Protocol
                  </span>
                </div>

                {rankedMatches.map((peer, idx) => {
                  const isBest = peer.isBestMatch;
                  const isPending = isRequestPending(peer.id, peer.name);
                  const isExpanded = expandedBreakdownId === peer.id;
                  const reqState = requestStates[peer.id];

                  const availColor =
                    peer.availability === 'available'
                      ? 'bg-[#A3E635] text-[#171329]'
                      : peer.availability === 'busy'
                      ? 'bg-amber-400 text-[#171329]'
                      : 'bg-slate-300 text-slate-700';

                  const availText =
                    peer.availability === 'available'
                      ? 'Available now'
                      : peer.availability === 'busy'
                      ? 'Busy in session'
                      : 'Offline';

                  return (
                    <motion.div
                      key={peer.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.35, ease: 'easeOut' }}
                      className={`relative rounded-3xl p-5 border transition-all duration-200 ${
                        isBest
                          ? 'bg-gradient-to-br from-white via-[#FAF7FF] to-[#F5F0FF] border-[#7C3AED] shadow-[0_16px_40px_rgba(124,58,237,0.16)] ring-2 ring-[#7C3AED]/25'
                          : 'bg-white border-[#E9E2F5] shadow-xs hover:border-[#7C3AED]/40 hover:shadow-md'
                      }`}
                    >
                      {/* Best Match ribbon */}
                      {isBest && (
                        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(124,58,237,0.35)]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                          </span>
                          <span>Top Recommended Match</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Left: Avatar & Peer Meta */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <Avatar
                            initials={peer.initials}
                            size="lg"
                            statusDot={peer.availability === 'available' ? 'online' : 'offline'}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-heading font-extrabold text-[#171329] text-base">
                                {peer.name}
                              </h4>
                              {/* Availability Pill */}
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF9FF] border border-[#E9E2F5]">
                                <span className={`w-2 h-2 rounded-full ${availColor}`} />
                                <span>{availText}</span>
                              </span>
                            </div>

                            <p className="text-xs text-[#6B6680] mt-0.5">
                              {peer.branch || 'Engineering'} &middot; {peer.college} &middot; {peer.year || '3rd Year'}
                            </p>

                            {/* Skills Row */}
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {peer.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} size="xs" variant="default">
                                  {skill}
                                </Badge>
                              ))}
                              {peer.skills.length > 4 && (
                                <span className="text-[10px] text-[#6B6680] self-center">
                                  +{peer.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Match Score Gauge with animated numbers & bar */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E9E2F5]">
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6680] block">
                              Fit Score
                            </span>
                            <span className="text-2xl font-heading font-black text-[#7C3AED]">
                              <AnimatedScoreCounter value={peer.matchPercentage} />
                            </span>
                          </div>

                          {/* Animated Progress Bar */}
                          <div className="w-24 h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden mt-0.5 shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${peer.matchPercentage}%` }}
                              transition={{ duration: 0.85, delay: 0.15 + idx * 0.08, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] rounded-full"
                            />
                          </div>

                          <span className="text-[10px] font-semibold text-[#4D7C0F] bg-[#F7FEE7] px-2 py-0.5 rounded-full border border-[#ECFCCB] mt-1">
                            Score: {peer.matchScore} / 100
                          </span>
                        </div>
                      </div>

                      {/* Stat summary pills */}
                      <div className="flex items-center gap-4 text-xs text-[#6B6680] mt-3.5 pt-3 border-t border-[#E9E2F5]/80 flex-wrap">
                        <span className="flex items-center gap-1 text-[#171329] font-semibold">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          {peer.rating} Rating
                        </span>
                        <span>&middot;</span>
                        <span>{peer.doubtsSolved} doubts solved</span>
                        <span>&middot;</span>
                        <span className="text-[#7C3AED] font-bold">{peer.xp} XP</span>
                      </div>

                      {/* Why Recommended Quote Box */}
                      <div className="mt-3 p-3 rounded-2xl bg-[#FAF9FF] border border-[#E9E2F5] text-xs text-[#171329] leading-relaxed">
                        <span className="font-bold text-[#7C3AED] block text-[11px] mb-0.5">
                          Why this peer was recommended:
                        </span>
                        <p className="text-[#6B6680] italic">
                          &ldquo;{peer.recommendationStatement}&rdquo;
                        </p>
                      </div>

                      {/* Score Breakdown toggle */}
                      {isExpanded && peer.breakdown && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-[#F5F0FF]/60 border border-[#E9E2F5] text-xs space-y-2 animate-fade-in">
                          <span className="font-bold text-[#171329] block text-[11px]">Score Calculation:</span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                            <div className="p-1.5 rounded-xl bg-white border border-[#E9E2F5]">
                              <span className="text-[#6B6680] block">Skills</span>
                              <strong className="text-[#7C3AED]">{peer.breakdown.skillScore} / 40</strong>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white border border-[#E9E2F5]">
                              <span className="text-[#6B6680] block">Subject</span>
                              <strong className="text-[#7C3AED]">{peer.breakdown.categoryScore} / 25</strong>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white border border-[#E9E2F5]">
                              <span className="text-[#6B6680] block">Availability</span>
                              <strong className="text-[#7C3AED]">{peer.breakdown.availabilityScore} / 15</strong>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white border border-[#E9E2F5]">
                              <span className="text-[#6B6680] block">Rating</span>
                              <strong className="text-[#7C3AED]">{peer.breakdown.reputationScore} / 10</strong>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white border border-[#E9E2F5]">
                              <span className="text-[#6B6680] block">Solved</span>
                              <strong className="text-[#7C3AED]">{peer.breakdown.experienceScore} / 10</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E9E2F5]">
                        <button
                          type="button"
                          onClick={() => setExpandedBreakdownId(isExpanded ? null : peer.id)}
                          className="text-xs text-[#7C3AED] hover:text-[#5B21B6] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          <span>{isExpanded ? 'Hide Score Breakdown' : 'View Score Breakdown'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setViewingPeerProfile(peer)}
                          >
                            View Profile
                          </Button>

                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5] text-xs font-bold animate-pulse">
                              <Clock size={13} />
                              Request Pending...
                            </span>
                          ) : reqState === 'loading' ? (
                            <button
                              disabled
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] border border-[#DDD6FE] text-xs font-bold cursor-wait"
                            >
                              <Loader2 size={13} className="animate-spin text-[#7C3AED]" />
                              Sending Request...
                            </button>
                          ) : reqState === 'success' ? (
                            <motion.span
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F7FEE7] text-[#4D7C0F] border border-[#ECFCCB] text-xs font-bold"
                            >
                              <Check size={14} className="text-[#4D7C0F]" />
                              Request Sent! 🎉
                            </motion.span>
                          ) : activeDoubtForMatching?.status === 'matched' ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] border border-[#E9E2F5] text-xs font-semibold">
                              <CheckCircle2 size={13} />
                              Already Matched
                            </span>
                          ) : activeDoubtForMatching?.status === 'resolved' ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#F7FEE7] text-[#4D7C0F] border border-[#ECFCCB] text-xs font-semibold">
                              <CheckCircle2 size={13} />
                              Doubt Resolved
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleRequest(peer)}
                              icon={Send}
                              className={isBest ? 'shadow-[0_4px_16px_rgba(124,58,237,0.35)]' : ''}
                            >
                              Request Help
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center max-w-md mx-auto space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#7C3AED] flex items-center justify-center mx-auto border border-[#E9E2F5]">
                  <HelpCircle size={28} />
                </div>
                <h3 className="font-heading font-bold text-base text-[#171329]">
                  No matching peers found right now
                </h3>
                <p className="text-xs text-[#6B6680] leading-relaxed">
                  We could not find an exact match for this specific combination of tags. You can broaden the search to related STEM subjects or keep your doubt open on the public board.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setBroadenSearch(true)}
                  >
                    Broaden Search Tags
                  </Button>
                  <Button
                    size="sm"
                    onClick={closeSmartMatchModal}
                  >
                    Keep Doubt Open
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Peer Profile Quick Drawer Modal */}
        {viewingPeerProfile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setViewingPeerProfile(null)}
            />
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E9E2F5] z-10 space-y-4 animate-scale-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={viewingPeerProfile.initials} size="lg" statusDot={viewingPeerProfile.availability === 'available' ? 'online' : 'offline'} />
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-[#171329]">
                      {viewingPeerProfile.name}
                    </h3>
                    <p className="text-xs text-[#6B6680]">
                      {viewingPeerProfile.college} &middot; {viewingPeerProfile.branch}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingPeerProfile(null)}
                  className="p-1.5 rounded-xl text-[#6B6680] hover:text-[#7C3AED] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-[#171329] leading-relaxed bg-[#FAF9FF] p-3 rounded-2xl border border-[#E9E2F5]">
                {viewingPeerProfile.bio}
              </p>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6680] block mb-2">
                  Verified Skills &amp; Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingPeerProfile.skills.map((s) => (
                    <Badge key={s} size="xs" variant="default">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#E9E2F5]">
                <div className="p-2 rounded-xl bg-[#FAF9FF] border border-[#E9E2F5]">
                  <span className="text-[10px] text-[#6B6680] block font-semibold">Rating</span>
                  <strong className="text-[#171329] text-xs">⭐ {viewingPeerProfile.rating}</strong>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF9FF] border border-[#E9E2F5]">
                  <span className="text-[10px] text-[#6B6680] block font-semibold">Doubts Solved</span>
                  <strong className="text-[#171329] text-xs">{viewingPeerProfile.doubtsSolved}</strong>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF9FF] border border-[#E9E2F5]">
                  <span className="text-[10px] text-[#6B6680] block font-semibold">Reputation</span>
                  <strong className="text-[#7C3AED] text-xs">{viewingPeerProfile.xp} XP</strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewingPeerProfile(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleRequest(viewingPeerProfile);
                    setViewingPeerProfile(null);
                  }}
                  icon={Send}
                >
                  Request Mentorship
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
