import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

const API_URL = import.meta.env.VITE_API_URL;

function Changepassword() {
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
        }
      );
      if (res.status >= 200 && res.status < 300) {
        setOtpSent(true);
      } else {
        alert("Failed to send OTP");
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
      alert("Passwords do not match");
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
        }
      );
      if (res.status >= 200 && res.status < 300) {
        alert("Password updated");
        navigate("/signin");
      } else {
        const data = res.data;
        alert(data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {loading && <Loader />}
      <Navbar />
      <div className="flex w-screen items-center justify-center pt-10">
        <form
          onSubmit={otpSent ? changePassword : sendOtp}
          className="flex flex-col space-y-4 bg-white/10 p-6 rounded-xl backdrop-blur-md"
        >
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {otpSent && (
            <>
              <input
                type="text"
                placeholder="OTP"
                className="px-4 py-2 rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New password"
                className="px-4 py-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="px-4 py-2 rounded"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </>
          )}
          <button
            type="submit"
            className="bg-yellow-400 text-black font-bold px-4 py-2 rounded"
          >
            {otpSent ? "Change Password" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Changepassword;
