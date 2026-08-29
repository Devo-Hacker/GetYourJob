// import apiClient from "../api/client";
// import { getProjectsData, createProject, updateProject, deleteProject } from "../services/projectsService";
// function toCardShape(p) {
//   return {
//     id: p._id,
//     name: p.name,
//     description: p.description,
//     techStack: p.techStack || [],
//     status: p.status,
//     githubUrl: p.githubUrl,
//     liveUrl: p.liveUrl,
//     progress: p.progress ?? null,
//     dateLabel: new Date(p.createdAt).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     }),
//     fileName: p.fileName,
//   };
// }

// export async function getProjectsData() {
//   const { data } = await apiClient.get("/projects");
//   const projects = data.projects.map(toCardShape);

//   const stats = {
//     total: projects.length,
//     completed: projects.filter((p) => p.status === "Completed").length,
//     inProgress: projects.filter((p) => p.status === "In Progress").length,
//     planned: projects.filter((p) => p.status === "Planned").length,
//   };

//   return { projects, stats };
// }

// // formValues: { name, description, techStack (comma string), status, githubUrl, liveUrl, file }
// export async function createProject(formValues) {
//   const formData = new FormData();
//   Object.entries(formValues).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") {
//       formData.append(key, value);
//     }
//   });

//   const { data } = await apiClient.post("/projects", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return toCardShape(data.project);
// }

// export async function deleteProject(id) {
//   await apiClient.delete(`/projects/${id}`);
// }

import apiClient from "../api/client";

function toCardShape(p) {
  return {
    id: p._id,
    name: p.name,
    description: p.description,
    techStack: p.techStack || [],
    status: p.status,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    progress: p.progress ?? null,
    dateLabel: new Date(p.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    fileName: p.fileName,
  };
}

export async function getProjectsData() {
  const { data } = await apiClient.get("/projects");
  const projects = data.projects.map(toCardShape);

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    planned: projects.filter((p) => p.status === "Planned").length,
  };

  return { projects, stats };
}

// formValues: { name, description, techStack (comma string), status, githubUrl, liveUrl, file }
export async function createProject(formValues) {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const { data } = await apiClient.post("/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return toCardShape(data.project);
}

// formValues: same shape as createProject. Only non-empty fields are sent,
// so leaving a field untouched in the edit form won't wipe it out.
export async function updateProject(id, formValues) {
  const formData = new FormData();
  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const { data } = await apiClient.put(`/projects/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return toCardShape(data.project);
}

export async function deleteProject(id) {
  await apiClient.delete(`/projects/${id}`);
}