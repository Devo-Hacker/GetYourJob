import apiClient from "../api/client";

export async function getProfile() {
  const { data } = await apiClient.get("/profile");
  return data.profile;
}

export async function setTargetRole(targetRole) {
  const { data } = await apiClient.put("/profile/target-role", { targetRole });
  return data.profile;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await apiClient.post("/profile/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.profile;
}
