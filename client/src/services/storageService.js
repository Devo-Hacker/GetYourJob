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

export async function renameFile(id, name) {
  const { data } = await apiClient.patch(`/storage/${id}`, { name });
  return data;
}

// destinationFolderId: a folder id, or null to move to the storage root
export async function moveFile(id, destinationFolderId) {
  const { data } = await apiClient.patch(`/storage/${id}`, { folderId: destinationFolderId });
  return data;
}

export async function createFolder(name, parentId) {
  const { data } = await apiClient.post("/storage/folders", { name, parentId });
  return data;
}

export async function renameFolder(id, name) {
  const { data } = await apiClient.patch(`/storage/folders/${id}`, { name });
  return data;
}

export async function moveFolder(id, destinationParentId) {
  const { data } = await apiClient.patch(`/storage/folders/${id}`, { parentId: destinationParentId });
  return data;
}

export async function deleteFolder(id) {
  const { data } = await apiClient.delete(`/storage/folders/${id}`);
  return data;
}

// Flat list of every folder the user owns - used to build the "Move
// to..." destination picker.
export async function getFolderTree() {
  const { data } = await apiClient.get("/storage/folders/tree");
  return data.folders;
}

export async function searchStorage(query) {
  const { data } = await apiClient.get("/storage/search", { params: { q: query } });
  return data; // { folders, files }
}

// Builds a direct link to view/download a file. Opens in a plain browser
// tab (no custom headers), so the auth token rides along as a query
// param instead of the usual Authorization header - the server's
// protect middleware accepts either.
export function getFileViewUrl(fileId, { download = false } = {}) {
  const base = (apiClient.defaults.baseURL || "").replace(/\/$/, "");
  const token = localStorage.getItem("token") || "";
  const params = new URLSearchParams({ token });
  if (download) params.set("download", "1");
  return `${base}/storage/${fileId}/view?${params.toString()}`;
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}