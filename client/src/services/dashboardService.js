import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockDashboard = {
  user: {
    name: "Sanjay",
    role: "Aspiring Full-Stack Developer",
    location: "Bangalore, India",
    status: "Fresher",
  },
  roleReadiness: { role: "Full-Stack Developer", percentage: 76 },
  bestMatchJobs: 12,
  skillsAnalysed: 24,
  profileStrength: 82,
  skillOverview: {
    strong: ["React", "JavaScript", "Git", "HTML/CSS"],
    developing: ["Node.js", "SQL", "Express"],
    needsImprovement: ["Docker", "AWS", "Testing", "TypeScript"],
  },
  topJobs: [
    { title: "Frontend Developer", company: "ABC Technologies", location: "Bangalore", match: 91 },
    { title: "React Developer", company: "XYZ Solutions", location: "Bangalore", match: 87 },
    { title: "Full Stack Developer", company: "InnovateX", location: "Bangalore", match: 79 },
  ],
  skillGaps: [
    { label: "Docker", value: 30, priority: "High Priority" },
    { label: "AWS", value: 22, priority: "High Priority" },
    { label: "TypeScript", value: 55, priority: "Medium Priority" },
    { label: "Testing", value: 45, priority: "Medium Priority" },
    { label: "System Design", value: 68, priority: "Low Priority" },
  ],
  aiRecommendations: [
    "Learn Docker – High demand in 34% of Full-Stack Developer jobs.",
    "Build a deployment project – Add DevOps & cloud experience.",
    "Solve 10 more DSA problems – Strengthen your problem solving.",
  ],
  recentProjects: [
    { name: "E-Commerce Web App", stack: "MERN Stack · Docker · CI/CD", updated: "Updated 2 days ago" },
    { name: "Task Management System", stack: "MERN Stack · JWT · MongoDB", updated: "Updated 1 week ago" },
  ],
  connectedProfiles: ["GitHub", "LeetCode", "GeeksforGeeks", "LinkedIn"],
};
/* --------------------------------------------------------- */

export async function getDashboardData() {
  // TODO (backend): once /api/dashboard exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/dashboard");
  //   return data;
  //
  // Every component calling getDashboardData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockDashboard), 250));
}
