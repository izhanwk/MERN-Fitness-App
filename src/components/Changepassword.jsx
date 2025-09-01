import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import apiFetch from "../utils/api";

function Changepassword() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch(
        "https://7ec1b82ac30b.ngrok-free.app/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (res.ok) {
        setOtpSent(true);
      } else {
        alert("Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await apiFetch(
        "https://7ec1b82ac30b.ngrok-free.app/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, password }),
        }
      );
      if (res.ok) {
        alert("Password updated");
        navigate("/signin");
      } else {
        const data = await res.json();
        alert(data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
