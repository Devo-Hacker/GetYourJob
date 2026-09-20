import apiClient from "../api/client";

export async function getRoadmapData() {
  const { data } = await apiClient.get("/roadmap");
  return data;
}

/* Playlists */
export async function createPlaylistItem(name, type, parentId = null, url = "") {
  const { data } = await apiClient.post("/roadmap/playlist/item", { name, type, parentId, url });
  return data;
}

export async function updatePlaylistItem(id, updates) {
  const { data } = await apiClient.put("/roadmap/playlist/item", { id, ...updates });
  return data;
}

export async function deletePlaylistItem(id) {
  const { data } = await apiClient.delete(`/roadmap/playlist/item/${id}`);
  return data;
}

/* Daily Goals */
export async function addDailyTask(label, total) {
  const { data } = await apiClient.post("/roadmap/daily-task", { label, total });
  return data;
}

export async function updateDailyTask(taskId, updates) {
  const { data } = await apiClient.put("/roadmap/daily-task", { taskId, ...updates });
  return data;
}

export async function deleteDailyTask(taskId) {
  const { data } = await apiClient.delete(`/roadmap/daily-task/${taskId}`);
  return data;
}

export async function updateStreak(streak) {
  const { data } = await apiClient.put("/roadmap/streak", { streak });
  return data;
}

/* Weekly Goals */
export async function toggleWeeklyDay(dayIndex) {
  const { data } = await apiClient.put("/roadmap/weekly-day", { dayIndex });
  return data;
}

export async function addWeeklyTask(label, total, unit) {
  const { data } = await apiClient.post("/roadmap/weekly-task", { label, total, unit });
  return data;
}

export async function updateWeeklyTask(taskId, updates) {
  const { data } = await apiClient.put("/roadmap/weekly-task", { taskId, ...updates });
  return data;
}

export async function deleteWeeklyTask(taskId) {
  const { data } = await apiClient.delete(`/roadmap/weekly-task/${taskId}`);
  return data;
}

/* Milestones */
export async function addMilestone(label, progress) {
  const { data } = await apiClient.post("/roadmap/milestone", { label, progress });
  return data;
}

export async function updateMilestone(milestoneId, updates) {
  const { data } = await apiClient.put("/roadmap/milestone", { milestoneId, ...updates });
  return data;
}

export async function deleteMilestone(milestoneId) {
  const { data } = await apiClient.delete(`/roadmap/milestone/${milestoneId}`);
  return data;
}

/* Header & Stats */
export async function updateRoadmapStats(updates) {
  const { data } = await apiClient.put("/roadmap/stats", updates);
  return data;
}