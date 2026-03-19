import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    otp: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
  },
  { versionKey: false }
);

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema, "otps");

export default Otp;
