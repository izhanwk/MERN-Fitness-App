import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";
import Loader from "./Loader";
import { useAlert } from "./Alert";
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

function Changepassword() {
  const { showAlert, Alert } = useAlert();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        },
      );
      if (res.status >= 200 && res.status < 300) {
        setOtpSent(true);
      } else {
        const message = res.data?.message || "Failed to send OTP";
        showAlert(message, "error", "OTP Failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      showAlert("Passwords do not match", "error", "Password Mismatch");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/change-password`,
        { email, otp, password },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          validateStatus: () => true,
        },
      );
      if (res.status >= 200 && res.status < 300) {
        showAlert(
          "Password updated successfully!",
          "success",
          "Password Changed",
        );
        navigate("/signin");
      } else {
        const data = res.data;
        showAlert(
          data.message || "Error updating password",
          "error",
          "Update Failed",
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex flex-col">
      {loading && <Loader />}
      <Alert />
      <Navbar />
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="glass-panel w-full max-w-md p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-950/30">
              <Lock className="h-7 w-7 text-white" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {otpSent ? "Set New Password" : "Forgot Password"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {otpSent
                ? "Enter your OTP and choose a new password."
                : "Enter your email to receive an OTP."}
            </p>
          </div>

          <form
            onSubmit={otpSent ? changePassword : sendOtp}
            className="space-y-4"
          >
            {!otpSent && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="theme-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {otpSent && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-100">
                    OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="theme-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-100">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter a new password"
                    className="theme-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-100">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    className="theme-input"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-400 hover:to-sky-400"
            >
              {otpSent ? "Change Password" : "Send OTP"}
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
              {otpSent ? (
                <p>Use the latest OTP sent to your email.</p>
              ) : (
                <p>OTP requests are rate-limited for security.</p>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Changepassword;
