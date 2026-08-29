function normalizeName(name) {
  return name.trim().toLowerCase();
}

// Merges a user's per-source skills (resume/github/manual) into one
// proficiency-per-skill map, keeping the HIGHEST proficiency seen for
// a given skill across sources (e.g. if both resume and GitHub mention
// "React", the stronger signal wins).
export function aggregateUserSkills(profileSkills = []) {
  const map = new Map();
  for (const s of profileSkills) {
    if (!s.name) continue;
    const key = normalizeName(s.name);
    const existing = map.get(key);
    const proficiency = typeof s.proficiency === "number" ? s.proficiency : 0.5;
    if (!existing || proficiency > existing.proficiency) {
      map.set(key, { name: existing?.name || s.name, proficiency });
    }
  }
  return map;
}

// role: { skills: [{ name, weight }] } from the Role model
// userSkillsMap: Map from aggregateUserSkills()
//
// overallMatch = Σ(weight * proficiency) / Σ(weight) - same formula
// as the original planning doc. Nothing here is AI-generated.
export function computeSkillGap(role, userSkillsMap) {
  const roleSkills = role.skills || [];

  let weightedSum = 0;
  let weightTotal = 0;
  let matchedCount = 0;

  const strong = [];
  const developing = [];
  const needsImprovement = [];
  const improveCandidates = [];

  for (const rs of roleSkills) {
    const key = normalizeName(rs.name);
    const userSkill = userSkillsMap.get(key);
    const proficiency = userSkill?.proficiency ?? 0;

    weightedSum += rs.weight * proficiency;
    weightTotal += rs.weight;

    if (proficiency >= 0.7) {
      strong.push(rs.name);
      matchedCount += 1;
    } else if (proficiency >= 0.35) {
      developing.push(rs.name);
    } else {
      needsImprovement.push(rs.name);
      improveCandidates.push({ name: rs.name, weight: rs.weight, proficiency });
    }
  }

  const overallMatch = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 100) : 0;

  const topSkillsToImprove = improveCandidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6)
    .map((s) => ({
      label: s.name,
      priority: s.weight >= 8 ? "High Priority" : s.weight >= 5 ? "Medium Priority" : "Low Priority",
      value: Math.round(s.proficiency * 100),
      resources: Math.max(4, Math.round((1 - s.proficiency) * 20)),
    }));

  const priority =
    topSkillsToImprove[0]?.priority === "High Priority"
      ? "High"
      : topSkillsToImprove[0]?.priority === "Medium Priority"
      ? "Medium"
      : "Low";

  return {
    overallMatch,
    skillsMatched: matchedCount,
    totalSkills: roleSkills.length,
    skillsToImprove: needsImprovement.length,
    priority,
    skillOverview: { strong, developing, needsImprovement },
    topSkillsToImprove,
  };
}

// Profile strength is DELIBERATELY independent of the target role's
// skill match - it measures how complete the user's profile itself is
// (resume uploaded, real projects with real detail, GitHub connected).
// Someone could be 100% profile-strong while still being a poor match
// for a specific role, and vice versa.
export function computeProfileStrength({ hasResume, projectCount, projectsWithDetails, githubConnected }) {
  let score = 0;

  if (hasResume) score += 30;
  score += Math.min(projectCount, 5) * 8; // up to 40 for 5+ projects
  score += Math.min(projectsWithDetails, 5) * 4; // up to 20 for well-described projects
  if (githubConnected) score += 10;

  return Math.min(100, Math.round(score));
}
