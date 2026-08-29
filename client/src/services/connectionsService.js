import apiClient from "../api/client";

export const PLATFORM_CATALOG = [
  { id: "github", name: "GitHub", tagline: "Code. Commit. Contribute." },
  { id: "leetcode", name: "LeetCode", tagline: "Sharpen your problem solving." },
  { id: "geeksforgeeks", name: "GeeksforGeeks", tagline: "Practice. Learn. Grow." },
  { id: "codechef", name: "CodeChef", tagline: "Compete. Improve. Win." },
  { id: "hackerrank", name: "HackerRank", tagline: "Solve challenges. Get certified." },
  { id: "codeforces", name: "Codeforces", tagline: "Compete and improve." },
  { id: "linkedin", name: "LinkedIn", tagline: "Grow your professional network." },
  { id: "gitlab", name: "GitLab", tagline: "Ship and collaborate on code." },
  { id: "kaggle", name: "Kaggle", tagline: "Data science competitions." },
  { id: "hackerearth", name: "HackerEarth", tagline: "Solve, compete, get hired." },
];

export async function getRawConnections() {
  const { data } = await apiClient.get("/connections");
  return data.connections;
}

// platform: catalog id, e.g. "github". usernameOrUrl: plain username or full profile URL.
export async function addConnection({ platform, usernameOrUrl }) {
  const { data } = await apiClient.post("/connections", { platform, usernameOrUrl });
  return data.connection;
}

export async function updateManualStats(platform, stats) {
  const { data } = await apiClient.put(`/connections/${platform}/stats`, { stats });
  return data.connection;
}

export async function removeConnection(platform) {
  await apiClient.delete(`/connections/${platform}`);
}

export async function getConnectionsData() {
  const connections = await getRawConnections();
  const connectedIds = connections.map((c) => c.platform);
  const github = connections.find((c) => c.platform === "github");

  return {
    stats: {
      dayStreak: 0,
      activeThisMonth: 0,
      activeChange: 0,
      achievements: 0,
      totalCodingHours: 0,
      totalContributions: github?.data?.publicRepos ?? 0,
    },
    connectedPlatforms: connections.map((c) => {
      const catalogEntry = PLATFORM_CATALOG.find((p) => p.id === c.platform);
      return {
        id: c.platform,
        name: catalogEntry?.name || c.platform,
        status: "Connected",
        tagline: c.usernameOrUrl,
        stats: Object.entries(c.data || {})
          .filter(([, v]) => typeof v === "number" || typeof v === "string")
          .slice(0, 3)
          .map(([label, value]) => ({ label, value })),
      };
    }),
    availablePlatforms: PLATFORM_CATALOG.filter((p) => !connectedIds.includes(p.id)),
    activityOverview: { range: "Last 6 Months", series: [], labels: [] },
    recentActivity: [],
    profileImpact: [],
  };
}
