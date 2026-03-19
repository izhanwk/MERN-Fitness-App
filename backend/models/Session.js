import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    device: { type: String, required: true, trim: true },
    ip: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    currentDevice: { type: Boolean, default: false },
  },
  { versionKey: false }
);

sessionSchema.index({ userId: 1, createdAt: -1 });

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema, "sessions");

export default Session;
