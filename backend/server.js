import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-fitness-app-one.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Session-Id",
      "ngrok-skip-browser-warning",
    ],
    credentials: true,
  }),
);

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Failed to connect with database: ", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", foodRoutes);
app.use("/", sessionRoutes);
app.use("/", passwordRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
