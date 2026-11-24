/**
 * SkillBridge Smart Peer Matching Algorithm
 * Calculates a multi-factor score out of 100 points:
 * - Skill & Topic Match: 40 points
 * - Subject Relevance: 25 points
 * - Peer Availability: 15 points
 * - Peer Reputation / Rating: 10 points
 * - Previous Successful Sessions: 10 points
 */

// Normalized skill synonym dictionary & related concepts
const SKILL_CLUSTERS = {
  dsa: ['dsa', 'data structures', 'algorithms', 'trees', 'graphs', 'dynamic programming', 'bst', 'recursion', 'sorting', 'arrays'],
  cpp: ['c++', 'cpp', 'c', 'pointers', 'oop', 'stl', 'memory management'],
  python: ['python', 'py', 'django', 'flask', 'pandas', 'numpy', 'scipy', 'scripting'],
  java: ['java', 'spring', 'springboot', 'jvm', 'oop', 'multithreading'],
  web: ['web development', 'web', 'frontend', 'html', 'css', 'javascript', 'typescript', 'tailwind'],
  react: ['react', 'react.js', 'reactjs', 'hooks', 'redux', 'next.js', 'nextjs', 'websocket', 'state management'],
  dbms: ['dbms', 'sql', 'database', 'postgres', 'postgresql', 'mysql', 'mongodb', 'indexing', 'queries', 'optimization'],
  aiml: ['ai/ml', 'ai', 'ml', 'machine learning', 'deep learning', 'neural networks', 'pytorch', 'tensorflow', 'nlp', 'computer vision'],
  math: ['mathematics', 'math', 'linear algebra', 'calculus', 'probability', 'statistics', 'eigenvalues', 'matrices', 'discrete math'],
  electronics: ['electronics', 'arduino', 'raspberry pi', 'embedded', 'iot', 'circuits', 'sensors', 'embedded c', 'hardware'],
  cad: ['cad', 'cad & design', 'solidworks', 'autocad', 'catia', '3d modeling', 'fusion 360', 'ansys'],
  design: ['ui/ux', 'design', 'figma', 'prototyping', 'wireframing', 'design systems', 'auto-layout', 'user research'],
};

/**
 * Clean & normalize a string token
 */
export function normalizeToken(str = '') {
  return str
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, '')
    .trim();
}

/**
 * Check if two skill strings are semantically related or match
 */
export function areSkillsRelated(skillA = '', skillB = '') {
  const a = normalizeToken(skillA);
  const b = normalizeToken(skillB);

  if (a === b) return 1.0;
  if (a.includes(b) || b.includes(a)) return 0.85;

  // Check cluster overlap
  for (const cluster of Object.values(SKILL_CLUSTERS)) {
    const hasA = cluster.some((item) => a === item || a.includes(item) || item.includes(a));
    const hasB = cluster.some((item) => b === item || b.includes(item) || item.includes(b));
    if (hasA && hasB) {
      return 0.75;
    }
  }

  return 0.0;
}

/**
 * Calculate the match score between a Doubt and a Peer Candidate
 */
