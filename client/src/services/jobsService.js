import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoints below are live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockStats = { savedJobs: 18, appliedJobs: 27 };

const mockJobs = [
  {
    id: "job-1",
    logo: "ABC",
    logoBg: "bg-violet-600",
    title: "Frontend Developer",
    company: "ABC Technologies",
    verified: true,
    activelyHiring: false,
    location: "Bangalore",
    type: "Full-time",
    tags: [
      { label: "React", matched: true },
      { label: "JavaScript", matched: true },
      { label: "Git", matched: true },
      { label: "TypeScript", matched: false },
    ],
    salary: "₹6 – 9 LPA",
    posted: "2 days ago",
    match: 92,
  },
  {
    id: "job-2",
    logo: "FINS",
    logoBg: "bg-slate-700",
    title: "Business Development Associate",
    company: "FINS TECHNOLOGIES",
    verified: true,
    activelyHiring: true,
    location: "Hyderabad",
    type: "Full-time",
    tags: [
      { label: "PowerPoint", matched: true },
      { label: "Excel", matched: true },
      { label: "Communication", matched: true },
      { label: "Marketing", matched: false },
    ],
    salary: "₹2 – 2.5 LPA",
    posted: "2 days ago",
    match: 78,
  },
  {
    id: "job-3",
    logo: "KL",
    logoBg: "bg-slate-900",
    title: "UI/UX Designer",
    company: "Konstruct & Live Technologies Pvt. Ltd.",
    verified: true,
    activelyHiring: false,
    location: "Noida",
    type: "Full-time",
    tags: [
      { label: "Figma", matched: true },
      { label: "UI Design", matched: true },
      { label: "Adobe XD", matched: true },
      { label: "User Research", matched: false },
    ],
    salary: "₹3 – 4.5 LPA",
    posted: "3 days ago",
    match: 65,
  },
  {
    id: "job-4",
    logo: "DC",
    logoBg: "bg-orange-500",
    title: "Backend Developer",
    company: "DataCore Systems",
    verified: true,
    activelyHiring: false,
    location: "Pune",
    type: "Full-time",
    tags: [
      { label: "Node.js", matched: true },
      { label: "Express.js", matched: true },
      { label: "MongoDB", matched: true },
      { label: "REST API", matched: true },
    ],
    salary: "₹5 – 8 LPA",
    posted: "1 day ago",
    match: 84,
  },
];
/* --------------------------------------------------------- */

export async function getJobs() {
  // TODO (backend): once /api/jobs exists, replace with:
  //   const { data } = await apiClient.get("/jobs");
  //   return data;
  return new Promise((resolve) => setTimeout(() => resolve(mockJobs), 250));
}

export async function getJobStats() {
  // TODO (backend): once /api/jobs/stats exists, replace with:
  //   const { data } = await apiClient.get("/jobs/stats");
  //   return data;
  return new Promise((resolve) => setTimeout(() => resolve(mockStats), 250));
}

export async function saveJob(jobId) {
  // TODO (backend): once /api/jobs/:id/save exists, replace with:
  //   await apiClient.post(`/jobs/${jobId}/save`);
  console.log("saveJob called (not yet wired to backend):", jobId);
}
