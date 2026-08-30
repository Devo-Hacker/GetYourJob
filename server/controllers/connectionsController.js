import PlatformProfile from "../models/PlatformProfile.js";
import { fetchGithubStats } from "../services/githubService.js";
import { computeActivityStats, logSync } from "../services/activityStats.js";

// POST /api/connections  { platform, usernameOrUrl }
// Adds or re-syncs a platform. GitHub is fetched live via its public API.
// Every other platform (LeetCode, HackerRank, GFG, LinkedIn...) is stored
// as-is - we deliberately don't scrape those, since their Terms of Service
// prohibit it. Their stats come in through updateManualStats() instead,
// via a small "Update stats" form on the Connections page.
export async function saveConnection(req, res) {
  try {
    const { platform, usernameOrUrl } = req.body;

    if (!platform || !usernameOrUrl) {
      return res.status(400).json({ message: "platform and usernameOrUrl are required" });
    }

    let data = {};

    if (platform === "github") {
      try {
        data = await fetchGithubStats(usernameOrUrl);
      } catch (err) {
        return res.status(400).json({ message: "Could not find that GitHub username" });
      }
    }

    const connection = await PlatformProfile.findOneAndUpdate(
      { user: req.user._id, platform },
      { usernameOrUrl, data, lastSynced: new Date() },
      { upsert: true, new: true }
    );

    await logSync(req.user._id, platform, "connect");

    res.json({ connection });
  } catch (err) {
    res.status(500).json({ message: "Failed to save connection", error: err.message });
  }
}

// PUT /api/connections/:platform/stats  { stats: { ... } }
// For platforms without a public API - user pastes their own numbers in.
export async function updateManualStats(req, res) {
  try {
    const { platform } = req.params;
    const { stats } = req.body;

    const connection = await PlatformProfile.findOneAndUpdate(
      { user: req.user._id, platform },
      { $set: { data: stats }, lastSynced: new Date() },
      { upsert: true, new: true }
    );

    await logSync(req.user._id, platform, "stats_update");

    res.json({ connection });
  } catch (err) {
    res.status(500).json({ message: "Failed to update stats", error: err.message });
  }
}

// GET /api/connections
export async function getConnections(req, res) {
  const connections = await PlatformProfile.find({ user: req.user._id });
  const activity = await computeActivityStats(req.user._id, connections.length);
  res.json({ connections, activity });
}

// DELETE /api/connections/:platform
export async function deleteConnection(req, res) {
  await PlatformProfile.deleteOne({ user: req.user._id, platform: req.params.platform });
  res.json({ message: "Disconnected" });
}
