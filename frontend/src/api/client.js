import axios from "axios";

// Backend base URL — Spring Boot service
const BASE_URL = "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach JWT to every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("coldchain_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handling — bounce unauthenticated users to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("coldchain_token");
      localStorage.removeItem("coldchain_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
