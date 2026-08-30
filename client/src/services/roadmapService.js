import apiClient from "../api/client";

export async function getRoadmapData() {
  const { data } = await apiClient.get("/roadmap");
  return data;
}

export async function createPlaylistItem(name, type, parentId = null, url = "") {
  const { data } = await apiClient.post("/roadmap/playlist/item", {
    name,
    type,
    parentId,
    url,
  });
  return data;
}

export async function updatePlaylistItem(id, updates) {
  const { data } = await apiClient.put("/roadmap/playlist/item", {
    id,
    ...updates,
  });
  return data;
}

export async function deletePlaylistItem(id) {
  const { data } = await apiClient.delete(`/roadmap/playlist/item/${id}`);
  return data;
}

export async function updateTaskProgress(taskId, completed) {
  const { data } = await apiClient.put("/roadmap/task", { taskId, completed });
  return data;
}