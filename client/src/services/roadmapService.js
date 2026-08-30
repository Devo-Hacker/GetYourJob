import apiClient from "../api/client";

export async function getRoadmapData() {
  const { data } = await apiClient.get("/roadmap");
  return data;
}

export async function createPlaylistFolder(name, progress) {
  const { data } = await apiClient.post("/roadmap/playlist", { name, progress });
  return data;
}

export async function addVideoToPlaylist(folderId, title, url) {
  const { data } = await apiClient.post("/roadmap/playlist/video", { folderId, title, url });
  return data;
}

export async function updateFolderProgress(folderId, progress) {
  const { data } = await apiClient.put("/roadmap/playlist/progress", { folderId, progress });
  return data;
}

export async function updateTaskProgress(taskId, completed) {
  const { data } = await apiClient.put("/roadmap/task", { taskId, completed });
  return data;
}