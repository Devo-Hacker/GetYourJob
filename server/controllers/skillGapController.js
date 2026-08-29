import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import PlatformProfile from "../models/PlatformProfile.js";
import Role from "../models/Role.js";
import {
  aggregateUserSkills,
  computeSkillGap,
  computeProfileStrength,
} from "../services/skillAnalyzer.js";

function toIconKey(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// GET /api/skill-gap?role=ML Engineer  (role is optional - defaults to
// the user's saved targetRole)
export async function getSkillGap(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const targetRoleName = req.query.role || profile?.targetRole || "Full-Stack Developer";

    const role = await Role.findOne({ name: targetRoleName });
    if (!role) {
      return res.status(404).json({ message: `No skill data found for role "${targetRoleName}"` });
    }

    const userSkillsMap = aggregateUserSkills(profile?.skills || []);
    const gap = computeSkillGap(role, userSkillsMap);

    const [projects, github] = await Promise.all([
      Project.find({ user: req.user._id }),
      PlatformProfile.findOne({ user: req.user._id, platform: "github" }),
    ]);

    const profileStrength = computeProfileStrength({
      hasResume: !!profile?.resume?.fileName,
      projectCount: projects.length,
      projectsWithDetails: projects.filter((p) => p.description && p.techStack?.length > 0).length,
      githubConnected: !!github,
    });

    const recommendedNextSteps = gap.topSkillsToImprove.slice(0, 3).map((s) => ({
      icon: toIconKey(s.label),
      title: `Learn ${s.label}`,
      time: null,
    }));

    res.json({
      targetRole: targetRoleName,
      ...gap,
      profileStrength,
      recommendedNextSteps,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute skill gap", error: err.message });
  }
}

// GET /api/skill-gap/roles - list of role names the dropdown can offer
export async function listRoles(req, res) {
  const roles = await Role.find().select("name").sort({ name: 1 });
  res.json({ roles: roles.map((r) => r.name) });
}
