import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockProjects = {
  stats: {
    total: 6,
    completed: 3,
    inProgress: 2,
    planned: 1,
  },

  projects: [
    {
      id: "devconnect",
      name: "DevConnect",
      status: "Completed",
      description: "A developer networking platform to connect, collaborate and share ideas.",
      techStack: ["Next.js", "MongoDB", "Tailwind CSS", "Socket.io"],
      progress: null,
      dateLabel: "Completed on 12 May 2024",
      githubUrl: "https://github.com/",
      liveUrl: "https://example.com/",
    },
    {
      id: "taskflow",
      name: "TaskFlow",
      status: "In Progress",
      description: "A productivity application to manage tasks, projects and team collaboration.",
      techStack: ["React", "Node.js", "Express", "MongoDB"],
      progress: 65,
      dateLabel: null,
      githubUrl: "https://github.com/",
      liveUrl: "https://example.com/",
    },
    {
      id: "ai-code-helper",
      name: "AI Code Helper",
      status: "Completed",
      description: "AI-powered code assistant that helps developers write better code faster.",
      techStack: ["Python", "FastAPI", "OpenAI API", "Vue.js"],
      progress: null,
      dateLabel: "Completed on 2 Apr 2024",
      githubUrl: "https://github.com/",
      liveUrl: "https://example.com/",
    },
    {
      id: "portfolio-website",
      name: "Portfolio Website",
      status: "In Progress",
      description: "Personal portfolio website to showcase my skills and projects.",
      techStack: ["React", "Tailwind CSS", "Framer Motion"],
      progress: 40,
      dateLabel: null,
      githubUrl: "https://github.com/",
      liveUrl: "https://example.com/",
    },
    {
      id: "weather-dashboard",
      name: "Weather Dashboard",
      status: "Planned",
      description: "A weather dashboard application with real-time updates and forecasts.",
      techStack: ["JavaScript", "API", "Chart.js", "CSS"],
      progress: null,
      dateLabel: "Not started yet",
      githubUrl: null,
      liveUrl: null,
    },
    {
      id: "ecommerce-app",
      name: "E-Commerce App",
      status: "Planned",
      description: "Full-stack e-commerce platform with product listing, cart and payments.",
      techStack: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      progress: null,
      dateLabel: "Not started yet",
      githubUrl: null,
      liveUrl: null,
    },
  ],
};
/* --------------------------------------------------------- */

export async function getProjectsData() {
  // TODO (backend): once /api/projects exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/projects");
  //   return data;
  //
  // Every component calling getProjectsData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockProjects), 250));
}
