import React, { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import DNavbar from "./DNavbar";
import { LogOut } from "lucide-react";
import apiFetch from "../utils/api";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return console.error("No token in localStorage");
        }

        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        const response = await apiFetch(
          `https://7ec1b82ac30b.ngrok-free.app/sessions?id=${decoded.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch sessions");

        const data = await response.json();
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
    try {
      const response = await apiFetch(
        `https://7ec1b82ac30b.ngrok-free.app/logoutsession?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <DNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Active Sessions</h1>

        {/* ✅ Loading state */}
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

                {session.currentDevice ? (
                  <span className="inline-flex items-center space-x-2 bg-red-600 opacity-30 px-4 py-2 rounded-lg">
                    Logout
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
