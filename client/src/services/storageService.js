import apiClient from "../api/client";

export async function getStorageData(folderId) {
  const { data } = await apiClient.get("/storage", {
    params: folderId ? { folderId } : {},
  });
  return data;
}

export async function uploadFiles(fileList, folderId) {
  const form = new FormData();
  Array.from(fileList).forEach((file) => form.append("files", file));
  if (folderId) form.append("folderId", folderId);

  const { data } = await apiClient.post("/storage/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteFile(id) {
  const { data } = await apiClient.delete(`/storage/${id}`);
  return data;
}

export async function createFolder(name, parentId) {
  const { data } = await apiClient.post("/storage/folders", { name, parentId });
  return data;
}

export async function deleteFolder(id) {
  const { data } = await apiClient.delete(`/storage/folders/${id}`);
  return data;
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
