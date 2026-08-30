import apiClient from "../api/client";

export async function getDashboardData() {
  const { data } = await apiClient.get("/dashboard");
  return data;
}
