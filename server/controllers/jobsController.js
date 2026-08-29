import Profile from "../models/Profile.js";
import SavedJob from "../models/SavedJob.js";
import { searchJobs } from "../services/adzunaService.js";
import { extractJobSkills, scoreJobMatch } from "../services/jobMatcher.js";

const LOGO_PALETTE = [
  "bg-violet-600",
  "bg-slate-700",
  "bg-slate-900",
  "bg-orange-500",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-rose-500",
];

function initials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Deterministic, not random - the same company always gets the same
// color across requests/renders instead of flickering on refresh.
function logoColorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return LOGO_PALETTE[hash % LOGO_PALETTE.length];
}

function formatSalary(job, country) {
  if (!job.salary_min && !job.salary_max) return "Not disclosed";

  if (country === "in") {
    const toLakh = (n) => Math.round(n / 100000);
    if (job.salary_min && job.salary_max) {
      return `₹${toLakh(job.salary_min)} – ${toLakh(job.salary_max)} LPA`;
    }
    return `₹${toLakh(job.salary_min || job.salary_max)} LPA`;
  }

  const fmt = (n) => `${Math.round(n).toLocaleString()}`;
  if (job.salary_min && job.salary_max) {
    return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`;
  }
  return fmt(job.salary_min || job.salary_max);
}

function formatPosted(createdIso) {
  if (!createdIso) return "recently";
  const days = Math.floor((Date.now() - new Date(createdIso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// GET /api/jobs?role=&location=&page=
export async function getJobs(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const targetRole = req.query.role || profile?.targetRole || "Full-Stack Developer";
    const country = process.env.ADZUNA_COUNTRY || "in";

    const { results } = await searchJobs({
      what: targetRole,
      where: req.query.location,
      page: req.query.page || 1,
      country,
    });

    const savedRecords = await SavedJob.find({ user: req.user._id });
    const savedMap = new Map(savedRecords.map((r) => [r.externalId, r.status]));

    const jobs = await Promise.all(
      results.map(async (job) => {
        const jobSkills = await extractJobSkills({
          title: job.title,
          description: job.description,
        });
        const { match, tags } = scoreJobMatch(profile?.skills || [], jobSkills);

        return {
          id: job.id,
          logo: initials(job.company?.display_name),
          logoBg: logoColorFor(job.company?.display_name),
          title: job.title,
          company: job.company?.display_name || "Unknown company",
          verified: false, // Adzuna doesn't provide a verification signal - never fabricate one
          activelyHiring: formatPosted(job.created) === "today" || formatPosted(job.created) === "1 day ago",
          location: job.location?.display_name || "Location not specified",
          type: job.contract_time === "part_time" ? "Part-time" : "Full-time",
          tags,
          salary: formatSalary(job, country),
          posted: formatPosted(job.created),
          match,
          redirectUrl: job.redirect_url,
          savedStatus: savedMap.get(String(job.id)) || null,
        };
      })
    );

    jobs.sort((a, b) => b.match - a.match);

    res.json({ targetRole, jobs });
  } catch (err) {
    if (err.message?.includes("ADZUNA_APP_ID")) {
      return res.status(503).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to load jobs", error: err.message });
  }
}

// GET /api/jobs/stats
export async function getJobStats(req, res) {
  try {
    const [savedJobs, appliedJobs] = await Promise.all([
      SavedJob.countDocuments({ user: req.user._id, status: "saved" }),
      SavedJob.countDocuments({ user: req.user._id, status: "applied" }),
    ]);
    res.json({ savedJobs, appliedJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to load job stats", error: err.message });
  }
}

// POST /api/jobs/:externalId/save  { snapshot: {...} }
export async function saveJob(req, res) {
  try {
    const { externalId } = req.params;
    const { snapshot } = req.body;

    const record = await SavedJob.findOneAndUpdate(
      { user: req.user._id, externalId },
      { $set: { status: "saved", snapshot } },
      { upsert: true, new: true }
    );

    res.json({ status: record.status });
  } catch (err) {
    res.status(500).json({ message: "Failed to save job", error: err.message });
  }
}

// POST /api/jobs/:externalId/apply  { snapshot: {...} }
// Fired when the user clicks "View Job" - marks it applied so the
// Applied Jobs stat reflects real intent, since Adzuna listings always
// redirect out to the original posting (there's no in-app apply flow).
export async function applyJob(req, res) {
  try {
    const { externalId } = req.params;
    const { snapshot } = req.body;

    const record = await SavedJob.findOneAndUpdate(
      { user: req.user._id, externalId },
      { $set: { status: "applied", snapshot } },
      { upsert: true, new: true }
    );

    res.json({ status: record.status });
  } catch (err) {
    res.status(500).json({ message: "Failed to record application", error: err.message });
  }
}
