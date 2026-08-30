import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import PlatformProfile from "../models/PlatformProfile.js";
import Role from "../models/Role.js";
import { aggregateUserSkills, computeSkillGap, computeProfileStrength } from "../services/skillAnalyzer.js";
import { searchJobs } from "../services/adzunaService.js";
import { extractJobSkills, scoreJobMatch } from "../services/jobMatcher.js";

const PLATFORM_DISPLAY_NAMES = {
  github: "GitHub",
  leetcode: "LeetCode",
  geeksforgeeks: "GeeksforGeeks",
  codechef: "CodeChef",
  hackerrank: "HackerRank",
  codeforces: "Codeforces",
  linkedin: "LinkedIn",
  gitlab: "GitLab",
  kaggle: "Kaggle",
  hackerearth: "HackerEarth",
};

function relativeTime(date) {
  if (!date) return "";
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated 1 day ago";
  if (days < 14) return `Updated ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Updated ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
}

// Deterministic, no extra AI call - built from the same real gap/profile
// numbers already computed below, so it never drifts from what the
// Skill Gap page itself shows.
function buildRecommendations({ topSkillsToImprove, targetRole, profileStrength, githubConnected }) {
  const recs = [];

  for (const skill of topSkillsToImprove.slice(0, 2)) {
    recs.push(`Learn ${skill.label} – a ${skill.priority.toLowerCase()} for ${targetRole} roles.`);
  }

  if (!githubConnected) {
    recs.push("Connect your GitHub – showcase real code and pick up platform-based skills automatically.");
  } else if (profileStrength < 70) {
    recs.push("Add more detailed projects – descriptions and tech stacks raise your profile strength.");
  }

  if (recs.length === 0) {
    recs.push("You're in great shape for this role - check Jobs for your best current matches.");
  }

  return recs.slice(0, 3);
}

// GET /api/dashboard
export async function getDashboardData(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const targetRole = profile?.targetRole || "Full-Stack Developer";
    const country = process.env.ADZUNA_COUNTRY || "in";

    const [role, projects, platformProfiles] = await Promise.all([
      Role.findOne({ name: targetRole }),
      Project.find({ user: req.user._id }).sort({ updatedAt: -1 }),
      PlatformProfile.find({ user: req.user._id }),
    ]);

    const userSkillsMap = aggregateUserSkills(profile?.skills || []);

    // Falls back to an empty gap shape if this role hasn't been seeded
    // yet, rather than 500ing the whole dashboard over one missing Role doc.
    const gap = role
      ? computeSkillGap(role, userSkillsMap)
      : {
          overallMatch: 0,
          skillsMatched: 0,
          totalSkills: 0,
          skillsToImprove: 0,
          priority: "Low",
          skillOverview: { strong: [], developing: [], needsImprovement: [] },
          topSkillsToImprove: [],
        };

    const githubProfile = platformProfiles.find((p) => p.platform === "github");

    const profileStrength = computeProfileStrength({
      hasResume: !!profile?.resume?.fileName,
      projectCount: projects.length,
      projectsWithDetails: projects.filter((p) => p.description && p.techStack?.length > 0).length,
      githubConnected: !!githubProfile,
    });

    // Best-effort live job search - if Adzuna isn't configured or the
    // call fails, the dashboard still renders with zeroed job stats
    // rather than crashing the whole page over an external API.
    let topJobs = [];
    let bestMatchJobs = 0;
    try {
      const { results } = await searchJobs({ what: targetRole, country, resultsPerPage: 15 });
      const scored = await Promise.all(
        results.map(async (job) => {
          const jobSkills = await extractJobSkills({ title: job.title, description: job.description });
          const { match } = scoreJobMatch(profile?.skills || [], jobSkills);
          return {
            title: job.title,
            company: job.company?.display_name || "Unknown company",
            location: job.location?.display_name || "Location not specified",
            match,
          };
        })
      );
      scored.sort((a, b) => b.match - a.match);
      topJobs = scored.slice(0, 3);
      bestMatchJobs = scored.filter((j) => j.match >= 75).length;
    } catch {
      // Silently degrade - dashboardService caller doesn't need to know why.
    }

    const connectedProfiles = [
      ...new Set(
        platformProfiles.map((p) => PLATFORM_DISPLAY_NAMES[p.platform] || p.platform)
      ),
    ];

    const recentProjects = projects.slice(0, 2).map((p) => ({
      name: p.name,
      stack: (p.techStack || []).length > 0 ? p.techStack.join(" · ") : "No tech stack listed",
      updated: relativeTime(p.updatedAt),
      link: p.liveUrl || p.githubUrl || null,
    }));

    const aiRecommendations = buildRecommendations({
      topSkillsToImprove: gap.topSkillsToImprove,
      targetRole,
      profileStrength,
      githubConnected: !!githubProfile,
    });

    res.json({
      user: {
        location: profile?.location || "",
        status: profile?.status || "",
      },
      roleReadiness: { role: targetRole, percentage: gap.overallMatch },
      bestMatchJobs,
      skillsAnalysed: userSkillsMap.size,
      profileStrength,
      skillOverview: {
        strong: gap.skillOverview.strong.slice(0, 4),
        developing: gap.skillOverview.developing.slice(0, 4),
        needsImprovement: gap.skillOverview.needsImprovement.slice(0, 4),
      },
      topJobs,
      skillGaps: gap.topSkillsToImprove.slice(0, 5).map((s) => ({
        label: s.label,
        value: s.value,
        priority: s.priority,
      })),
      aiRecommendations,
      recentProjects,
      connectedProfiles,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard", error: err.message });
  }
}
