import { useState } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const { showAlert, Alert } = useAlert();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, data, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        validateStatus: () => true,
      });
      if (response.status >= 200 && response.status < 300) {
        showAlert("Registration Successful! Please check your email for verification.", "success", "Account Created");
        navigate("/signin");
      } else if (response.status === 503) {
        setError("email", {
          type: "server",
          message: "This email already exists",
        });
      }
    } catch (error) {
      console.error(error);
      showAlert("Oops! There occurred a problem", "error", "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0  items-center font-dm-sans relative overflow-hidden">
      {loading && <Loader />}
      <Alert />
      <Navbar />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="flex w-screen relative z-10">
        <div className="w-screen flex flex-col items-center justify-center py-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Create Your Account
            </h1>
            <p className="text-purple-200 text-lg max-w-md mx-auto">
              Join FitTracker to start your fitness journey and achieve your
              nutrition goals
            </p>
          </div>

          <div className="w-full flex flex-col justify-start max-w-md bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-purple-500/10">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600">
              <h2 className="text-white text-lg font-bold text-center py-2">
                Register New Account
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center text-sm h-full p-8 space-y-8"
            >
              <div className="relative w-full">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <label className="text-purple-200 text-sm font-medium">
                    Email Address
                  </label>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full h-14 px-5 outline-none rounded-xl bg-white/95 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 shadow-lg border-2 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/30 focus:border-yellow-400 focus:bg-white"
                  }`}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="text-red-400 absolute -bottom-6 left-0 text-sm font-medium flex items-center mt-1">
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
                    {errors.email?.message}
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <label className="text-purple-200 text-sm font-medium">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Create a password"
                  className={`w-full h-14 px-5 outline-none rounded-xl bg-white/95 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 shadow-lg border-2 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/30 focus:border-yellow-400 focus:bg-white"
                  }`}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <div className="text-red-400 absolute -bottom-6 left-0 text-sm font-medium flex items-center mt-1">
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
                    {errors.password?.message}
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-300 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <label className="text-purple-200 text-sm font-medium">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className={`w-full h-14 px-5 outline-none rounded-xl bg-white/95 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 shadow-lg border-2 ${
                    errors.repassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/30 focus:border-yellow-400 focus:bg-white"
                  }`}
                  {...register("repassword", {
                    required: {
                      value: true,
                      message: "Please confirm your password",
                    },
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                />
                {errors.repassword && (
                  <div className="text-red-400 absolute -bottom-6 left-0 text-sm font-medium flex items-center mt-1">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 01118 0z"
                      />
                    </svg>
                    {errors.repassword?.message}
                  </div>
                )}
              </div>

              <div className="pt-4 w-full">
                <button
                  type="submit"
                  className="group relative w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Create Account
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-purple-200 text-sm">
                  Already have an account?{" "}
                  <Link to={"/signin"}>
                    <span className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-semibold underline cursor-pointer">
                      Sign in here
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
