import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

function Fatloss() {
  const { showAlert, Alert } = useAlert();
  const [fatlossMode, setFatlossMode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/mode`,
        { mode: fatlossMode },
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
        showAlert("Mode saved successfully!", "success", "Save Successful");
        navigate("/activity");
      } else {
        showAlert("An error occurred while saving your mode.", "error", "Save Failed");
      }
    } catch (err) {
      console.error(err);
      showAlert("A problem occurred while connecting to the server.", "error", "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fatlossMode) {
      sendData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fatlossMode]);

  return (
    <div className="app-shell font-dm-sans">
      <Alert />
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />

      {loading && <Loader />}
      <DNavbar />

      <div className="relative z-10 flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-10 text-center">
            <h1 className="theme-heading mb-4 text-4xl font-bold md:text-5xl">
              Choose Your Fat Loss Mode
            </h1>
            <p className="mx-auto max-w-md text-lg text-white/60">
              Select the fat loss speed that best suits your fitness journey
            </p>
          </div>

          <div className="glass-panel w-full max-w-2xl overflow-hidden">
            <div className="panel-header p-2">
              <h2 className="py-2 text-center text-lg font-bold text-white">
                Select Fat Loss Mode
              </h2>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 p-8 md:flex-row md:space-x-6 md:space-y-0">
              <div
                onClick={() => setFatlossMode("Moderate fatloss")}
                className="w-full cursor-pointer transition-all duration-300 hover:scale-105 md:w-1/2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-center text-lg font-semibold text-white">
                    Moderate Fat Loss
                  </span>
                  <p className="mt-2 text-center text-sm text-white/55">
                    Slow and sustainable weight loss for a steadier approach.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setFatlossMode("Fast fatloss")}
                className="w-full cursor-pointer transition-all duration-300 hover:scale-105 md:w-1/2"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-center text-lg font-semibold text-white">
                    Fast Fat Loss
                  </span>
                  <p className="mt-2 text-center text-sm text-white/55">
                    More aggressive progress, but harder to sustain long term.
                  </p>
                </div>
              </div>
            </div>

            <p className="pb-6 text-center text-xs text-white/45 md:text-sm">
              <span className="font-semibold">Note:</span> Moderate fat loss is
              usually the healthier option.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Fatloss;
