import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  validateStatus: () => true,
});

api.interceptors.response.use((response) => {
  response.ok = response.status >= 200 && response.status < 300;
  return response;
});

export default api;
