import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  validateStatus: () => true,
});

// Attach access token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Automatically refresh expired access tokens
api.interceptors.response.use(
  async (response) => {
    if (response.status === 403 && !response.config._retry) {
      const refreshToken = localStorage.getItem("refreshtoken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/refresh-token`,
            { refreshtoken: refreshToken },
            { headers: { "Content-Type": "application/json" } }
          );
          if (res.status === 200) {
            const newToken = res.data.token;
            localStorage.setItem("token", newToken);
            response.config.headers.Authorization = `Bearer ${newToken}`;
            response.config._retry = true;
            return api(response.config);
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshtoken");
        }
      }
    }
    response.ok = response.status >= 200 && response.status < 300;
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
