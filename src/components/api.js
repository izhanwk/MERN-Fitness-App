// api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

// ---- Request: attach tokens on EVERY call ----
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("token");
  const refresh = localStorage.getItem("refreshtoken");

  config.headers = {
    ...config.headers,
    ...(access && { Authorization: `Bearer ${access}` }),
    ...(refresh && { "X-Refresh-Token": refresh }),
    "ngrok-skip-browser-warning": "true",
  };
  return config;
});

let isRefreshing = false;
let refreshPromise = null;
const waiters = [];

function notifyWaiters(token) {
  waiters.splice(0).forEach((cb) => cb(token));
}
function pushWaiter(cb) {
  waiters.push(cb);
}

// ---- Response: immediate logout on revoked, refresh only if expired ----
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;
    const code = error?.response?.data?.code; // backend should send a code
    const isRefreshCall = original?.url?.includes("/refresh-token");

    // If server marks session/refresh revoked -> skip refresh, force logout
    if (status === 401 || status === 403) {
      if (
        code === "SESSION_REVOKED" ||
        code === "TOKEN_BLACKLISTED" ||
        code === "REFRESH_REVOKED"
      ) {
        error._forceLogout = true;
        return Promise.reject(error);
      }
    }

    // Try refresh ONLY for generic 401/403 (and not for the refresh endpoint)
    if (
      (status === 401 || status === 403) &&
      !isRefreshCall &&
      original &&
      !original._retry
    ) {
      original._retry = true;

      // single-flight refresh
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem("refreshtoken");
            if (!refreshToken) throw new Error("No refresh token");
            const resp = await axios.post(
              `${API_URL}/refresh-token`,
              { refreshtoken: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${refreshToken}`,
                  "ngrok-skip-browser-warning": "true",
                },
              }
            );
            const newAccess = resp?.data?.token || null;
            if (newAccess) localStorage.setItem("token", newAccess);
            return newAccess;
          } catch (e) {
            if (e?.response?.status === 401 || e?.response?.status === 403) {
              e._forceLogout = true; // refresh itself invalid/revoked
            }
            throw e;
          } finally {
            isRefreshing = false;
          }
        })();

        refreshPromise
          .then((t) => notifyWaiters(t))
          .catch(() => notifyWaiters(null))
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await new Promise((resolve) => {
        pushWaiter((t) => resolve(t));
        if (!refreshPromise) resolve(null);
      });

      if (newToken) {
        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return api(original); // retry with fresh token
      }
    }

    return Promise.reject(error);
  }
);
