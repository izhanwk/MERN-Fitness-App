import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Signin() {
  const navigate = useNavigate();
  const { showAlert, Alert } = useAlert();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  const persistSession = useCallback((session) => {
    if (!session) return;
    if (session.token) {
      localStorage.setItem("token", session.token);
    }
    if (session.sessionId) {
      localStorage.setItem("sessionId", session.sessionId);
    } else {
      localStorage.removeItem("sessionId");
    }
    localStorage.removeItem("refreshtoken");
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/signin`, data, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        validateStatus: () => true,
      });

      if (response.status === 302) {
        const sessionData = response.data?.data;
        persistSession(sessionData);
        showAlert(
          "Incomplete profile, redirecting...",
          "info",
          "Profile Setup Required"
        );
        const emailForSetup = sessionData?.email || data.email;
        navigate("/signup/userdata", { state: { email: emailForSetup } });
        return;
      }

      if (response.status >= 200 && response.status < 300) {
        persistSession(response.data?.data);
        navigate("/dashboard");
        return;
      }

      const errorData = response.data;
      setError("email", {
        type: "server",
        message: errorData?.message || "You provided wrong data",
      });
      setError("password", {
        type: "server",
        message: errorData?.message || "You provided wrong data",
      });
    } catch (err) {
      showAlert(
        "An error occurred. Please try again.",
        "error",
        "Connection Error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      const credential = response?.credential;
      if (!credential) {
        showAlert(
          "Google authentication failed. Please try again.",
          "error",
          "Google Sign-In"
        );
        return;
      }

      setLoading(true);
      try {
        const googleResponse = await axios.post(
          `${API_URL}/signin/google`,
          { credential },
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
            validateStatus: () => true,
          }
        );

        if (googleResponse.status === 302) {
          const sessionData = googleResponse.data?.data;
          persistSession(sessionData);
          showAlert(
            "Incomplete profile, redirecting...",
            "info",
            "Profile Setup Required"
          );
          const emailForSetup = sessionData?.email;
          navigate("/signup/userdata", { state: { email: emailForSetup } });
          return;
        }

        if (googleResponse.status >= 200 && googleResponse.status < 300) {
          persistSession(googleResponse.data?.data);
          navigate("/dashboard");
          return;
        }

        const message =
          googleResponse.data?.message ||
          "Unable to sign in with Google. Please try another method.";
        showAlert(message, "error", "Google Sign-In Failed");
      } catch (error) {
        console.error("Google sign-in error:", error);
        showAlert(
          "We couldn’t reach Google sign-in. Please try again.",
          "error",
          "Google Sign-In Failed"
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, persistSession, showAlert]
  );

  useEffect(() => {
    console.log(" inside use effect");
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) {
      return;
    }

    const scriptSrc = "https://accounts.google.com/gsi/client";

    const renderGoogleButton = () => {
      if (window.google && googleButtonRef.current) {
        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    };

    let script = document.querySelector(`script[src="${scriptSrc}"]`);
    const handleLoad = () => {
      if (script) {
        script.dataset.loaded = "true";
      }
      renderGoogleButton();
    };

    if (script) {
      if (script.dataset.loaded) {
        renderGoogleButton();
      } else {
        script.addEventListener("load", handleLoad);
        return () => {
          script?.removeEventListener("load", handleLoad);
        };
      }
      return () => undefined;
    }

    script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [handleGoogleCredentialResponse]);

  return (
    <>
      {loading && <Loader />}
      <Alert />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-0 m-0 font-dm-sans relative overflow-hidden">
        <Navbar />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="flex w-screen relative z-10">
          <div className="w-screen flex flex-col items-center justify-center py-8 md:py-12 px-4">
            <div className="text-center mb-6 md:mb-10">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3 md:mb-4">
                Welcome Back
              </h1>
              <p className="text-purple-200 text-sm md:text-lg max-w-md mx-auto">
                Sign in to continue your fitness journey and track your
                nutrition progress
              </p>
            </div>

            <div className="w-full flex flex-col justify-start max-w-md bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-purple-500/10">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600">
                <h2 className="text-white text-base md:text-lg font-bold text-center py-2">
                  Sign In to Your Account
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
                      className="h-4 w-4 md:h-5 md:w-5 text-purple-300 mr-2"
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
                    <label className="text-purple-200 text-xs md:text-sm font-medium">
                      Email Address
                    </label>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full h-12 md:h-14 px-4 md:px-5 outline-none rounded-xl bg-white/95 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 shadow-lg border-2 text-sm md:text-base ${
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
                        value: /^[A-Z00-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="text-red-400 absolute -bottom-5 md:-bottom-6 left-0 text-xs md:text-sm font-medium flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4 mr-1"
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
                      className="h-4 w-4 md:h-5 md:w-5 text-purple-300 mr-2"
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
                    <label className="text-purple-200 text-xs md:text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full h-12 md:h-14 px-4 md:px-5 outline-none rounded-xl bg-white/95 backdrop-blur-sm text-slate-800 font-medium transition-all duration-300 shadow-lg border-2 text-sm md:text-base ${
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
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <div className="text-red-400 absolute -bottom-5 md:-bottom-6 left-0 text-xs md:text-sm font-medium flex items-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4 mr-1"
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

                <div className="w-full text-right mt-2">
                  <Link
                    to="/changepassword"
                    className="text-yellow-400 text-xs md:text-sm hover:text-yellow-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-4 md:pt-6 w-full">
                  <button
                    type="submit"
                    className="group relative w-full h-12 md:h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-base md:text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 md:h-5 md:w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  </button>
                </div>

                <div className="w-full pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/20"></span>
                    <span className="text-xs uppercase tracking-widest text-purple-200">
                      or continue with
                    </span>
                    <span className="h-px flex-1 bg-white/20"></span>
                  </div>
                  <div className="flex justify-center">
                    <div
                      ref={googleButtonRef}
                      className="w-full flex justify-center"
                    ></div>
                  </div>
                  {!GOOGLE_CLIENT_ID && (
                    <p className="text-xs text-center text-purple-200">
                      Google sign-in is temporarily unavailable.
                    </p>
                  )}
                </div>

                <div className="text-center pt-3 md:pt-4">
                  <p className="text-purple-200 text-xs md:text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to={"/signup"}>
                      <span className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-semibold underline cursor-pointer">
                        Create one now
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="mt-6 md:mt-10 text-center px-4">
              <p className="text-purple-300 text-xs md:text-sm">
                By signing in, you agree to our{" "}
                <span className="text-yellow-400 cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-yellow-400 cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
