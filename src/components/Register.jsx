import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

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
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

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
        showAlert(
          `Registration Successful! Please check ${response.data} for verification.`,
          "success",
          "Account Created",
          8000,
        );

        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current);
        }

        redirectTimeoutRef.current = setTimeout(() => {
          navigate("/signin");
        }, 8000);
      } else if (response.status === 503) {
        setError("email", {
          type: "server",
          message: "This email already exists",
        });
      }
    } catch (error) {
      console.error(error);
      showAlert(
        "Oops! There occurred a problem",
        "error",
        "Registration Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell font-dm-sans">
      {loading && <Loader />}
      <Alert />
      <Navbar />
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />

      <div className="relative z-10 flex min-h-[calc(100vh-120px)] w-full flex-col items-center justify-center px-4 py-5 md:py-8">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="theme-heading mb-4 text-5xl font-bold">
              Create Your Account
            </h1>
            <p className="mx-auto max-w-md text-lg text-white/65">
              Join FitTracker to start your fitness journey and achieve your
              nutrition goals
            </p>
          </div>

          <div className="glass-panel flex w-full max-w-md flex-col justify-start overflow-hidden">
            <div className="panel-header p-2">
              <h2 className="text-white text-lg font-bold text-center py-2">
                Register New Account
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center text-sm h-full p-6 md:p-8 space-y-6 md:space-y-8"
            >
              <div className="relative w-full">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5 text-white/45"
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
                  <label className="text-sm font-medium text-white/70">
                    Email Address
                  </label>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`theme-input h-14 border-2 px-5 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/20 focus:border-purple-400"
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
                    className="mr-2 h-5 w-5 text-white/45"
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
                  <label className="text-sm font-medium text-white/70">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Create a password"
                  className={`theme-input h-14 border-2 px-5 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/20 focus:border-purple-400"
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
                    className="mr-2 h-5 w-5 text-white/45"
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
                  <label className="text-sm font-medium text-white/70">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  className={`theme-input h-14 border-2 px-5 ${
                    errors.repassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/20 focus:border-purple-400"
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
                  className="group relative flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-bold text-white shadow-2xl shadow-purple-950/30 transition-all duration-300 hover:scale-[1.02] hover:from-purple-400 hover:to-sky-400"
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
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-sky-400 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-white/65">
                  Already have an account?{" "}
                  <Link to={"/signin"}>
                    <span className="cursor-pointer font-semibold text-sky-300 underline transition-colors duration-300 hover:text-sky-200">
                      Sign in here
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
