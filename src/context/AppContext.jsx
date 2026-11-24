import { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { REWARDS, getUserLevel } from '../config/gamification';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [doubts, setDoubts] = useState(() => StorageService.getDoubts());
  const [helpOffers, setHelpOffers] = useState(() => StorageService.getHelpOffers());
  const [sessions, setSessions] = useState(() => StorageService.getSessions());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [currentUser, setCurrentUser] = useState(() => StorageService.getUser());
  const [transactions, setTransactions] = useState(() => StorageService.getTransactions());
  const [leaderboard, setLeaderboard] = useState(() => StorageService.getLeaderboard());
  const [peers, setPeers] = useState(() => StorageService.getPeers());
  const [userAvailability, setUserAvailabilityState] = useState(() => StorageService.getUserAvailability());

  // Modal states
  const [isPostDoubtOpen, setIsPostDoubtOpen] = useState(false);
  const [isOfferHelpOpen, setIsOfferHelpOpen] = useState(false);
  const [selectedDoubtForHelp, setSelectedDoubtForHelp] = useState(null);

  // Smart Match modal state
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [activeDoubtForMatching, setActiveDoubtForMatching] = useState(null);

  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeFeedbackSession, setActiveFeedbackSession] = useState(null);

  // Gamification & Celebration states
  const [xpCelebration, setXpCelebration] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Sync to storage when states change
  useEffect(() => {
    StorageService.setDoubts(doubts);
  }, [doubts]);

  useEffect(() => {
    StorageService.setHelpOffers(helpOffers);
  }, [helpOffers]);

  useEffect(() => {
    StorageService.setSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    StorageService.setNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageService.setUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    StorageService.setTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.setLeaderboard(leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    StorageService.setPeers(peers);
  }, [peers]);

  useEffect(() => {
    StorageService.setUserAvailability(userAvailability);
  }, [userAvailability]);

  // Multi-tab storage synchronization across open windows/tabs in the browser
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key) return;
      if (e.key === 'skillbridge_doubts') setDoubts(StorageService.getDoubts());
      if (e.key === 'skillbridge_help_offers') setHelpOffers(StorageService.getHelpOffers());
      if (e.key === 'skillbridge_sessions') setSessions(StorageService.getSessions());
      if (e.key === 'skillbridge_notifications') setNotifications(StorageService.getNotifications());
      if (e.key === 'skillbridge_peers') setPeers(StorageService.getPeers());
      if (e.key === 'skillbridge_leaderboard') setLeaderboard(StorageService.getLeaderboard());
      if (e.key === 'skillbridge_user') setCurrentUser(StorageService.getUser());
      if (e.key === 'skillbridge_transactions') setTransactions(StorageService.getTransactions());
      if (e.key === 'skillbridge_user_availability') setUserAvailabilityState(StorageService.getUserAvailability());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toast dispatch
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Doubt
  const addDoubt = (data) => {
    const newDoubt = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category || 'Programming',
      skills: data.skills && data.skills.length > 0 ? data.skills : [data.category || 'General'],
      urgency: data.urgency || 'medium',
      bounty: Number(data.bounty) || 20,
      duration: data.duration || '15 min',
      status: 'open',
      postedBy: currentUser.fullName,
      postedTime: 'Just now',
      createdAt: Date.now(),
      responses: 0,
      isUserCreated: true,
    };

    setDoubts((prev) => [newDoubt, ...prev]);

    // Add activity notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Doubt Posted Successfully',
      message: `Your doubt "${newDoubt.title}" is now live on the board.`,
      time: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Doubt posted successfully! Helpers will be notified.', 'success');
    return newDoubt;
  };

  // Offer help on a doubt
  const offerHelp = (doubtId, message, timeSlot = 'Next available') => {
    const targetDoubt = doubts.find((d) => d.id === doubtId);
    if (!targetDoubt) {
      addToast('Doubt not found', 'error');
      return false;
    }

    // Check if user is trying to help their own doubt
    const isOwnDoubt =
      targetDoubt.postedBy === currentUser.fullName ||
      targetDoubt.postedBy === currentUser.name ||
      targetDoubt.postedBy === 'Kartik M.' ||
      targetDoubt.isUserCreated;

    if (isOwnDoubt) {
      addToast('You cannot offer help on your own doubt.', 'warning');
      return false;
    }

    // Check if already offered
    const existingOffer = helpOffers.find(
      (o) => o.doubtId === doubtId && o.offeredBy?.isCurrentUser && o.status === 'pending'
    );
    if (existingOffer) {
      addToast('You already have a pending offer for this doubt.', 'warning');
      return false;
    }

    const newOffer = {
      id: `offer-${Date.now()}`,
      doubtId: targetDoubt.id,
      doubtTitle: targetDoubt.title,
      bounty: targetDoubt.bounty || 25,
      duration: targetDoubt.duration || '15 min',
      skills: targetDoubt.skills || ['General'],
      studentName: targetDoubt.postedBy,
      offeredBy: {
        name: currentUser.fullName,
        initials: currentUser.initials,
        college: currentUser.college,
        isCurrentUser: true,
      },
      message: message.trim() || 'I can help guide you through this problem step-by-step.',
      status: 'pending',
      createdAt: Date.now(),
      timeSlot: timeSlot || 'Today, 5:00 PM',
    };

    setHelpOffers((prev) => [newOffer, ...prev]);

    // Increment responses on the doubt
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === doubtId ? { ...d, responses: (d.responses || 0) + 1 } : d
      )
    );

    // Create confirmation notification
    const notif = {
      id: `notif-${Date.now()}`,
      title: 'Help Offer Sent',
      message: `You offered to help ${targetDoubt.postedBy} with "${targetDoubt.title.slice(0, 40)}..."`,
      time: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(`Help offer sent to ${targetDoubt.postedBy}!`, 'success');
    return true;
  };

  // Set Current User Availability (Persisted)
  const setUserAvailability = (newStatus) => {
    setUserAvailabilityState(newStatus);
    setCurrentUser((prev) => ({
      ...prev,
      availability: newStatus,
    }));
    addToast(
      `Availability set to ${
        newStatus === 'available' ? 'Available to Help 🟢' : newStatus === 'busy' ? 'Busy 🟡' : 'Offline ⚫'
      }`,
      'info'
    );
  };

  // Smart Match Modal Control
  const openSmartMatchModal = (doubt) => {
    setActiveDoubtForMatching(doubt);
    setIsSmartMatchOpen(true);
  };

  const closeSmartMatchModal = () => {
    setIsSmartMatchOpen(false);
    setActiveDoubtForMatching(null);
  };

  // Request help from a specific peer (Smart Match Workflow)
  const requestPeerHelp = (doubtId, peerId) => {
    const targetDoubt = doubts.find((d) => d.id === doubtId);
    if (!targetDoubt) {
      addToast('Doubt not found', 'error');
      return false;
    }

    if (targetDoubt.status === 'matched') {
      addToast('This doubt has already been matched with a peer mentor.', 'warning');
      return false;
    }

    if (targetDoubt.status === 'resolved') {
      addToast('This doubt has already been resolved.', 'warning');
      return false;
    }

    const peer = peers.find((p) => p.id === peerId);
    if (!peer) {
      addToast('Peer profile not found', 'error');
      return false;
    }

    // Check if peer is already requested for this doubt
    const existingReq = helpOffers.find(
      (o) =>
        o.doubtId === doubtId &&
        (o.helper?.id === peerId || o.helper?.name === peer.name) &&
        o.status === 'pending'
    );
    if (existingReq) {
      addToast(`You already have a pending request with ${peer.name}.`, 'warning');
      return false;
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      doubtId: targetDoubt.id,
      doubtTitle: targetDoubt.title,
      bounty: targetDoubt.bounty || 25,
      duration: targetDoubt.duration || '15 min',
      skills: targetDoubt.skills || ['General'],
      studentName: currentUser.fullName,
      studentCollege: currentUser.college || 'IIT Bombay',
      helper: {
        id: peer.id,
        name: peer.name,
        initials: peer.initials,
        college: peer.college,
        branch: peer.branch,
        rating: peer.rating,
      },
      message: `Requested mentorship via Smart Peer Match for "${targetDoubt.title}"`,
      status: 'pending',
      createdAt: Date.now(),
      timeSlot: 'Next Available',
      proposedSlot: 'Today, Next Available',
      isDirectRequest: true,
    };

    setHelpOffers((prev) => [newRequest, ...prev]);

    // Notifications
    const requesterNotif = {
      id: `notif-${Date.now()}-1`,
      title: 'Help Request Sent 🎯',
      message: `You requested help from ${peer.name} for "${targetDoubt.title.slice(0, 35)}...".`,
      time: 'Just now',
      read: false,
      type: 'info',
    };

    const helperNotif = {
      id: `notif-${Date.now()}-2`,
      title: 'Incoming Help Request ⚡',
      message: `${currentUser.fullName} requested your mentorship for "${targetDoubt.title.slice(0, 35)}..." (+${targetDoubt.bounty || 25} pts).`,
      time: 'Just now',
      read: false,
      type: 'award',
      actionable: true,
      requestId: newRequest.id,
    };

    setNotifications((prev) => [requesterNotif, helperNotif, ...prev]);

    addToast(`Help request sent to ${peer.name}! They will be notified.`, 'success');
    return true;
  };

  // Respond to help offer / request (Accept / Decline)
  // IMPORTANT: NO premature point awarding here. Points awarded ONLY after session completion!
  const respondToOffer = (offerId, decision) => {
    const offer = helpOffers.find((o) => o.id === offerId);
    if (!offer) return;

    if (offer.status !== 'pending') {
      addToast('This request is no longer pending.', 'info');
      return;
    }

    const helperName = offer.helper?.name || offer.offeredBy?.name || 'Helper';
    const helperInitials = offer.helper?.initials || offer.offeredBy?.initials || 'H';
    const helperCollege = offer.helper?.college || offer.offeredBy?.college || 'University';

    if (decision === 'accepted') {
      const targetDoubt = doubts.find((d) => d.id === offer.doubtId);

      if (targetDoubt && (targetDoubt.status === 'matched' || targetDoubt.status === 'resolved')) {
        addToast('This doubt has already been matched or resolved.', 'warning');
        return;
      }

      const alreadyHasSession = sessions.some(
        (s) => s.doubtId === offer.doubtId && s.status !== 'cancelled'
      );
      if (alreadyHasSession) {
        addToast('A session is already scheduled for this doubt.', 'warning');
        return;
      }

      // 1. Mark accepted and auto-close other pending offers for this doubt
      setHelpOffers((prev) =>
        prev.map((o) => {
          if (o.id === offerId) {
            return { ...o, status: 'accepted' };
          }
          if (o.doubtId === offer.doubtId && o.status === 'pending') {
            return { ...o, status: 'closed' };
          }
          return o;
        })
      );

      // 2. Update doubt status to 'matched'
      if (offer.doubtId) {
        setDoubts((prev) =>
          prev.map((d) => (d.id === offer.doubtId ? { ...d, status: 'matched' } : d))
        );
      }

      // 3. Create upcoming session with strictly deterministic roomName for real-time video
      const newSessionId = Date.now();
      const roomHash = Math.abs((Number(newSessionId) * 2654435761) % 1000000).toString(36);
      const newSession = {
        id: newSessionId,
        doubtId: offer.doubtId,
        helper: {
          name: helperName,
          initials: helperInitials,
          college: helperCollege,
          isCurrentUser: !!offer.offeredBy?.isCurrentUser,
        },
        student: {
          name: offer.studentName || currentUser.fullName,
          initials: offer.studentName
            ? offer.studentName.split(' ').map((w) => w[0]).join('')
            : currentUser.initials,
          college: offer.studentCollege || 'IIT Bombay',
        },
        topic: offer.doubtTitle,
        skills: offer.skills || targetDoubt?.skills || ['Peer Learning'],
        date: 'Today',
        time: offer.timeSlot || offer.proposedSlot || '4:00 PM — 4:45 PM',
        duration: offer.duration || targetDoubt?.duration || '15 min',
        bounty: offer.bounty || targetDoubt?.bounty || 25,
        status: 'upcoming',
        type: 'video',
        roomName: `SkillBridge_P2P_${newSessionId}_${roomHash}`,
        notes: '',
        chatMessages: [
          {
            id: 'msg-init',
            sender: helperName,
            initials: helperInitials,
            text: `Hey! Connected to resolve "${offer.doubtTitle}". Ready when you are!`,
            time: 'Just now',
          },
        ],
      };

      setSessions((prev) => [newSession, ...prev]);

      // 4. Update actionable notification to resolved & create confirmation notification
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.requestId === offerId ? { ...n, actionable: false, read: true } : n
        );
        const sessionNotif = {
          id: `notif-${Date.now()}`,
          title: 'Session Scheduled! 📅',
          message: `Mentorship session with ${helperName} is ready in My Sessions. Video room is generated.`,
          time: 'Just now',
          read: false,
          type: 'success',
        };
        return [sessionNotif, ...updated];
      });

      addToast(`Session accepted! Ready to join with ${helperName}.`, 'success');
    } else {
      // Decline workflow
      setHelpOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' } : o))
      );

      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.requestId === offerId ? { ...n, actionable: false, read: true } : n
        );
        const declineNotif = {
          id: `notif-${Date.now()}`,
          title: 'Help Request Update',
          message: `${helperName} declined or was unavailable. You can request another recommended peer.`,
          time: 'Just now',
          read: false,
          type: 'info',
        };
        return [declineNotif, ...updated];
      });

      addToast('Request declined.', 'info');
    }
  };

  // Start / Join session -> transitions to 'in-progress', stamps startedAt & roomName
  const startSession = (sessionId) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const isUpcoming = s.status === 'upcoming';
          const startedAt = s.startedAt || Date.now();
          const roomName = s.roomName || `SkillBridge_P2P_${s.id}_${Math.abs(Number(s.id) * 2654435761 % 1000000).toString(36)}`;

          if (isUpcoming) {
            const notif = {
              id: `notif-${Date.now()}`,
              title: 'Live Video Session Active 🚀',
              message: `You connected to "${s.topic.slice(0, 35)}...". Video call room is live.`,
              time: 'Just now',
              read: false,
              type: 'info',
            };
            setNotifications((n) => [notif, ...n]);
          }

          return {
            ...s,
            status: s.status === 'completed' ? 'completed' : 'in-progress',
            startedAt,
            roomName,
          };
        }
        return s;
      })
    );
  };

  // Update session notes
  const updateSessionNotes = (sessionId, notes) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, notes } : s))
    );
  };

  // Add chat message in session
  const addSessionMessage = (sessionId, text, customSender = null) => {
    const senderName = customSender || currentUser.fullName;
    const senderInitials = customSender
      ? customSender.split(' ').map((n) => n[0]).join('')
      : currentUser.initials;

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: senderName,
      initials: senderInitials,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, chatMessages: [...(s.chatMessages || []), newMessage] }
          : s
      )
    );

    return newMessage;
  };

  // Complete session & award rewards (IDEMPOTENT & MULTI-TIER REWARDS)
  const completeSession = (
    sessionId,
    { resolutionStatus = 'resolved', rating = 5, feedback = '' } = {}
  ) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      addToast('Session not found', 'error');
      return false;
    }

    // Prevent duplicate completion
    if (session.status === 'completed' || session.rewarded) {
      addToast('Session has already been completed.', 'warning');
      return false;
    }

    const bounty = Number(session.bounty) || 25;
    const baseHelperXP = REWARDS.SESSION_COMPLETED || 50;
    const ratingBonusXP = Number(rating) >= 4 ? (REWARDS.POSITIVE_RATING || 20) : 0;
    const notesBonusXP = session.notes ? (REWARDS.HELPFUL_SOLUTION || 10) : 0;
    const helperTotalReward = bounty + baseHelperXP + ratingBonusXP + notesBonusXP;
    const requesterTotalReward = REWARDS.REQUESTER_COMPLETION || 15;

    const isUserHelper =
      session.helper?.isCurrentUser ||
      session.helper?.name === currentUser.fullName ||
      session.helper?.name === currentUser.name;

    // 1. Mark session as completed
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: 'completed',
              completedAt: Date.now(),
              rating: Number(rating) || 5,
              resolutionStatus: resolutionStatus || 'resolved',
              feedback: feedback || 'Great peer session! Problem solved successfully.',
              rewarded: true,
            }
          : s
      )
    );

    // 2. Mark corresponding doubt status according to resolutionStatus
    // 'resolved' -> resolved, 'partially-resolved' -> partially-resolved, 'open' -> open
    if (session.doubtId) {
      const finalDoubtStatus =
        resolutionStatus === 'open'
          ? 'open'
          : resolutionStatus === 'partially-resolved'
          ? 'partially-resolved'
          : 'resolved';

      setDoubts((prev) =>
        prev.map((d) =>
          d.id === session.doubtId ? { ...d, status: finalDoubtStatus } : d
        )
      );
    }

    // 3. Update peer directory stats
    setPeers((prevPeers) => {
      const helperName = session.helper?.name;
      return prevPeers.map((p) => {
        if (p.name === helperName || p.id === session.helper?.id) {
          const prevSolved = p.doubtsSolved || 0;
          const newSolved = prevSolved + 1;
          const newRating = Number(
            (((p.rating || 4.8) * prevSolved + Number(rating)) / newSolved).toFixed(1)
          );
          return {
            ...p,
            doubtsSolved: newSolved,
            sessions: (p.sessions || 0) + 1,
            xp: (p.xp || 500) + helperTotalReward,
            rating: newRating,
          };
        }
        return p;
      });
    });

    // 4. Distribute Points & Record Transactions
    let awardedPoints = 0;
    let newTx = null;

    if (isUserHelper) {
      awardedPoints = helperTotalReward;
      newTx = {
        id: `tx-${Date.now()}`,
        title: `Mentorship Reward: ${session.topic}`,
        amount: awardedPoints,
        type: 'credit',
        category: 'Bounty & Helper XP',
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentUser((prev) => ({
        ...prev,
        points: (prev.points || 280) + awardedPoints,
        xp: (prev.xp || prev.points || 280) + awardedPoints,
      }));
    } else {
      awardedPoints = requesterTotalReward;
      newTx = {
        id: `tx-${Date.now()}`,
        title: `Doubt Resolved: ${session.topic}`,
        amount: awardedPoints,
        type: 'credit',
        category: 'Learning Bonus',
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentUser((prev) => ({
        ...prev,
        points: (prev.points || 280) + awardedPoints,
        xp: (prev.xp || prev.points || 280) + awardedPoints,
      }));
    }

    if (newTx) {
      setTransactions((prev) => [newTx, ...prev]);
    }

    // Trigger Gamification Celebrations
    const currentTotalXp = currentUser.xp || currentUser.points || 280;
    const prevLevel = getUserLevel(currentTotalXp);
    const newTotalXp = currentTotalXp + awardedPoints;
    const newLevel = getUserLevel(newTotalXp);

    if (newLevel.level > prevLevel.level) {
      setLevelUpData({
        level: newLevel.level,
        title: newLevel.title,
        currentXp: newTotalXp,
      });
    }

    setXpCelebration({
      amount: awardedPoints,
      id: Date.now(),
    });

    // 5. Update Leaderboard Dynamically
    setLeaderboard((prev) => {
      const helperName = session.helper?.name;
      const updated = prev.map((entry) => {
        if (entry.name === helperName || (isUserHelper && entry.isCurrentUser)) {
          return {
            ...entry,
            points: (entry.points || 0) + helperTotalReward,
            sessions: (entry.sessions || 0) + 1,
          };
        }
        if (!isUserHelper && entry.isCurrentUser) {
          return {
            ...entry,
            points: (entry.points || 0) + requesterTotalReward,
            sessions: (entry.sessions || 0) + 1,
          };
        }
        return entry;
      });

      // Re-sort and re-rank
      return updated
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .map((item, index) => ({
          ...item,
          rank: index + 1,
        }));
    });

    // 6. Create Notification
    const notif = {
      id: `notif-${Date.now()}`,
      title: 'Session Completed! 🎉',
      message: `Session for "${session.topic.slice(0, 30)}..." completed. +${awardedPoints} XP credited to your balance.`,
      time: 'Just now',
      read: false,
      type: 'award',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(`Session completed! +${awardedPoints} XP awarded.`, 'success');
    return true;
  };

  // Cancel a session
  const cancelSession = (sessionId) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s))
    );
    addToast('Session cancelled.', 'info');
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Open / Close modal helpers
  const openPostDoubtModal = () => setIsPostDoubtOpen(true);
  const closePostDoubtModal = () => setIsPostDoubtOpen(false);

  const openOfferHelpModal = (doubt) => {
    setSelectedDoubtForHelp(doubt);
    setIsOfferHelpOpen(true);
  };
  const closeOfferHelpModal = () => {
    setSelectedDoubtForHelp(null);
    setIsOfferHelpOpen(false);
  };

  const openFeedbackModal = (session) => {
    setActiveFeedbackSession(session);
    setIsFeedbackOpen(true);
  };
  const closeFeedbackModal = () => {
    setActiveFeedbackSession(null);
    setIsFeedbackOpen(false);
  };

  const activeDoubtsCount = doubts.filter(
    (d) =>
      (d.postedBy === currentUser.fullName ||
        d.postedBy === currentUser.name ||
        d.postedBy === 'Kartik M.' ||
        d.isUserCreated) &&
      d.status !== 'resolved'
  ).length;

  return (
    <AppContext.Provider
      value={{
        doubts,
        addDoubt,
        helpOffers,
        offerHelp,
        respondToOffer,
        sessions,
        startSession,
        updateSessionNotes,
        addSessionMessage,
        completeSession,
        cancelSession,
        peers,
        userAvailability,
        setUserAvailability,
        isSmartMatchOpen,
        activeDoubtForMatching,
        openSmartMatchModal,
        closeSmartMatchModal,
        requestPeerHelp,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadNotificationsCount,
        currentUser,
        transactions,
        leaderboard,
        activeDoubtsCount,
        isPostDoubtOpen,
        openPostDoubtModal,
        closePostDoubtModal,
        isOfferHelpOpen,
        selectedDoubtForHelp,
        openOfferHelpModal,
        closeOfferHelpModal,
        isFeedbackOpen,
        activeFeedbackSession,
        openFeedbackModal,
        closeFeedbackModal,
        xpCelebration,
        clearXpCelebration: () => setXpCelebration(null),
        levelUpData,
        closeLevelUpModal: () => setLevelUpData(null),
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
