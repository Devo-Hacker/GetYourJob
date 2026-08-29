import apiClient from "../api/client";

export async function registerUser({ displayName, email, password }) {
  const { data } = await apiClient.post("/auth/register", {
    displayName,
    email,
    password,
  });
  return data; // { token, user }
}

export async function loginUser({ email, password }) {
  const { data } = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return data; // { token, user }
}