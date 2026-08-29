import apiClient from "../api/client";

export async function getSkillBoard() {
  const { data } = await apiClient.get("/skills/board");
  return data;
}

export async function updateDesiredSkills(skills) {
  const { data } = await apiClient.put("/skills/desired", { skills });
  return data.desiredSkills;
}
