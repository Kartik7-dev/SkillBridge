import {
  sampleDoubts,
  currentUser as defaultUser,
} from '../data/mockData';
import { studentPeers } from '../data/peersData';

const STORAGE_KEYS = {
  DOUBTS: 'skillbridge_doubts',
  HELP_OFFERS: 'skillbridge_help_offers',
  SESSIONS: 'skillbridge_sessions',
  NOTIFICATIONS: 'skillbridge_notifications',
  USER: 'skillbridge_user',
  TRANSACTIONS: 'skillbridge_transactions',
  LEADERBOARD: 'skillbridge_leaderboard',
  PEERS: 'skillbridge_peers',
  USER_AVAILABILITY: 'skillbridge_user_availability',
};

const initialSessions = [
  {
    id: 1,
    doubtId: 2,
    helper: { name: 'Ananya Sharma', initials: 'AS', college: 'IIT Delhi' },
    student: { name: 'Kartik Mehta', initials: 'KM', college: 'IIT Bombay' },
    topic: 'React useEffect & Hooks Deep Dive',
    skills: ['React', 'JavaScript'],
    date: 'Today',
    time: '4:00 PM — 4:45 PM',
    duration: '30 min',
    bounty: 25,
    status: 'upcoming',
    type: 'video',
    roomName: 'SkillBridge_P2P_1_v8x9a2',
    notes: 'Covered dependency array pitfalls, abort controller for cleanup, and stale closures.',
    chatMessages: [
      {
        id: 'msg-1',
        sender: 'Ananya Sharma',
        initials: 'AS',
        text: 'Hey Kartik! Looking forward to diving into the useEffect WebSocket cleanup issue.',
        time: '3:58 PM',
      },
    ],
  },
  {
    id: 2,
    doubtId: 1,
    helper: { name: 'Rahul Verma', initials: 'RV', college: 'NIT Trichy' },
    student: { name: 'Kartik Mehta', initials: 'KM', college: 'IIT Bombay' },
    topic: 'Binary Tree Traversals & BST Problems',
    skills: ['DSA', 'C++'],
    date: 'Tomorrow',
    time: '10:00 AM — 10:30 AM',
    duration: '30 min',
    bounty: 30,
    status: 'upcoming',
    type: 'video',
    roomName: 'SkillBridge_P2P_2_k3m8p1',
    notes: '',
    chatMessages: [
      {
        id: 'msg-1',
        sender: 'Rahul Verma',
        initials: 'RV',
        text: 'Hey! I have the rotation visualizer ready. See you tomorrow at 10 AM.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 3,
    doubtId: 4,
    helper: { name: 'Priya Patel', initials: 'PP', college: 'NIFT Mumbai' },
    student: { name: 'Kartik Mehta', initials: 'KM', college: 'IIT Bombay' },
    topic: 'Figma Component Library Setup',
    skills: ['Figma', 'UI/UX'],
    date: 'Nov 22, 2026',
    time: '2:00 PM — 2:45 PM',
    duration: '45 min',
    bounty: 20,
    status: 'completed',
    type: 'video',
    rating: 5,
    feedback: 'Super clear explanations on nested auto-layouts and variants!',
    notes: 'Structure frames with hug-contents on parent, fill-container on children.',
    rewarded: true,
  },
  {
    id: 4,
    doubtId: 3,
    helper: { name: 'Arjun Krishnan', initials: 'AK', college: 'BITS Pilani' },
    student: { name: 'Kartik Mehta', initials: 'KM', college: 'IIT Bombay' },
    topic: 'Eigenvalue Decomposition Explained',
    skills: ['Mathematics', 'Linear Algebra'],
    date: 'Nov 20, 2026',
    time: '6:00 PM — 6:30 PM',
    duration: '30 min',
    bounty: 25,
    status: 'completed',
    type: 'video',
    rating: 4,
    feedback: 'Great step-by-step math walkthrough for 4x4 matrix characteristic equation.',
    notes: 'Calculate det(A - lambda*I) = 0 first. Then find null space.',
    rewarded: true,
  },
  {
    id: 5,
    doubtId: 5,
    helper: { name: 'Sneha Reddy', initials: 'SR', college: 'VIT Vellore' },
    student: { name: 'Kartik Mehta', initials: 'KM', college: 'IIT Bombay' },
    topic: 'Arduino Serial Communication Debugging',
    skills: ['Arduino', 'Electronics'],
    date: 'Nov 18, 2026',
    time: '11:00 AM — 11:40 AM',
    duration: '40 min',
    bounty: 20,
    status: 'cancelled',
    type: 'video',
  },
];

const initialHelpOffers = [
  {
    id: 'offer-1',
    doubtId: 2, // React useEffect doubt
    doubtTitle: 'React useEffect cleanup function not working',
    studentName: 'Meera S.',
    offeredBy: {
      name: 'Kartik Mehta',
      initials: 'KM',
      college: 'IIT Bombay',
      isCurrentUser: true,
    },
    message: 'Hey Meera! I had this exact WebSocket unmount issue last week. Can help you debug the event listener closure.',
    status: 'accepted',
    createdAt: Date.now() - 3600000 * 4,
    timeSlot: 'Today, 5:30 PM',
  },
  {
    id: 'offer-2',
    doubtId: 1, // Red-Black Tree
    doubtTitle: 'How to implement a Red-Black Tree from scratch?',
    studentName: 'Karan M.',
    offeredBy: {
      name: 'Kartik Mehta',
      initials: 'KM',
      college: 'IIT Bombay',
      isCurrentUser: true,
    },
    message: 'Can walk you through insertion rotations and recoloring step-by-step with diagrams.',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 2,
    timeSlot: 'Tomorrow, 2:00 PM',
  },
];

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Offer Accepted! 🎉',
    message: 'Meera S. accepted your help offer for "React useEffect cleanup function not working".',
    time: '2 hours ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'New Response on Your Doubt',
    message: 'Ananya Sharma left a tip on your doubt about SQL query indexing.',
    time: '4 hours ago',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-3',
    title: '+45 Points Earned',
    message: 'You earned 45 points for helping students this week.',
    time: 'Yesterday',
    read: true,
    type: 'award',
  },
];

