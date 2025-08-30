import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional: reference to your User model
    required: true,
  },
  device: { type: String, required: true }, // e.g. "Windows Chrome", "iPhone Safari"
  ip: { type: String },
  location: { type: String }, // Optional, from IP lookup API
  token: { type: String, required: true }, // JWT or session ID
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  currentDevice: { type: Boolean, default: false },
});

// ⚠️ Better not to use space in collection name
const Sessions = mongoose.model("Sessions", dataSchema, "sessions");

export default Sessions;