export function calculateMatchScore(doubt, peer) {
  if (!doubt || !peer) return { totalScore: 0, breakdown: {}, reasons: [] };

  const doubtSkills = (doubt.skills || []).map(normalizeToken);
  const peerSkills = (peer.skills || []).map(normalizeToken);
  const doubtTitle = normalizeToken(doubt.title || '');
  const doubtDesc = normalizeToken(doubt.description || '');
  const doubtCategory = normalizeToken(doubt.category || '');

  const reasons = [];

  // 1. Skill & Topic Match (Max 40 points)
  let skillPoints = 0;
  let matchedSkillNames = [];

  if (doubtSkills.length > 0 && peerSkills.length > 0) {
    let directMatches = 0;
    let clusterMatches = 0;

    for (const dSkill of doubtSkills) {
      let bestSim = 0;
      let bestPeerSkill = '';

      for (const pSkill of peerSkills) {
        const sim = areSkillsRelated(dSkill, pSkill);
        if (sim > bestSim) {
          bestSim = sim;
          bestPeerSkill = pSkill;
        }
      }

      if (bestSim >= 0.95) {
        directMatches++;
        matchedSkillNames.push(dSkill);
      } else if (bestSim >= 0.7) {
        clusterMatches++;
        matchedSkillNames.push(bestPeerSkill || dSkill);
      }
    }

    const matchRatio = (directMatches * 1.0 + clusterMatches * 0.7) / Math.max(1, doubtSkills.length);
    skillPoints = Math.min(35, matchRatio * 35);
  }

  // Bonus for textual topic keywords found in peer skills or bio (up to 5 points)
  let keywordBonus = 0;
  for (const pSkill of peerSkills) {
    if (doubtTitle.includes(pSkill) || doubtDesc.includes(pSkill)) {
      keywordBonus += 2.5;
    }
  }
  skillPoints = Math.min(40, skillPoints + Math.min(5, keywordBonus));

  if (matchedSkillNames.length > 0) {
    const uniqueMatched = [...new Set(matchedSkillNames)].map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    );
    reasons.push(`Strong proficiency in ${uniqueMatched.slice(0, 3).join(', ')}`);
  }

  // 2. Subject / Category Relevance (Max 25 points)
  let categoryPoints = 0;
  const peerCategories = (peer.categories || []).map(normalizeToken);
  const peerBio = normalizeToken(peer.bio || '');

  if (doubtCategory) {
    if (peerCategories.includes(doubtCategory)) {
      categoryPoints = 25;
      reasons.push(`Direct subject specialist in ${doubt.category}`);
    } else {
      // Check if any peer skill matches the category
      const relatedToCategory = peerSkills.some(
        (ps) => areSkillsRelated(ps, doubtCategory) > 0.6
      ) || peerBio.includes(doubtCategory);

      if (relatedToCategory) {
        categoryPoints = 18;
        reasons.push(`Experienced with ${doubt.category} core coursework`);
      } else {
        categoryPoints = 10; // Baseline general STEM peer
      }
    }
  } else {
    categoryPoints = 15;
  }

  // 3. Availability (Max 15 points)
  let availabilityPoints = 0;
  const peerStatus = (peer.availability || (peer.available ? 'available' : 'offline')).toLowerCase();

  if (peerStatus === 'available') {
    availabilityPoints = 15;
    reasons.push('🟢 Currently online and available to help now');
  } else if (peerStatus === 'busy') {
    availabilityPoints = 8;
    reasons.push('🟡 Busy with a session, available shortly');
  } else {
    availabilityPoints = 2; // Offline peers ranked lower
    reasons.push('⚫ Currently offline (asynchronous or scheduled)');
  }

  // 4. Peer Reputation & Average Rating (Max 10 points)
  const rating = Number(peer.rating) || 4.5;
  const ratingPoints = Math.min(10, Math.max(0, (rating / 5.0) * 10));
  if (rating >= 4.8) {
    reasons.push(`⭐ Top-rated peer mentor (${rating.toFixed(1)} / 5.0 stars)`);
  }

  // 5. Previous Successful Help Sessions / Doubts Solved (Max 10 points)
  const solvedCount = Number(peer.doubtsSolved || peer.sessions || 0);
  const solvedPoints = Math.min(10, Math.max(0, (solvedCount / 25) * 10));
  if (solvedCount >= 10) {
    reasons.push(`Proven track record with ${solvedCount} doubts solved`);
  }

  // Calculate integer breakdown components
  const skillScore = Math.min(40, Math.max(0, Math.round(skillPoints)));
  const categoryScore = Math.min(25, Math.max(0, Math.round(categoryPoints)));
  const availabilityScore = Math.min(15, Math.max(0, Math.round(availabilityPoints)));
  const reputationScore = Math.min(10, Math.max(0, Math.round(ratingPoints)));
  const experienceScore = Math.min(10, Math.max(0, Math.round(solvedPoints)));

  // Total score is strictly the exact sum of breakdown components (never exceeds 100)
  const totalScore = Math.min(
    100,
    Math.max(0, skillScore + categoryScore + availabilityScore + reputationScore + experienceScore)
  );

  // Generate concise human recommendation statement based on actual user data
  let recommendationStatement = '';
  if (matchedSkillNames.length > 0 && solvedCount > 0) {
    recommendationStatement = `Recommended because they have verified ${matchedSkillNames[0]?.toUpperCase() || 'technical'} problem-solving experience and have guided ${solvedCount}+ students successfully.`;
  } else if (matchedSkillNames.length > 0) {
    recommendationStatement = `Recommended because their expertise closely matches the ${doubt.category || 'doubt'} topics and required skills.`;
  } else {
    recommendationStatement = `Recommended as an active campus mentor with a strong ${rating.toFixed(1)}★ rating and relevant academic background.`;
  }

  return {
    totalScore,
    matchPercentage: totalScore,
    recommendationStatement,
    reasons,
    breakdown: {
      skillScore,
      categoryScore,
      availabilityScore,
      reputationScore,
      experienceScore,
    },
  };
}

/**
 * Filter, score, and rank peer candidates for a given doubt
 */
export function findSmartMatches(doubt, allPeers = [], currentUser = {}) {
  if (!doubt || !Array.isArray(allPeers)) return [];

  // Normalized author identification to prevent self-matching
  const authorNames = [
    normalizeToken(doubt.postedBy),
    normalizeToken(currentUser?.fullName),
    normalizeToken(currentUser?.name),
    'kartik mehta',
    'kartik m.',
  ].filter(Boolean);

  // Exclude doubt author and current user
  const eligibleCandidates = allPeers.filter((peer) => {
    const peerName = normalizeToken(peer.name);
    const peerId = peer.id;

    // Check author/user collision
    if (authorNames.includes(peerName)) return false;
    if (currentUser?.id && peerId === currentUser.id) return false;
    if (peer.isCurrentUser) return false;

    return true;
  });

  // Calculate scores for all eligible peers
  const scored = eligibleCandidates.map((peer) => {
    const matchData = calculateMatchScore(doubt, peer);
    return {
      ...peer,
      matchScore: matchData.totalScore,
      matchPercentage: matchData.matchPercentage,
      recommendationStatement: matchData.recommendationStatement,
      reasons: matchData.reasons,
      breakdown: matchData.breakdown,
    };
  });

  // Sort descending: by matchScore, then rating, then availability, then doubtsSolved
  const ranked = scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // Prioritize available
    const aAvail = a.availability === 'available' ? 2 : a.availability === 'busy' ? 1 : 0;
    const bAvail = b.availability === 'available' ? 2 : b.availability === 'busy' ? 1 : 0;
    if (bAvail !== aAvail) return bAvail - aAvail;

    // Prioritize rating
    return (b.rating || 0) - (a.rating || 0);
  });

  // Flag the highest-ranked candidate as isBestMatch
  return ranked.map((peer, idx) => ({
    ...peer,
    isBestMatch: idx === 0 && peer.matchScore >= 60,
  }));
}
