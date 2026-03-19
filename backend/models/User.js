import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      trim: true,
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
      maxlength: 120,
      default: "",
    },
    date: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    weight: {
      type: Number,
      min: 0,
      default: null,
    },
    weightScale: {
      type: String,
      enum: ["kg", "lb", "Kgs", "LBs", "Lbs", ""],
      default: "",
    },
    height: {
      type: Number,
      min: 0,
      default: null,
    },
    lengthScale: {
      type: String,
      enum: ["cm", "ft", "in", ""],
      default: "",
    },
    goal: {
      type: String,
      enum: ["musclegain", "fatloss", ""],
      default: "",
    },
    mode: {
      type: String,
      enum: [
        "lean bulk",
        "aggressive bulk",
        "maintain",
        "mild loss",
        "fast loss",
        "Moderate Musclegain",
        "Fast Musclegain",
        "Moderate fatloss",
        "Fast fatloss",
        "",
      ],
      default: "",
    },
    activity: {
      type: Number,
      min: 1,
      max: 2.5,
      default: null,
    },
    array: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    refreshtoken: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      trim: true,
      default: null,
      index: true,
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
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.models.User || mongoose.model("User", userSchema, "Registeration Data");

export default User;
