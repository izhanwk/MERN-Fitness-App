import { useState, useEffect } from "react";
import DNavbar from "./DNavbar";
import { Clock3, Laptop, LogOut, MapPin, ShieldCheck } from "lucide-react";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

const SectionHeader = ({ icon: Icon, label, iconColor }) => (
  <div className="mb-3 mt-8 flex items-center gap-3">
    <div
      className="flex h-8 w-8 items-center justify-center rounded-xl"
      style={{ background: `${iconColor}20` }}
    >
      <Icon className="h-4 w-4" style={{ color: iconColor }} />
    </div>
    <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/45">
      {label}
    </h3>
    <div className="h-px flex-1 bg-white/8" />
  </div>
);

function Sessions() {
  const { showAlert, Alert } = useAlert();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const currentSessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("sessionId");
        if (!token || !sessionId) {
          setLoading(false);
          return console.error("No token in localStorage");
        }

        const response = await axios.get(`${API_URL}/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Session-Id": sessionId,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error("Failed to fetch sessions");
        }

        setSessions(response.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logOutSession = async (id) => {
    setActionLoading(true);
    try {
      if (id === currentSessionId) {
        showAlert("You're currently using this session.", "info", "Active Session");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      const response = await axios.delete(`${API_URL}/logoutsession?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          ...(sessionId && { "X-Session-Id": sessionId }),
          "ngrok-skip-browser-warning": "true",
        },
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 300) {
        setSessions((prev) => prev.filter((session) => session._id !== id));
      } else {
        showAlert(
          response.data?.message || "Error deleting session",
          "error",
          "Delete Failed",
        );
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      showAlert("Server error", "error", "Connection Error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/40 text-white font-sans relative">
      {(loading || actionLoading) && <Loader />}
      <Alert />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-purple-600/12 blur-[100px]" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-blue-600/12 blur-[100px]" />
      </div>

      <DNavbar />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/30">
              Session security
            </p>
            <h1 className="flex flex-wrap items-center gap-2 text-lg font-bold sm:text-xl">
              <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                Active Sessions
              </span>
              <span className="font-light text-white/20">·</span>
              <span className="text-sm font-normal text-white/40">
                Device access overview
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/60">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-300" />
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </div>
        </div>

        <SectionHeader
          icon={Laptop}
          label="Signed In Devices"
          iconColor="#38bdf8"
        />

        {loading ? (
          <div className="rounded-2xl border border-white/8 bg-white/4 px-6 py-12 text-center text-sm text-white/40 backdrop-blur-sm">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-white/4 px-6 py-12 text-center text-sm text-white/40 backdrop-blur-sm">
            No active sessions found.
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const current = session.currentDevice || session._id === currentSessionId;

              return (
                <div
                  key={session._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                >
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.10),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/12">
                          <Laptop className="h-5 w-5 text-sky-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                              {session.device || "Unknown device"}
                            </h2>
                            {current && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                                <ShieldCheck className="h-3 w-3" />
                                Current
                              </span>
                            )}
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-white/50 sm:grid-cols-2">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-white/25" />
                              <span>{session.ip || "IP unavailable"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock3 className="h-3.5 w-3.5 text-white/25" />
                              <span>
                                Created {new Date(session.createdAt).toLocaleString()}
                              </span>
                            </p>
                            <p className="flex items-center gap-2 sm:col-span-2">
                              <Clock3 className="h-3.5 w-3.5 text-white/25" />
                              <span>
                                Last active {new Date(session.lastActive).toLocaleString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {current ? (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-xs font-semibold text-white/45">
                        <LogOut className="h-3.5 w-3.5" />
                        Current Session
                      </div>
                    ) : (
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition-all duration-200 hover:bg-red-500/20"
                        onClick={() => logOutSession(session._id)}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Sessions;
