import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Dumbbell } from "lucide-react";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function DNavbar() {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const [visible, setvisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRefreshing = useRef(false);
  const refreshPromiseRef = useRef(null);

  const clearAuthAndRedirect = (
    title = "Authentication Failed",
    message = "Please sign in again.",
  ) => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
    navigate("/signin", { replace: true });
    try { showAlert(message, "error", title); } catch {}
  };

  const scrollToFooterSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const logOut = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
    try {
      await axios.get(`${API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(sessionId && { "X-Session-Id": sessionId }),
          "ngrok-skip-browser-warning": "true",
        },
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      setLoading(false);
      navigate("/signin");
    }
  };

  const refreshSessionToken = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        throw new Error("No active session");
      }

      const response = await axios.post(
        `${API_URL}/refresh-token`,
        { sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            ...(sessionId && { "X-Session-Id": sessionId }),
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = response.data;
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (err) {
      return null;
    }
  };

  // Synchronous guard: redirect immediately if credentials are absent.
  // Expired/invalid tokens are handled by the response interceptor below.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
    if (!token || !sessionId) {
      clearAuthAndRedirect("Authentication Required", "Please sign in to continue.");
    }
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      const sessionId = localStorage.getItem("sessionId");

      config.headers = {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(sessionId && { "X-Session-Id": sessionId }),
      };

      return config;
    });

    const handleAuthFailure = async (originalRequest, response) => {
      const status = response?.status;
      const isRefreshEndpoint = originalRequest?.url?.includes("/refresh-token");

      // Never intercept the refresh endpoint itself
      if (isRefreshEndpoint) return null;

      // 401 — token is invalid/expired with no recovery path
      if (status === 401) {
        clearAuthAndRedirect("Session Expired", "Please sign in again.");
        return null;
      }

      // 403 — try a token refresh once, then redirect if it fails
      if (status === 403 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        let starter = false;
        if (!isRefreshing.current) {
          isRefreshing.current = true;
          refreshPromiseRef.current = refreshSessionToken();
          starter = true;
        }

        let newToken = null;
        try {
          newToken = await refreshPromiseRef.current;
        } finally {
          if (starter) {
            isRefreshing.current = false;
            refreshPromiseRef.current = null;
          }
        }

        if (newToken) {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }

        // Refresh failed — session is gone
        clearAuthAndRedirect("Session Expired", "Please sign in again.");
        return null;
      }

      return null;
    };

    const responseInterceptor = axios.interceptors.response.use(
      async (response) => {
        const retryResponse = await handleAuthFailure(response?.config, response);
        return retryResponse ?? response;
      },
      async (error) => {
        const retryResponse = await handleAuthFailure(error?.config, error?.response);
        return retryResponse ?? Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <div className="relative">
      {loading && <Loader />}
      <Alert />
      <nav className="theme-nav relative z-20 flex h-16 items-center sm:h-20">
        <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div
            className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-950/40 sm:h-10 sm:w-10">
              <Dumbbell
                className="h-5 w-5 text-white sm:h-6 sm:w-6"
                strokeWidth={2.5}
              />
            </div>
            <span className="truncate text-lg font-bold text-white sm:text-xl">
              FitTracker
            </span>
          </div>

          <ul className="hidden items-center space-x-2 font-dm-sans text-white lg:flex xl:space-x-4">
            <li>
              <button
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
                onClick={() => scrollToFooterSection("footer-contact")}
              >
                Contact
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
                onClick={() => scrollToFooterSection("footer-about")}
              >
                About us
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
                onClick={() => scrollToFooterSection("footer-guide")}
              >
                Guide
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white xl:px-4"
                onClick={() => navigate("/sessions")}
              >
                Sessions
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer rounded-full border border-red-400/25 bg-red-500/15 px-5 py-2 text-sm text-red-200 transition-all duration-200 hover:bg-red-500/25 xl:px-6"
                onClick={() => setvisible(true)}
              >
                Logout
              </button>
            </li>
          </ul>

          <button
            className="rounded-xl p-2 text-white transition-colors hover:bg-white/8 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute left-0 top-16 z-40 flex w-full flex-col space-y-3 border-b border-white/10 bg-slate-950/90 px-4 py-4 text-white backdrop-blur-lg sm:top-20 sm:px-6 lg:hidden">
          <button
            className="cursor-pointer rounded-xl px-3 py-2 text-left text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              scrollToFooterSection("footer-contact");
              setMenuOpen(false);
            }}
          >
            Contact
          </button>
          <button
            className="cursor-pointer rounded-xl px-3 py-2 text-left text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              scrollToFooterSection("footer-about");
              setMenuOpen(false);
            }}
          >
            About us
          </button>
          <button
            className="cursor-pointer rounded-xl px-3 py-2 text-left text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              scrollToFooterSection("footer-guide");
              setMenuOpen(false);
            }}
          >
            Guide
          </button>
          <button
            className="cursor-pointer rounded-xl px-3 py-2 text-left text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => {
              navigate("/sessions");
              setMenuOpen(false);
            }}
          >
            Sessions
          </button>
          <button
            className="cursor-pointer rounded-full border border-red-400/25 bg-red-500/15 px-6 py-2 text-center text-red-200 transition-all duration-200 hover:bg-red-500/25"
            onClick={() => {
              setvisible(true);
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}

      {visible && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setvisible(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 h-auto w-96 max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl shadow-black/70 sm:max-w-[90%] sm:p-6">
            <p className="mb-4 font-dm-sans text-lg font-semibold text-white">
              Are you sure you want to logout?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex-1 rounded-2xl border border-white/10 bg-white/6 py-3 text-center font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
                onClick={() => setvisible(false)}
              >
                No
              </button>
              <button
                className="flex-1 rounded-2xl border border-red-400/25 bg-red-500/15 py-3 text-center font-medium text-red-200 transition-all duration-200 hover:bg-red-500/25"
                onClick={logOut}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DNavbar;
