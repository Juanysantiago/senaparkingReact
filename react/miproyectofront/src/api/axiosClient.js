import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://laughing-journey-jj444rxjgpq9fqpj6-3000.app.github.dev/",
  headers: {
    "Content-Type": "application/json",
  },
});

// (Opcional) Adjuntar token automáticamente a futuras requests
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});