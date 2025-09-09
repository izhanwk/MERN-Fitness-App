import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/api";
import Loader from "./Loader";

function Activity() {
  const [activityLevel, setActivityLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("http://localhost:5000/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ activity: activityLevel }),
      });

      if (response.ok) {
        alert("Activity level saved successfully!");
        navigate("/dashboard");
      } else {
        alert("An error occurred while saving your activity level.");
      }
    } catch (err) {
      console.error(err);
      alert("A problem occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activityLevel) {
      sendData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityLevel]);

  const options = [
    {
      label: "Sedentary",
      sub: "Little or no workout",
      value: 1.2,
      badge: "Easy",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v8m-4-4h8"
          />
        </svg>
      ),
    },
    {
      label: "Lightly Active",
      sub: "Exercise 1–3 days/week",
      value: 1.375,
      badge: "Light",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-7 4h8M8 8h8"
          />
        </svg>
      ),
    },
    {
      label: "Moderately Active",
      sub: "Exercise 3–5 days/week",
      value: 1.55,
      badge: "Balanced",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      label: "Very Active",
      sub: "Exercise 6–7 days/week",
      value: 1.725,
      badge: "High",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Super Active",
      sub: "For athletes",
      value: 1.9,
      badge: "Athlete",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 font-dm-sans overflow-hidden">
      {/* Subtle animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <DNavbar />

      {/* Centered section (no sidebar) */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 md:px-6">
        <main className="min-h-[calc(100vh-120px)] flex items-center justify-center py-10">
          <div className="w-full max-w-3xl rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="rounded-t-3xl p-4 bg-gradient-to-r from-purple-600/80 to-blue-600/80 border-b border-white/20 text-center">
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                Select Your Activity Level
              </h1>
              <p className="text-purple-100/90 text-sm md:text-base mt-1">
                Choose the option that matches most of your weeks.
              </p>
            </div>

            {/* Options */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {options.map((opt) => {
                  const selected = activityLevel === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setActivityLevel(opt.value)}
                      type="button"
                      aria-pressed={selected}
                      className={[
                        "group relative w-full rounded-2xl border bg-white/[0.06] transition-all",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70",
                        selected
                          ? "border-yellow-400/60 shadow-lg shadow-yellow-400/10"
                          : "border-white/15 hover:border-yellow-400/40 hover:shadow-md hover:shadow-yellow-400/10",
                        "px-4 py-5 text-left",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 grid place-items-center">
                          <span className="text-black">{opt.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-base md:text-lg">
                              {opt.label}
                            </span>
                            <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 bg-white/10 text-white/80">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-purple-200/90 text-sm mt-1">
                            {opt.sub}
                          </p>
                        </div>
                        {selected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-purple-300 text-xs md:text-sm mt-6">
                <span className="font-semibold">Tip:</span> Don’t overthink
                it—consistency beats perfection.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Blocking loader */}
      {loading && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Activity;
