import Profile from "../models/Profile.js";
import PlatformProfile from "../models/PlatformProfile.js";

// GET /api/skills/board
// Pulls together the three skill sources: what GitHub activity shows,
// what the resume says, and what the user is manually targeting.
export async function getSkillBoard(req, res) {
  try {
    const [profile, github] = await Promise.all([
      Profile.findOne({ user: req.user._id }),
      PlatformProfile.findOne({ user: req.user._id, platform: "github" }),
    ]);

    const platformSkills = github?.data?.languages || [];

    const resumeSkills = (profile?.skills || [])
      .filter((s) => s.source === "resume")
      .map((s) => ({ name: s.name, proficiency: s.proficiency }));

    const desiredSkills = profile?.desiredSkills || [];

    res.json({
      targetRole: profile?.targetRole || "Full-Stack Developer",
      platformSkills,
      resumeSkills,
      desiredSkills,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load skill board", error: err.message });
  }
}

// PUT /api/skills/desired  { skills: ["Docker", "AWS"] }
// Full replace, not append - the frontend sends the complete current list.
export async function updateDesiredSkills(req, res) {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "skills must be an array of strings" });
    }

    const cleaned = [...new Set(skills.map((s) => String(s).trim()).filter(Boolean))];

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { desiredSkills: cleaned } },
      { upsert: true, new: true }
    );

    res.json({ desiredSkills: profile.desiredSkills });
  } catch (err) {
    res.status(500).json({ message: "Failed to update desired skills", error: err.message });
  }
}
