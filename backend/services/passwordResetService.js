import bcrypt from "bcrypt";
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { sendEmail } from "./emailService.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendPasswordResetOtp(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  const otp = generateOtp();
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp });
  await sendEmail({
    to: email,
    subject: "Password reset OTP",
    html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
  });
}

export async function resetPassword({ email, otp, password }) {
  const record = await Otp.findOne({ email, otp });
  if (!record) {
    throw new AppError(400, "Invalid or expired OTP", "INVALID_OTP");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await Otp.deleteMany({ email });
}
