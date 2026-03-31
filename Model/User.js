import mongoose from "mongoose";
import { isValidEmail, normalizeEmail } from "../backend/utils/validators.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      set: normalizeEmail,
      validate: {
        validator: isValidEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    date: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    weight: {
      type: Number,
      min: 0,
    },
    weightScale: {
      type: String,
      enum: ["kg", "Kgs", "lbs", "Lbs", ""],
      default: "",
    },
    height: {
      type: Number,
      min: 0,
    },
    lengthScale: {
      type: String,
      enum: ["cm", "ft", "in", ""],
      default: "",
    },
    goal: {
      type: String,
      trim: true,
      default: "",
    },
    mode: {
      type: String,
      trim: true,
      default: "",
    },
    activity: {
      type: Number,
      min: 0,
    },
    array: {
      type: Array,
      default: [],
    },
    googleId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    profileComplete: {
      type: String,
      enum: ["Incomplete", "Complete"],
      default: "Incomplete",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

export default User;
