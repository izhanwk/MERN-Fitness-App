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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-0 m-0 font-dm-sans relative overflow-hidden">
      <Alert />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {loading && <Loader />}
      <DNavbar />

      <div className="relative z-10 flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Choose Your Fitness Goal
            </h1>
            <p className="text-purple-200 text-lg max-w-md mx-auto">
              Select your primary objective to personalize your fitness journey
            </p>
          </div>

          <div className="w-full max-w-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-purple-500/10">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600">
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
                  <div className="w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:shadow-lg hover:shadow-yellow-400/20">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#2f1b46]"
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
                    <p className="text-purple-200 text-sm text-center mt-2">
                      Build strength and increase muscle mass
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setgoal("fatloss")}
                  className="relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:shadow-lg hover:shadow-yellow-400/20">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#2f1b46]"
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
                    <p className="text-purple-200 text-sm text-center mt-2">
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
