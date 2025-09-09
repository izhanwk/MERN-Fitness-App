import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Loader from "./Loader";

function Data() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response = await api.post(
        "/data",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Connected");
      if (response.ok) {
        alert("Your data has been submitted successfully!");
        navigate("/goals");
      } else if (response.status === 403) {
        const data = response.data;
        console.log("403 : ", data);
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Oops! There was a problem submitting your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {loading && <Loader />}
      <div className="w-full max-w-md bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="text-white text-lg font-bold text-center py-2">
            Complete Your Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Name Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                errors.name ? "border-red-500" : "border-white/20"
              }`}
              {...register("name", {
                required: { value: true, message: "Name is required" },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
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
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                errors.date ? "border-red-500" : "border-white/20"
              }`}
              {...register("date", {
                required: { value: true, message: "Date of birth is required" },
              })}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
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
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">
              Gender
            </label>
            <select
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              {...register("gender")}
            >
              <option value="male" className="text-indigo-900/70 font-semibold">
                Male
              </option>
              <option
                value="female"
                className="text-indigo-900/70 font-semibold"
              >
                Female
              </option>
            </select>
          </div>

          {/* Weight Field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-purple-200 mb-1">
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter weight"
                className={`w-full max-md:text-xs px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.weight ? "border-red-500" : "border-white/20"
                }`}
                {...register("weight", {
                  required: { value: true, message: "Weight is required" },
                })}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
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
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">
                Unit
              </label>
              <select
                className="w-full px-4 py-3 max-md:text-xs bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                {...register("weightScale")}
              >
                <option className="text-indigo-900/70 font-semibold">
                  LBs
                </option>
                <option className="text-indigo-900/70 font-semibold">
                  Kgs
                </option>
              </select>
            </div>
          </div>

          {/* Height Field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-purple-200 mb-1">
                Height
              </label>
              <input
                type="number"
                step="any"
                placeholder="Enter height"
                className={`w-full max-md:text-xs px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                  errors.height ? "border-red-500" : "border-white/20"
                }`}
                {...register("height", {
                  required: { value: true, message: "Height is required" },
                })}
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
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
                  {errors.height.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1">
                Unit
              </label>
              <select
                className="w-full px-4 py-3 max-md:text-xs bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                {...register("lengthScale")}
              >
                <option className="text-indigo-900/70 font-semibold">ft</option>
                <option className="text-indigo-900/70 font-semibold">cm</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
          >
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Data;
