import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockSkillGap = {
  targetRole: "Full-Stack Developer",
  overallMatch: 74,
  skillsMatched: 28,
  totalSkills: 38,
  skillsToImprove: 10,
  priority: "High",

  skillOverview: {
    strong: ["React", "JavaScript", "Git", "HTML/CSS", "MongoDB", "REST API", "GitHub", "Node.js"],
    developing: ["Express.js", "SQL", "Testing", "CI/CD"],
    needsImprovement: ["Docker", "AWS", "TypeScript", "System Design", "Kubernetes", "Redis"],
  },

  topSkillsToImprove: [
    { label: "Docker", priority: "High Priority", resources: 12, value: 20 },
    { label: "AWS", priority: "High Priority", resources: 18, value: 15 },
    { label: "System Design", priority: "High Priority", resources: 24, value: 10 },
    { label: "Kubernetes", priority: "Medium Priority", resources: 14, value: 25 },
    { label: "CI/CD", priority: "Medium Priority", resources: 10, value: 30 },
  ],

  profileStrength: 82,

  recommendedNextSteps: [
    { icon: "docker", title: "Complete Docker fundamentals", time: null },
    { icon: "aws", title: "Build and deploy a project on AWS", time: "Estimated time: 10 hours" },
    { icon: "system-design", title: "Learn System Design basics", time: "Estimated time: 8 hours" },
  ],
};
/* --------------------------------------------------------- */

export async function getSkillGapData() {
  // TODO (backend): once /api/skill-gap exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/skill-gap");
  //   return data;
  //
  // Every component calling getSkillGapData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockSkillGap), 250));
}
