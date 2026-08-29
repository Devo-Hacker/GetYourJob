import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.

   IMPORTANT (future direction, see note at bottom of file):
   this shape is intentionally identical to what a real
   "generate roadmap from skill gap" endpoint should return,
   so swapping mock -> real is a drop-in replacement, not a
   redesign.
--------------------------------------------------------- */
const mockRoadmap = {
  targetRole: "Full-Stack Developer",
  overallProgress: 28,
  skillsToImprove: 10,
  estimatedHours: 120,
  difficulty: "Moderate", // "Easy" | "Moderate" | "Hard"

  phases: [
    {
      id: 1,
      title: "Foundation Building",
      status: "In Progress",
      tone: "indigo",
      description: "Strengthen core concepts and fundamental skills.",
      skillsCount: 6,
      hours: 35,
      skills: ["JavaScript", "TypeScript", "HTML/CSS", "Git", "Docker", "AWS Basics"],
      progress: 45,
    },
    {
      id: 2,
      title: "Backend Development",
      status: "Upcoming",
      tone: "sky",
      description: "Build strong backend development and database expertise.",
      skillsCount: 4,
      hours: 30,
      skills: ["Node.js", "Express.js", "MongoDB", "REST API"],
      progress: 0,
    },
    {
      id: 3,
      title: "DevOps & Deployment",
      status: "Upcoming",
      tone: "amber",
      description: "Learn deployment, CI/CD and cloud services.",
      skillsCount: 4,
      hours: 25,
      skills: ["Docker", "AWS", "CI/CD", "Kubernetes"],
      progress: 0,
    },
    {
      id: 4,
      title: "Advanced & Scaling",
      status: "Upcoming",
      tone: "emerald",
      description: "Advance your skills and work on real-world projects.",
      skillsCount: 5,
      hours: 30,
      skills: ["System Design", "Microservices", "Security", "Testing", "Performance"],
      progress: 0,
    },
  ],

  dailyGoal: {
    completed: 0,
    total: 3,
    streak: 0,
    tasks: [
      { label: "Watch a video or read a tutorial", done: 0, total: 1 },
      { label: "Practice coding for 30 minutes", done: 0, total: 1 },
      { label: "Solve 2 coding problems", done: 0, total: 2 },
    ],
  },

  weeklyGoal: {
    completed: 0,
    total: 5,
    days: [
      { label: "M", done: false },
      { label: "T", done: false },
      { label: "W", done: false },
      { label: "T", done: false },
      { label: "F", done: false },
      { label: "S", done: false },
      { label: "S", done: false },
    ],
    tasks: [
      { label: "Learn for 5+ hours", done: 0, total: 5, unit: "hrs" },
      { label: "Solve 15 coding problems", done: 0, total: 15 },
      { label: "Work on a project", done: 0, total: 1 },
    ],
  },

  milestones: [
    { label: "Complete Foundation Building", progress: 0 },
    { label: "Complete Backend Development", progress: 0 },
    { label: "Build 3 Projects", progress: 0 },
  ],
};
/* --------------------------------------------------------- */

export async function getRoadmapData() {
  // TODO (backend): once /api/roadmap exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/roadmap");
  //   return data;
  //
  // Every component calling getRoadmapData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockRoadmap), 250));
}

/* ---------------------------------------------------------
   FUTURE DIRECTION - not implemented yet, kept here as a
   design note for when the backend exists.

   The plan: roadmap phases shouldn't be hand-authored forever.
   Once skillGapService + jobsService are backed by real data,
   an Express route like POST /api/roadmap/generate would:

     1. Pull the user's top N recommended/matched jobs
        (jobsService -> job.requiredSkills + job.matchPercentage).
     2. Union every "missing" skill across those jobs, weighted
        by how many top jobs require it (a skill needed by 4 of
        your top 5 matches ranks above one needed by 1).
     3. Reuse the exact skillOverview.needsImprovement /
        .developing arrays already produced by skillGapService
        for the CURRENT target role, so "Skill Gap" and
        "Roadmap" always agree on what's missing.
     4. Bucket the ranked skill list into phases (foundation ->
        core role skills -> deployment/infra -> advanced), and
        set each phase's `progress` from the user's actual
        completed-skill checkmarks, not a hardcoded number.
     5. Recompute `overallProgress` and `skillsToImprove` as a
        function of live skill-gap %, so finishing a phase here
        visibly moves the needle on the Skill Gap page too.

   None of that changes the shape returned by getRoadmapData()
   above - only what's INSIDE mockRoadmap gets replaced by a
   computed object. That's why the mock already mirrors that
   target shape (phases[].skills coming from skillOverview,
   skillsToImprove matching skillGapService's own count, etc).
--------------------------------------------------------- */
