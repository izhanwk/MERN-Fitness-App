import { useState, useEffect } from "react";
import DNavbar from "./DNavbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SDNavbar from "./SDNavbar";
import api from "../utils/api";
import Loader from "./Loader";

function Goals() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedGoal = watch("goal");

  const navigate = useNavigate();
  const [goal, setgoal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGoal) {
      setgoal(selectedGoal);
    }
  }, [selectedGoal]);
  console.log(`goal: ${goal}`);

  const buttonClick = () => {
    if (goal == "musclegain") {
      navigate("/musclegain");
    } else {
      navigate("/fatloss");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response = await api.post(
        "/goals",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("Your goal has been submitted successfully!");
        buttonClick();
      }
      if (!response.ok) {
        alert("An error occurred from server. Please login again.");
      }
    } catch (err) {
      console.error(err);
      alert("Problem while connecting with server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0  items-center font-dm-sans relative overflow-hidden">
      {/* Animated background elements */}
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center p-8 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Muscle Gain Option */}
                <label
                  htmlFor="musclegain"
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedGoal === "musclegain" ? "scale-105" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    id="musclegain"
                    value="musclegain"
                    className="appearance-none"
                    {...register("goal", { required: "Please select a goal" })}
                  />
                  <div
                    className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                      selectedGoal === "musclegain"
                        ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                        : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5"
                    }`}
                  >
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
                </label>

                {/* Fat Loss Option */}
                <label
                  htmlFor="fatloss"
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedGoal === "fatloss" ? "scale-105" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    id="fatloss"
                    value="fatloss"
                    className="appearance-none"
                    {...register("goal", { required: "Please select a goal" })}
                  />
                  <div
                    className={`w-full h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                      selectedGoal === "fatloss"
                        ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                        : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-yellow-400/5"
                    }`}
                  >
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
                </label>
              </div>

              {errors.goal && (
                <div className="text-red-400 text-sm font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.goal.message}
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full max-w-xs h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Continue
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
