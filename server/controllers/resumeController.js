import fs from "fs";
import pdfParse from "pdf-parse";
import Profile from "../models/Profile.js";
import { extractSkillsFromResume } from "../services/geminiService.js";

// POST /api/resume  (multipart/form-data, field name: "resume")
export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdfParse(buffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim().length < 30) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Couldn't read text from that PDF - is it a scanned image?" });
    }

    const extracted = await extractSkillsFromResume(resumeText);

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    profile.resume = {
      fileName: req.file.originalname,
      uploadedAt: new Date(),
      parsedText: resumeText.slice(0, 5000),
    };

    // Replace only the resume-sourced skills; keep github/manual ones intact.
    const nonResumeSkills = profile.skills.filter((s) => s.source !== "resume");
    const resumeSkills = (extracted.skills || []).map((s) => ({
      name: s.name,
      proficiency: s.proficiency,
      source: "resume",
    }));
    profile.skills = [...nonResumeSkills, ...resumeSkills];

    profile.experience = extracted.experience || [];
    profile.education = extracted.education || [];
    profile.projects = extracted.projects || [];

    await profile.save();
    fs.unlinkSync(req.file.path);

    res.json({ profile });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Resume processing failed", error: err.message });
  }
}

// GET /api/profile
export async function getProfile(req, res) {
  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ profile: profile || null });
}

// PUT /api/profile/target-role  { targetRole: "Backend Developer" }
export async function setTargetRole(req, res) {
  const { targetRole } = req.body;
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { targetRole } },
    { upsert: true, new: true }
  );
  res.json({ profile });
}
