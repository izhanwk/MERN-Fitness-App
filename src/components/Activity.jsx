import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

function Activity() {
  const { showAlert, Alert } = useAlert();
  const [activityLevel, setActivityLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/activity`,
        { activity: activityLevel },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        showAlert("Activity level saved successfully!", "success", "Activity Set");
        navigate("/dashboard");
      } else {
        showAlert("An error occurred while saving your activity level.", "error", "Save Failed");
      }
    } catch (err) {
      console.error(err);
      showAlert("A problem occurred while connecting to the server.", "error", "Connection Error");
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
        </svg>
      ),
    },
    {
      label: "Lightly Active",
      sub: "Exercise 1-3 days/week",
      value: 1.375,
      badge: "Light",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-7 4h8M8 8h8" />
        </svg>
      ),
    },
    {
      label: "Moderately Active",
      sub: "Exercise 3-5 days/week",
      value: 1.55,
      badge: "Balanced",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      label: "Very Active",
      sub: "Exercise 6-7 days/week",
      value: 1.725,
      badge: "High",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Super Active",
      sub: "For athletes",
      value: 1.9,
      badge: "Athlete",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="app-shell font-dm-sans">
      <Alert />
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />

      <DNavbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 md:px-6">
        <main className="flex min-h-[calc(100vh-120px)] items-center justify-center py-10">
          <div className="glass-panel w-full max-w-3xl overflow-hidden">
            <div className="panel-header rounded-t-3xl p-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Select Your Activity Level
              </h1>
              <p className="mt-1 text-sm text-white/60 md:text-base">
                Choose the option that matches most of your weeks.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                {options.map((opt) => {
                  const selected = activityLevel === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setActivityLevel(opt.value)}
                      type="button"
                      aria-pressed={selected}
                      className={[
                        "theme-option w-full px-4 py-5",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70",
                        selected
                          ? "theme-option-active border-purple-400/50"
                          : "hover:border-blue-400/30",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                          <span className="text-white">{opt.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-semibold text-white md:text-lg">
                              {opt.label}
                            </span>
                            <span className="theme-badge">{opt.badge}</span>
                          </div>
                          <p className="mt-1 text-sm text-white/55">{opt.sub}</p>
                        </div>
                        {selected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-300" viewBox="0 0 20 20" fill="currentColor">
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

              <p className="mt-6 text-center text-xs text-white/45 md:text-sm">
                <span className="font-semibold">Tip:</span> Do not overthink it.
                Consistency beats perfection.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {loading && <Loader />}
    </div>
  );
}

export default Activity;
