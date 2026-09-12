import apiClient from "./client";

// NOTE: aligned to the actual Spring Boot backend contract (see backend/src
// controllers). A couple of endpoints from the original spec don't exist on
// this backend (no GET /auth/me, environment history lives at
// /shipments/{id}/environment not /environment-history) — the frontend below
// matches what the backend actually exposes rather than inventing routes.

// ---------- Auth ----------
export const authApi = {
  register: (payload) => apiClient.post("/auth/register", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
};

// ---------- Shipments ----------
export const shipmentsApi = {
  list: () => apiClient.get("/shipments"),
  create: (payload) => apiClient.post("/shipments", payload),
  getById: (id) => apiClient.get(`/shipments/${id}`),
  update: (id, payload) => apiClient.put(`/shipments/${id}`, payload),
  updateStatus: (id, status) =>
    apiClient.patch(`/shipments/${id}/status`, null, { params: { status } }),
  remove: (id) => apiClient.delete(`/shipments/${id}`),
  postEnvironment: (id, payload) => apiClient.post(`/shipments/${id}/environment`, payload),
  getEnvironmentHistory: (id) => apiClient.get(`/shipments/${id}/environment`),
  getRisk: (id) => apiClient.get(`/shipments/${id}/risk`),
  getRecommendations: (id) => apiClient.get(`/shipments/${id}/recommendations`),
};

// ---------- Facilities ----------
export const facilitiesApi = {
  list: () => apiClient.get("/facilities"),
  create: (payload) => apiClient.post("/facilities", payload),
  getById: (id) => apiClient.get(`/facilities/${id}`),
  update: (id, payload) => apiClient.put(`/facilities/${id}`, payload),
  remove: (id) => apiClient.delete(`/facilities/${id}`),
};

// ---------- Dashboard ----------
export const dashboardApi = {
  summary: () => apiClient.get("/dashboard/summary"),
};
