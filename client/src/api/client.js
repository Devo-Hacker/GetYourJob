import axios from "axios";

// One shared axios instance for the whole app.
// Every service file imports THIS instead of creating its own axios calls.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the auth token automatically once you build login.
// Does nothing right now since no token exists yet - safe to leave in.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
