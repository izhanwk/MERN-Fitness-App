import { useState, useEffect } from "react";
import DNavbar from "./DNavbar";
import { useNavigate } from "react-router-dom";
// import SDNavbar from "./SDNavbar";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

function Goals() {
  const { showAlert, Alert } = useAlert();
  const navigate = useNavigate();
  const [goal, setgoal] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonClick = () => {
    if (goal === "musclegain") {
      navigate("/musclegain");
    } else {
      navigate("/fatloss");
    }
  };

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/goals`,
        { goal },
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
        showAlert(
          "Your goal has been submitted successfully!",
          "success",
          "Goal Set",
        );
        buttonClick();
      }
      if (response.status < 200 || response.status >= 300) {
        showAlert(
          "An error occurred from server. Please login again.",
          "error",
          "Server Error",
        );
      }
    } catch (err) {
      console.error(err);
      showAlert(
        "Problem while connecting with server",
        "error",
        "Connection Error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (goal) {
      sendData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal]);

  return (
    <div className="app-shell font-dm-sans">
      <Alert />
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />

      {loading && <Loader />}
      <DNavbar />

      <div className="relative z-10 flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-center mb-10">
            <h1 className="theme-heading mb-4 text-4xl font-bold md:text-5xl">
              Choose Your Fitness Goal
            </h1>
            <p className="mx-auto max-w-md text-lg text-white/60">
              Select your primary objective to personalize your fitness journey
            </p>
          </div>

          <div className="glass-panel w-full max-w-2xl overflow-hidden">
            <div className="panel-header p-2">
              <h2 className="text-white text-lg font-bold text-center py-2">
                Select Your Goal
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div
                  onClick={() => setgoal("musclegain")}
                  className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  <div className="theme-option flex h-40 w-full flex-col items-center justify-center border-2 p-4 hover:border-purple-400/35">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-semibold text-lg text-center">
                      Muscle Gain
                    </span>
                    <p className="mt-2 text-center text-sm text-white/55">
                      Build strength and increase muscle mass
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setgoal("fatloss")}
                  className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  <div className="theme-option flex h-40 w-full flex-col items-center justify-center border-2 p-4 hover:border-blue-400/35">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-semibold text-lg text-center">
                      Fat Loss
                    </span>
                    <p className="mt-2 text-center text-sm text-white/55">
                      Lose weight and improve body composition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Goals;
