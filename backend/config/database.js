import mongoose from "mongoose";
import { config } from "./env.js";

let connectionPromise;

export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.mongoUri);
  }

  return connectionPromise;
}