const initialTransactions = [
  {
    id: 'tx-1',
    title: 'Weekly Mentorship Activity Reward',
    amount: 45,
    type: 'credit',
    category: 'Platform Bonus',
    date: 'Nov 22, 2026',
    time: '4:30 PM',
  },
  {
    id: 'tx-2',
    title: 'Bounty Reserved: Red-Black Tree Doubt',
    amount: -30,
    type: 'debit',
    category: 'Doubt Bounty',
    date: 'Nov 20, 2026',
    time: '2:15 PM',
  },
  {
    id: 'tx-3',
    title: 'Completed Session: Figma Component Setup',
    amount: 25,
    type: 'credit',
    category: 'Mentorship Reward',
    date: 'Nov 18, 2026',
    time: '3:00 PM',
  },
];

const initialLeaderboard = [
  { rank: 1, name: 'Ananya Sharma', points: 1240, sessions: 128, initials: 'AS', college: 'IIT Delhi' },
  { rank: 2, name: 'Rahul Verma', points: 980, sessions: 95, initials: 'RV', college: 'NIT Trichy' },
  { rank: 3, name: 'Priya Patel', points: 820, sessions: 73, initials: 'PP', college: 'NIFT Mumbai' },
  { rank: 4, name: 'Kartik Mehta', points: 280, sessions: 14, initials: 'KM', college: 'IIT Bombay', isCurrentUser: true },
  { rank: 5, name: 'Arjun Krishnan', points: 650, sessions: 61, initials: 'AK', college: 'BITS Pilani' },
  { rank: 6, name: 'Sneha Reddy', points: 580, sessions: 54, initials: 'SR', college: 'VIT Vellore' },
];

function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  getDoubts() {
    return safeGet(STORAGE_KEYS.DOUBTS, sampleDoubts);
  },
  setDoubts(doubts) {
    safeSet(STORAGE_KEYS.DOUBTS, doubts);
  },

  getHelpOffers() {
    return safeGet(STORAGE_KEYS.HELP_OFFERS, initialHelpOffers);
  },
  setHelpOffers(offers) {
    safeSet(STORAGE_KEYS.HELP_OFFERS, offers);
  },

  getSessions() {
    const rawSessions = safeGet(STORAGE_KEYS.SESSIONS, initialSessions);
    return (rawSessions || []).map((s) => ({
      ...s,
      duration: s.duration || '15 min',
      roomName: s.roomName || `SkillBridge_P2P_${s.id}_${Math.abs(Number(s.id) * 2654435761 % 1000000).toString(36)}`,
    }));
  },
  setSessions(sessions) {
    safeSet(STORAGE_KEYS.SESSIONS, sessions);
  },

  getNotifications() {
    return safeGet(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },
  setNotifications(notifications) {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  getUser() {
    const raw = safeGet(STORAGE_KEYS.USER, defaultUser);
    const availability = safeGet(STORAGE_KEYS.USER_AVAILABILITY, 'available');
    return {
      ...raw,
      availability: raw.availability || availability,
      xp: raw.xp || raw.points || 280,
    };
  },
  setUser(user) {
    safeSet(STORAGE_KEYS.USER, user);
  },

  getTransactions() {
    return safeGet(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  },
  setTransactions(transactions) {
    safeSet(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  getLeaderboard() {
    return safeGet(STORAGE_KEYS.LEADERBOARD, initialLeaderboard);
  },
  setLeaderboard(leaderboard) {
    safeSet(STORAGE_KEYS.LEADERBOARD, leaderboard);
  },

  getPeers() {
    return safeGet(STORAGE_KEYS.PEERS, studentPeers);
  },
  setPeers(peers) {
    safeSet(STORAGE_KEYS.PEERS, peers);
  },

  getUserAvailability() {
    return safeGet(STORAGE_KEYS.USER_AVAILABILITY, 'available');
  },
  setUserAvailability(status) {
    safeSet(STORAGE_KEYS.USER_AVAILABILITY, status);
  },

  resetAll() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
