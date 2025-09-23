import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: Boolean,
  name: String,
  date: Date,
  gender: String,
  weight: Number,
  weightScale: String,
  height: Number,
  lengthScale: String,
  goal: String,
  mode: String,
  activity: Number,
  array: Array,
  refreshtoken: String,
  googleId: String,
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  avatar: String,
  profileComplete: null,
});

const Data = mongoose.model("Data", dataSchema, "Registeration Data");
export default Data;
