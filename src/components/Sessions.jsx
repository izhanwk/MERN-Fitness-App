import { useState, useEffect } from "react";

import DNavbar from "./DNavbar";
import { LogOut } from "lucide-react";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";

const API_URL = import.meta.env.VITE_API_URL;

function Sessions() {
  const { showAlert, Alert } = useAlert();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true); // initial load
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

        const response = await axios.get(
          `${API_URL}/sessions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Session-Id": sessionId,
              "ngrok-skip-browser-warning": "true",
            },
            validateStatus: () => true,
          }
        );

        if (response.status < 200 || response.status >= 300)
          throw new Error("Failed to fetch sessions");

        const data = response.data;
        console.log("Fetched sessions:", data);
        console.log(data);
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    })();
  }, []);

  const logOutSession = async (id) => {
    setActionLoading(true);
    try {
      if (id === currentSessionId) {
        showAlert(
          "You’re currently using this session.",
          "info",
          "Active Session"
        );
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
        setSessions((prev) => prev.filter((s) => s._id !== id));
      } else {
        const data = response.data;
        showAlert(data.message || "Error deleting session", "error", "Delete Failed");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      showAlert("Server error", "error", "Connection Error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {(loading || actionLoading) && <Loader />}
      <Alert />
      <DNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Active Sessions</h1>

        {/* Loading state */}
        {loading ? (
          <p className="text-center text-gray-400">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-400">No active sessions found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-purple-300 mb-2">
                  {session.device}
                </h2>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">IP:</span> {session.ip}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(session.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-300 mb-3">
                  <span className="font-medium">Last Active:</span>{" "}
                  {new Date(session.lastActive).toLocaleString()}
                </p>

                {session.currentDevice || session._id === currentSessionId ? (
                  <span className="inline-flex items-center space-x-2 bg-red-600/40 px-4 py-2 rounded-lg cursor-not-allowed">
                    <LogOut size={18} />
                    <span>Current Session</span>
                  </span>
                ) : (
                  <button
                    className="inline-flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-lg"
                    onClick={() => logOutSession(session._id)}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;
