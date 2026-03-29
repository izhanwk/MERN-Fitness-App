import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

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
  const [googleLoaded, setgoogleLoaded] = useState(false);
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
          "Profile Setup Required",
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
        "Connection Error",
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
          "Google Sign-In",
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
          },
        );

        if (googleResponse.status === 302) {
          const sessionData = googleResponse.data?.data;
          persistSession(sessionData);
          showAlert(
            "Incomplete profile, redirecting...",
            "info",
            "Profile Setup Required",
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
          "Google Sign-In Failed",
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, persistSession, showAlert],
  );

  useEffect(() => {
    // console.log(" inside use effect");
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
        setgoogleLoaded(true);
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
      // return () => undefined;
    }

    // console.log("Creating button");
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
      <div className="app-shell font-dm-sans">
        <Navbar />
        <div className="ambient-orbs" />
        <div className="ambient-orb-center" />

        <div className="flex w-screen relative z-10">
          <div className="w-screen flex flex-col items-center justify-center py-8 md:py-12 px-4">
            <div className="text-center mb-6 md:mb-10">
              <h1 className="theme-heading mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
                Welcome Back
              </h1>
              <p className="mx-auto max-w-md text-sm text-white/65 md:text-lg">
                Sign in to continue your fitness journey and track your
                nutrition progress
              </p>
            </div>

            <div className="glass-panel w-full max-w-md overflow-hidden">
              <div className="panel-header p-2">
                <h2 className="text-white text-base md:text-lg font-bold text-center py-2">
                  Sign In to Your Account
                </h2>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center text-sm p-6 md:p-8 space-y-6 md:space-y-8"
              >
                <div className="relative w-full">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4 text-white/45 md:h-5 md:w-5"
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
                    <label className="text-xs font-medium text-white/70 md:text-sm">
                      Email Address
                    </label>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`theme-input h-12 rounded-xl border-2 text-sm md:h-14 md:px-5 md:text-base ${
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
                      className="mr-2 h-4 w-4 text-white/45 md:h-5 md:w-5"
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
                    <label className="text-xs font-medium text-white/70 md:text-sm">
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className={`theme-input h-12 rounded-xl border-2 text-sm md:h-14 md:px-5 md:text-base ${
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
                    className="text-xs text-sky-300 transition-colors hover:text-sky-200 md:text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-4 md:pt-6 w-full">
                  <button
                    type="submit"
                    className="group relative flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-base font-bold text-white shadow-2xl shadow-purple-950/30 transition-all duration-300 hover:scale-[1.02] hover:from-purple-400 hover:to-sky-400 md:h-14 md:text-lg"
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
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-sky-400 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
                  </button>
                </div>

                <div className="w-full pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/20"></span>
                    <span className="text-xs uppercase tracking-widest text-white/45">
                      or continue with
                    </span>
                    <span className="h-px flex-1 bg-white/20"></span>
                  </div>
                  <div className="flex justify-center" ref={googleButtonRef}>
                    <button
                      disabled={!googleLoaded}
                      id="customGoogleBtn"
                      className={`flex items-center justify-center gap-3 w-full sm:w-auto bg-white border border-gray-300 text-gray-600 font-medium rounded-md px-5 py-2 hover:bg-gray-50 transition duration-200 ${
                        googleLoaded
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className="w-5 h-5"
                      />
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                  {!GOOGLE_CLIENT_ID && (
                    <p className="text-center text-xs text-white/55">
                      Google sign-in is temporarily unavailable.
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center pt-1 md:pt-2">
                  <p className="text-xs  text-white/65 md:text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to={"/signup"}>
                      <span className="cursor-pointer font-semibold text-sky-300 underline transition-colors duration-300 hover:text-sky-200">
                        Create one now
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="mt-6 md:mt-10 text-center px-4">
              <p className="text-xs text-white/45 md:text-sm">
                By signing in, you agree to our{" "}
                <span className="cursor-pointer text-sky-300">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="cursor-pointer text-sky-300">
                  Privacy Policy
                </span>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Signin;
