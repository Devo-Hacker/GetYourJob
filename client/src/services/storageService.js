import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoint below is live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const TOTAL_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

const mockStorage = {
  usage: {
    usedBytes: 0,
    totalBytes: TOTAL_BYTES,
  },
  files: [
    // Shape each item will have once uploads exist:
    // { id, name, type: "document" | "image" | "video" | "code" | "other",
    //   sizeBytes, updatedAt }
  ],
};
/* --------------------------------------------------------- */

export async function getStorageData() {
  // TODO (backend): once /api/storage exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/storage");
  //   return data;
  //
  // Every component calling getStorageData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockStorage), 250));
}

export async function uploadFiles(fileList) {
  // TODO (backend): once /api/storage/upload exists, replace this with
  // a multipart/form-data POST via apiClient, e.g.:
  //
  //   const form = new FormData();
  //   Array.from(fileList).forEach((f) => form.append("files", f));
  //   const { data } = await apiClient.post("/storage/upload", form, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ uploaded: fileList.length }), 400)
  );
}

export async function createFolder(name) {
  // TODO (backend): POST /api/storage/folders once it exists.
  return new Promise((resolve) => setTimeout(() => resolve({ name }), 200));
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}