import apiClient from "../api/client";

/* ---------------------------------------------------------
   MOCK DATA - delete this whole block once the backend
   endpoints below are live. Nothing outside this file needs
   to change when you do.
--------------------------------------------------------- */
const mockAccountData = {
  profile: {
    displayName: "Sanjay",
    role: "Aspiring Full-Stack Developer",
    email: "test@test.com",
    emailVerified: true,
  },
  accounts: [
    {
      id: "acc-1",
      name: "Sanjay",
      email: "test@test.com",
      active: true,
    },
  ],
};
/* --------------------------------------------------------- */

export async function getAccountData() {
  // TODO (backend): once /api/account exists, replace the two lines
  // below this comment with:
  //
  //   const { data } = await apiClient.get("/account");
  //   return data;
  //
  // Every component calling getAccountData() keeps working unchanged.
  return new Promise((resolve) => setTimeout(() => resolve(mockAccountData), 200));
}

export async function updateProfile(updates) {
  // TODO (backend): PATCH /api/account/profile once it exists, e.g.:
  //
  //   const { data } = await apiClient.patch("/account/profile", updates);
  //   return data;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ...mockAccountData.profile, ...updates }), 300)
  );
}

export async function uploadAvatar(file) {
  // TODO (backend): multipart POST /api/account/avatar once it exists.
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 300));
}

export async function switchAccount(accountId) {
  // TODO (backend): POST /api/account/switch once multi-account exists.
  return new Promise((resolve) => setTimeout(() => resolve({ accountId }), 200));
}

export async function logout() {
  // TODO (backend): POST /api/auth/logout, then clear the token and
  // redirect to /login, e.g.:
  //
  //   await apiClient.post("/auth/logout");
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  return new Promise((resolve) => setTimeout(resolve, 200));
}