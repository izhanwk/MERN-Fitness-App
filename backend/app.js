import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  const allowedOrigins = [
    "http://localhost:5173",
    "https://mern-fitness-app-one.vercel.app",
  ];
  const extraOrigin = process.env.FRONTEND_ORIGIN;

  if (extraOrigin && !allowedOrigins.includes(extraOrigin)) {
    allowedOrigins.push(extraOrigin);
  }

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

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/", authRoutes);
  app.use("/", profileRoutes);
  app.use("/", foodRoutes);
  app.use("/", sessionRoutes);
  app.use("/", passwordRoutes);

  return app;
}

const app = createApp();

export default app;
