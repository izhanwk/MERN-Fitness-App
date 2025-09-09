import DNavbar from "./DNavbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";
import apiFetch from "../utils/api";
import Loader from "./Loader";

function Musclegain() {
  const [musclegainMode, setMusclegainMode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendData = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("http://localhost:5000/mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mode: musclegainMode }),
      });

      if (response.ok) {
        alert("Mode saved successfully!");
        navigate("/activity");
      } else {
        alert("An error occurred while saving your mode.");
      }
    } catch (err) {
      console.error(err);
      alert("A problem occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (musclegainMode) {
      sendData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musclegainMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0  items-center font-dm-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {loading && <Loader />}
      <DNavbar />

      <div className="flex w-screen relative z-10">
        <SDNavbar />
        <div className="w-screen flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Choose Your Muscle Gain Mode
            </h1>
            <p className="text-purple-200 text-lg max-w-md mx-auto">
              Select the muscle gain pace that fits your fitness journey
            </p>
          </div>

          <div className="w-full max-w-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-purple-500/10">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600">
              <h2 className="text-white text-lg font-bold text-center py-2">
                Select Muscle Gain Mode
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center p-8 space-y-6 md:space-y-0 md:space-x-6">
              {/* Moderate Muscle Gain */}
              <div
                onClick={() => setMusclegainMode("Moderate Musclegain")}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 w-full md:w-1/2"
              >
                <div className="w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:shadow-lg hover:shadow-yellow-400/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-black"
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
                  <span className="text-white font-semibold text-lg text-center">
                    Moderate Muscle Gain
                  </span>
                  <p className="text-purple-200 text-sm text-center mt-2">
                    Balanced muscle growth with minimal fat gain.
                  </p>
                </div>
              </div>

              {/* Fast Muscle Gain */}
              <div
                onClick={() => setMusclegainMode("Fast Musclegain")}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 w-full md:w-1/2"
              >
                <div className="w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:shadow-lg hover:shadow-yellow-400/20">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-black"
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
                  <span className="text-white font-semibold text-lg text-center">
                    Fast Muscle Gain
                  </span>
                  <p className="text-purple-200 text-sm text-center mt-2">
                    Rapid growth but higher chance of fat gain.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-purple-300 text-xs md:text-sm text-center pb-6">
              <span className="font-semibold">Note:</span> Moderate muscle gain
              is usually the healthiest approach for lean growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Musclegain;
