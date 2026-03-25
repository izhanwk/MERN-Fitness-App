import mongoose from "mongoose";

const otpRequestSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: 21600 },
});

const OtpRequest = mongoose.model("OtpRequest", otpRequestSchema, "otp_requests");

export default OtpRequest;
