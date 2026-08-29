import apiClient from "../api/client";

export async function getSkillGapData(role) {
  const { data } = await apiClient.get("/skill-gap", { params: role ? { role } : {} });
  return data;
}

export async function getAvailableRoles() {
  const { data } = await apiClient.get("/skill-gap/roles");
  return data.roles;
}
