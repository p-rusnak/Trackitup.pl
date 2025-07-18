import axios from "axios";
import Config from "../config";

const client = axios.default.create({
  baseURL: Config.apiDefaultURL,
  timeout: Config.apiTimeout,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.hash.includes("/login")) {
        window.location.hash = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export class ApiClient {
  login = (params) => client.post("auth/login", params);
  register = (params) => client.post("auth/register", params);

  getScores = (mode, userId) =>
    client.get(`scores/${mode}`, { params: userId ? { userId } : {} });
  postScores = (mode, data) => client.post(`scores/${mode}`, data);
  getLatestScores = (limit) =>
    client.get("scores/latest", { params: { limit } });
  getLatestPlayers = (limit) =>
    client.get("scores/latestPlayers", { params: { limit } });
  getAllScores = (page, limit, filters = {}, sortBy) =>
    client.get("scores/all", { params: { page, limit, sortBy, ...filters } });

  getScoreHistory = (mode, songId, diff, userId) =>
    client.get(`scores/history/${mode}/${songId}/${diff}`, {
      params: userId ? { userId } : {},
    });

  getBestScore = (mode, songId, diff) =>
    client.get(`scores/best/${mode}/${songId}/${diff}`);

  deleteScore = (id) => client.delete(`scores/${id}`);

  getGoals = (mode, userId) =>
    client.get(`goals/${mode}`, { params: userId ? { userId } : {} });
  postGoal = (mode, data) => client.post(`goals/${mode}`, data);

  getUsers = () => client.get("users");
  getUser = (id) => client.get(`users/${id}`);
  updateUser = (id, data) => client.patch(`users/${id}`, data);
  getLeaderboard = () => client.get("leaderboard");
  reportMissing = (data) => client.post("missings", data);

  getRating = (songId, diff) => client.get(`ratings/${songId}/${diff}`);
  postRating = (data) => client.post("ratings", data);

  getCurrentSession = () => client.get("sessions/current");
  endSession = () => client.post("sessions/end");
  cancelSession = () => client.post("sessions/cancel");
  listSessions = (userId) =>
    client.get("sessions", { params: userId ? { userId } : {} });
  getOngoingSessions = (limit) =>
    client.get("sessions/ongoing", { params: { limit } });
  getAllSessions = (limit) => client.get("sessions/all", { params: { limit } });
  getSession = (id) => client.get(`sessions/${id}`);
  deleteSession = (id) => client.delete(`sessions/${id}`);

  getRivals = (userId) =>
    client.get("rivals", { params: userId ? { userId } : {} });
  postRival = (rivalId) => client.post("rivals", { rivalId });
  getRivalScores = (mode, songId, diff, userId) =>
    client.get(`rivals/scores/${mode}/${songId}/${diff}`, {
      params: userId ? { userId } : {},
    });

  ocrScore = (file) => {
    const data = new FormData();
    data.append("scoreImage", file);
    return client.post("/ocr/ocr", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
}

export default client;
