import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";

const API_URL = import.meta.env.VITE_API_URL;

function Data() {
  const { showAlert, Alert } = useAlert();
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
      const response = await axios.post(`${API_URL}/data`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
        validateStatus: () => true,
      });
      console.log("Connected");
      if (response.status >= 200 && response.status < 300) {
        showAlert("Your data has been submitted successfully!", "success", "Data Saved");
        navigate("/goals");
      } else if (response.status === 403) {
        const data = response.data;
        console.log("403 : ", data);
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("Oops! There was a problem submitting your data.", "error", "Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-transparent px-4 py-6 md:py-8">
      {loading && <Loader />}
      <Alert />
      <div className="glass-panel w-full max-w-md overflow-hidden">
        <div className="panel-header p-2">
          <h2 className="text-white text-lg font-bold text-center py-2">
            Complete Your Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Name Field */}
          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-white/70">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`theme-input rounded-lg border-2 py-3 text-slate-800 placeholder:text-slate-400 ${
                errors.name ? "border-red-500 bg-red-50 text-slate-800" : "border-white/15 bg-white/90 text-slate-800 focus:border-purple-400"
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
            <label className="mb-1 block text-sm font-medium text-white/70">
              Date of Birth
            </label>
            <input
              type="date"
              className={`theme-input rounded-lg border-2 py-3 text-slate-800 ${
                errors.date ? "border-red-500 bg-red-50 text-slate-800" : "border-white/15 bg-white/90 text-slate-800 focus:border-purple-400"
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
            <label className="mb-1 block text-sm font-medium text-white/70">
              Gender
            </label>
            <select
              className="theme-select rounded-lg border-2 border-white/15 bg-white/90 py-3 text-slate-800 focus:border-purple-400"
              {...register("gender")}
            >
              <option value="male" className="bg-slate-900 font-semibold text-white">
                Male
              </option>
              <option
                value="female"
                className="bg-slate-900 font-semibold text-white"
              >
                Female
              </option>
            </select>
          </div>

          {/* Weight Field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-white/70">
                Weight
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="Enter weight"
                className={`theme-input max-md:text-xs rounded-lg border-2 py-3 text-slate-800 placeholder:text-slate-400 ${
                  errors.weight ? "border-red-500 bg-red-50 text-slate-800" : "border-white/15 bg-white/90 text-slate-800 focus:border-purple-400"
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
              <label className="mb-1 block text-sm font-medium text-white/70">
                Unit
              </label>
              <select
                className="theme-select max-md:text-xs rounded-lg border-2 border-white/15 bg-white/90 py-3 text-slate-800 focus:border-purple-400"
                {...register("weightScale")}
              >
                <option className="bg-slate-900 font-semibold text-white">
                  LBs
                </option>
                <option className="bg-slate-900 font-semibold text-white">
                  Kgs
                </option>
              </select>
            </div>
          </div>

          {/* Height Field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-white/70">
                Height
              </label>
              <input
                type="number"
                step="any"
                placeholder="Enter height"
                className={`theme-input max-md:text-xs rounded-lg border-2 py-3 text-slate-800 placeholder:text-slate-400 ${
                  errors.height ? "border-red-500 bg-red-50 text-slate-800" : "border-white/15 bg-white/90 text-slate-800 focus:border-purple-400"
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
              <label className="mb-1 block text-sm font-medium text-white/70">
                Unit
              </label>
              <select
                className="theme-select max-md:text-xs rounded-lg border-2 border-white/15 bg-white/90 py-3 text-slate-800 focus:border-purple-400"
                {...register("lengthScale")}
              >
                <option className="bg-slate-900 font-semibold text-white">ft</option>
                <option className="bg-slate-900 font-semibold text-white">cm</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-950/25 transition-all duration-300 hover:scale-105 hover:from-purple-400 hover:to-sky-400 active:scale-95"
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
