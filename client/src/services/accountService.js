import apiClient from "../api/client";

export async function getAccountData() {
  const { data } = await apiClient.get("/account");
  return data;
}

export async function updateProfile(updates) {
  const { data } = await apiClient.patch("/account/profile", updates);
  return data;
}

export async function uploadAvatar(file) {
  // TODO (backend): multipart POST /api/account/avatar once file storage exists.
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 300));
}

export async function switchAccount(accountId) {
  // TODO (backend): POST /api/account/switch once multi-account login exists.
  return new Promise((resolve) => setTimeout(() => resolve({ accountId }), 200));
}