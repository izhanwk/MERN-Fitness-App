import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import { config } from "./config/env.js";
import { notFoundMiddleware } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/apiResponse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function delegate(router, { method, url }) {
  return (req, res, next) => {
    req.method = method;
    req.url = url(req);
    return router(req, res, next);
  };
}

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.json());

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
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
    sendSuccess(res, {
      statusCode: 200,
      message: "Fitness API is running",
      data: { env: config.env },
    });
  });

  app.get("/health", (req, res) => {
    sendSuccess(res, { statusCode: 200, data: { ok: true } });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", profileRoutes);
  app.use("/api/foods", nutritionRoutes);

  app.post(
    "/register",
    delegate(authRoutes, { method: "POST", url: () => "/register" }),
  );
  app.get(
    "/verify/:token",
    delegate(authRoutes, {
      method: "GET",
      url: (req) => `/verify/${req.params.token}`,
    }),
  );
  app.post(
    "/signin",
    delegate(authRoutes, { method: "POST", url: () => "/signin" }),
  );
  app.post(
    "/signin/google",
    delegate(authRoutes, { method: "POST", url: () => "/signin/google" }),
  );
  app.post(
    "/refresh-token",
    delegate(authRoutes, { method: "POST", url: () => "/refresh" }),
  );
  app.post(
    "/forgot-password",
    delegate(authRoutes, { method: "POST", url: () => "/forgot-password" }),
  );
  app.post(
    "/change-password",
    delegate(authRoutes, { method: "POST", url: () => "/change-password" }),
  );
  app.get(
    "/sessions",
    delegate(authRoutes, { method: "GET", url: () => "/sessions" }),
  );
  app.get(
    "/logout",
    delegate(authRoutes, { method: "DELETE", url: () => "/sessions/current" }),
  );
  app.delete(
    "/logoutsession",
    delegate(authRoutes, {
      method: "DELETE",
      url: (req) => `/sessions/${req.query.id || ""}`,
    }),
  );

  app.get(
    "/getdata",
    delegate(profileRoutes, { method: "GET", url: () => "/me" }),
  );
  app.get(
    "/editdata",
    delegate(profileRoutes, { method: "GET", url: () => "/me" }),
  );
  app.post(
    "/data",
    delegate(profileRoutes, {
      method: "PUT",
      url: () => "/me/onboarding/profile",
    }),
  );
  app.post(
    "/goals",
    delegate(profileRoutes, {
      method: "PUT",
      url: () => "/me/onboarding/goal",
    }),
  );
  app.post(
    "/mode",
    delegate(profileRoutes, {
      method: "PUT",
      url: () => "/me/onboarding/mode",
    }),
  );
  app.post(
    "/activity",
    delegate(profileRoutes, {
      method: "PUT",
      url: () => "/me/onboarding/activity",
    }),
  );
  app.get(
    "/checkData",
    delegate(profileRoutes, { method: "GET", url: () => "/me/profile-status" }),
  );
  app.get(
    "/store",
    delegate(profileRoutes, { method: "GET", url: () => "/me/tracker" }),
  );
  app.put(
    "/editdata",
    delegate(profileRoutes, { method: "PATCH", url: () => "/me" }),
  );
  app.post(
    "/store",
    delegate(profileRoutes, { method: "PUT", url: () => "/me/tracker" }),
  );

  app.get(
    "/getfood",
    delegate(nutritionRoutes, { method: "GET", url: () => "/" }),
  );
  app.get(
    "/search",
    delegate(nutritionRoutes, {
      method: "GET",
      url: (req) => `/search?text=${encodeURIComponent(req.query.text || "")}`,
    }),
  );
  app.get(
    "/getfood2",
    delegate(nutritionRoutes, {
      method: "GET",
      url: (req) => `/paged?page=${encodeURIComponent(req.query.page || 0)}`,
    }),
  );

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
