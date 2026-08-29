import Role from "../models/Role.js";
import { aggregateUserSkills } from "./skillAnalyzer.js";

// The master skill vocabulary comes from every Role ever seeded/created,
// not a hardcoded list - so adding a new Role (e.g. via seedRoles.js or
// an admin later) automatically teaches the job matcher new skills to
// look for, with zero code changes here.
let cache = { skills: [], expiresAt: 0 };

async function getMasterSkillList() {
  if (Date.now() < cache.expiresAt) return cache.skills;

  const roles = await Role.find().select("skills.name");
  const set = new Set();
  for (const role of roles) {
    for (const s of role.skills || []) {
      if (s.name) set.add(s.name);
    }
  }

  cache = { skills: [...set], expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 min TTL
  return cache.skills;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Custom boundary instead of \b: plain \b breaks for skill names that
// end in punctuation (C++, C#) because \b requires a word/non-word
// transition, and "+"/"#" followed by a space are both non-word - so
// \b never fires there. This checks "not immediately touching another
// letter/digit" on both sides instead, which works for every skill
// name shape.
function buildSkillPattern(skill) {
  return new RegExp(`(?<![a-zA-Z0-9])${escapeRegex(skill)}(?![a-zA-Z0-9])`, "i");
}

// Scans a job's title + description for any known skill name (word
// boundary, case-insensitive). A skill mentioned in the title counts
// for more than one only found deep in the description - a job titled
// "Docker Engineer" cares about Docker more than one that mentions it
// once in a long paragraph.
export async function extractJobSkills(job) {
  const masterList = await getMasterSkillList();
  const title = job.title || "";
  const description = job.description || "";

  const found = [];
  for (const skill of masterList) {
    const pattern = buildSkillPattern(skill);
    const inTitle = pattern.test(title);
    const inDescription = pattern.test(description);
    if (inTitle || inDescription) {
      found.push({ name: skill, weight: inTitle ? 3 : 1 });
    }
  }
  return found;
}

// profileSkills: the user's Profile.skills array (resume + github + manual)
// jobSkills: [{ name, weight }] from extractJobSkills()
//
// Same weighted-average shape as skillAnalyzer.computeSkillGap, just
// scoped to one job's ad-hoc skill list instead of a persisted Role.
export function scoreJobMatch(profileSkills, jobSkills) {
  const userSkillsMap = aggregateUserSkills(profileSkills);

  let weightedSum = 0;
  let weightTotal = 0;
  const tags = [];

  for (const js of jobSkills) {
    const key = js.name.trim().toLowerCase();
    const userSkill = userSkillsMap.get(key);
    const proficiency = userSkill?.proficiency ?? 0;

    weightedSum += js.weight * proficiency;
    weightTotal += js.weight;

    tags.push({ label: js.name, matched: proficiency >= 0.5 });
  }

  const match = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 100) : 0;

  // Cap displayed tags so a description-stuffed posting doesn't render
  // fifty pills - lead with matched skills so the user sees their wins
  // first, then a few gaps.
  const matchedTags = tags.filter((t) => t.matched).slice(0, 4);
  const gapTags = tags.filter((t) => !t.matched).slice(0, Math.max(0, 6 - matchedTags.length));

  return { match, tags: [...matchedTags, ...gapTags] };
}
