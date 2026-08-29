import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockConnections = {
  stats: {
    dayStreak: 12,
    activeThisMonth: 68,
    activeChange: 12,
    achievements: 42,
    totalCodingHours: 86,
    totalContributions: 1248,
  },

  connectedPlatforms: [
    {
      id: "github",
      name: "GitHub",
      status: "Connected",
      tagline: "Code. Commit. Contribute.",
      stats: [
        { label: "Repositories", value: 24 },
        { label: "Commits (This month)", value: 18 },
        { label: "Pull Requests (This month)", value: 7 },
      ],
    },
    {
      id: "leetcode",
      name: "LeetCode",
      status: "Connected",
      tagline: "Sharpen your problem solving.",
      stats: [
        { label: "Problems Solved", value: 186 },
        { label: "Medium", value: 154 },
        { label: "Hard", value: 32 },
      ],
    },
    {
      id: "gfg",
      name: "GeeksforGeeks",
      status: "Connected",
      tagline: "Practice. Learn. Grow.",
      stats: [
        { label: "Problems Solved", value: 94 },
        { label: "Medium", value: 62 },
        { label: "Hard", value: 12 },
      ],
    },
    {
      id: "codechef",
      name: "CodeChef",
      status: "Connected",
      tagline: "Compete. Improve. Win.",
      stats: [
        { label: "Contests", value: 3 },
        { label: "Rating", value: 1480 },
        { label: "Global Rank", value: "#23,456" },
      ],
    },
    {
      id: "hackerrank",
      name: "HackerRank",
      status: "Connected",
      tagline: "Solve challenges. Get certified.",
      stats: [
        { label: "Badges", value: 5 },
        { label: "Problems Solved", value: 312 },
        { label: "Certifications", value: 2 },
      ],
    },
    {
      id: "codeforces",
      name: "Codeforces",
      status: "Connected",
      tagline: "Compete and improve.",
      stats: [
        { label: "Rating", value: 1425 },
        { label: "Global Rank", value: "#18,743" },
        { label: "Problems Solved", value: 21 },
      ],
    },
  ],

  availablePlatforms: [
    { id: "kaggle", name: "Kaggle", tagline: "Explore data. Build models." },
    { id: "gitlab", name: "GitLab", tagline: "Manage code. Collaborate." },
    { id: "hackerearth", name: "HackerEarth", tagline: "Solve problems. Get noticed." },
  ],

  activityOverview: {
    range: "Last 6 Months",
    labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    series: [
      { id: "github", name: "GitHub", color: "#1e293b", data: [78, 88, 90, 82, 91, 92] },
      { id: "leetcode", name: "LeetCode", color: "#f59e0b", data: [50, 68, 62, 66, 70, 68] },
      { id: "gfg", name: "GeeksforGeeks", color: "#22c55e", data: [28, 45, 48, 45, 52, 50] },
      { id: "codechef", name: "CodeChef", color: "#7c3aed", data: [15, 26, 30, 28, 33, 32] },
      { id: "hackerrank", name: "HackerRank", color: "#38bdf8", data: [8, 20, 18, 22, 20, 20] },
    ],
  },

  recentActivity: [
    { platform: "github", title: "Pushed 4 commits to DevSphere/frontend", time: "2 hours ago" },
    { platform: "leetcode", title: 'Solved "Longest Substring Without Repeating Characters"', time: "4 hours ago" },
    { platform: "gfg", title: "Completed Dynamic Programming - Basic Set", time: "1 day ago" },
    { platform: "codechef", title: "Participated in Starters 115 Division 3", time: "2 days ago" },
    { platform: "github", title: "Created new repository DevSphere-Backend", time: "3 days ago" },
  ],

  profileImpact: [
    {
      tone: "emerald",
      title: "Your GitHub activity increased your Full-Stack Developer evidence score",
      delta: "+4%",
      note: "More commits = stronger proof of consistency",
    },
    {
      tone: "sky",
      title: "You solved 12 DSA problems this week. Your problem-solving evidence is improving!",
      note: "Keep solving to boost your match score",
    },
    {
      tone: "indigo",
      title: "Your recent Docker project strengthens one of your identified skill gaps",
      note: "Great job closing the gap!",
    },
  ],
};
/* --------------------------------------------------------- */

export async function getConnectionsData() {
  // TODO (backend): once /api/connections exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/connections");
  //   return data;
  //
  // Every component calling getConnectionsData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockConnections), 250));
}
