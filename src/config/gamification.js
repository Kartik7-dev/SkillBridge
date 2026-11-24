/**
 * SkillBridge Centralized Gamification & Reputation Configuration
 */

export const REWARDS = {
  SESSION_COMPLETED: 50,     // XP awarded to helper for completing a session
  POSITIVE_RATING: 20,       // Bonus XP for 4 or 5 star ratings
  HELPFUL_SOLUTION: 10,      // Bonus XP when student saves takeaway notes
  REQUESTER_COMPLETION: 15,  // Bonus XP to student for successfully receiving help & learning
};

export const LEVELS = [
  { level: 1, title: 'Beginner', minXp: 0, maxXp: 99, badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
  { level: 2, title: 'Contributor', minXp: 100, maxXp: 249, badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { level: 3, title: 'Mentor', minXp: 250, maxXp: 499, badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { level: 4, title: 'Expert', minXp: 500, maxXp: 999, badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { level: 5, title: 'Campus Legend', minXp: 1000, maxXp: Infinity, badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export const BADGE_DEFINITIONS = [
  {
    id: 'first_helper',
    name: 'First Helper',
    icon: 'HandHeart',
    description: 'Successfully completed your first peer help session.',
    condition: (stats) => (stats.sessionsCount || 0) >= 1,
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    icon: 'CheckCircle2',
    description: 'Helped resolve 5 or more student doubts.',
    condition: (stats) => (stats.doubtsSolved || stats.sessionsCount || 0) >= 5,
  },
  {
    id: 'quick_responder',
    name: 'Quick Responder',
    icon: 'Zap',
    description: 'Consistently accepts and joins peer sessions in under 15 minutes.',
    condition: (stats) => (stats.rating || 0) >= 4.5 && (stats.sessionsCount || 0) >= 3,
  },
  {
    id: 'top_mentor',
    name: 'Top Mentor',
    icon: 'Award',
    description: 'Maintained a 4.8+ rating across 10+ completed mentorship sessions.',
    condition: (stats) => (stats.rating || 0) >= 4.8 && (stats.sessionsCount || 0) >= 10,
  },
  {
    id: 'ten_doubts_solved',
    name: '10 Doubts Solved',
    icon: 'Trophy',
    description: 'Helped solve 10 or more technical or academic doubts.',
    condition: (stats) => (stats.doubtsSolved || stats.sessionsCount || 0) >= 10,
  },
];

/**
 * Calculate user level based on XP
 */
export function getUserLevel(xp = 0) {
  const currentXp = Math.max(0, Number(xp) || 0);
  const currentLevel = LEVELS.find(
    (lvl) => currentXp >= lvl.minXp && (lvl.maxXp === Infinity || currentXp <= lvl.maxXp)
  ) || LEVELS[0];

  const nextLevel = LEVELS.find((lvl) => lvl.level === currentLevel.level + 1);

  let progressPercent = 100;
  let xpNeededForNext = 0;

  if (nextLevel) {
    const range = nextLevel.minXp - currentLevel.minXp;
    const progress = currentXp - currentLevel.minXp;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    xpNeededForNext = nextLevel.minXp - currentXp;
  }

  return {
    ...currentLevel,
    currentXp,
    progressPercent,
    xpNeededForNext,
    nextLevelTitle: nextLevel?.title || 'Max Level',
  };
}

/**
 * Get earned badges for given user stats
 */
export function getEarnedBadges(userStats = {}) {
  return BADGE_DEFINITIONS.filter((badge) => badge.condition(userStats));
}
