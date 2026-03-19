import test, { afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "test-access-secret";
process.env.REFRESH = "test-refresh-secret";
process.env.JWT_VERIFY = "test-email-secret";

const [{ createApp }, UserModule, SessionModule, tokenServiceModule] = await Promise.all([
  import("../app.js"),
  import("../models/User.js"),
  import("../models/Session.js"),
  import("../services/tokenService.js"),
]);

const User = UserModule.default;
const Session = SessionModule.default;
const { signAccessToken } = tokenServiceModule;
const app = createApp();

afterEach(() => {
  mock.restoreAll();
});

test("POST /api/auth/register rejects invalid payloads with a validation error", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email: "bad-email", password: "123" });

  assert.equal(response.status, 422);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(response.body.error.details));
});

test("GET /api/foods requires authentication", async () => {
  const response = await request(app).get("/api/foods");

  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, "AUTH_REQUIRED");
});

test("POST /api/auth/signin returns an access token and session metadata", async () => {
  const userId = new mongoose.Types.ObjectId();
  const passwordHash = await bcrypt.hash("password123", 4);

  mock.method(User, "findOne", async () => ({
    _id: userId,
    id: userId.toString(),
    email: "demo@example.com",
    password: passwordHash,
    height: 180,
    goal: "musclegain",
    activity: 1.55,
    mode: "Moderate Musclegain",
  }));
  mock.method(Session, "updateMany", async () => ({ acknowledged: true }));
  mock.method(Session, "create", async () => ({
    _id: new mongoose.Types.ObjectId(),
  }));

  const response = await request(app)
    .post("/api/auth/signin")
    .send({ email: "demo@example.com", password: "password123" });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(typeof response.body.data.token, "string");
  assert.equal(typeof response.body.data.sessionId, "string");
  assert.equal(response.body.data.requiresProfileSetup, false);
});

test("GET /api/users/me/profile-status returns a normalized payload for authenticated users", async () => {
  const userId = new mongoose.Types.ObjectId();
  const sessionId = new mongoose.Types.ObjectId().toString();
  const accessToken = signAccessToken({
    id: userId.toString(),
    email: "demo@example.com",
  });

  mock.method(Session, "findOne", async () => ({
    lastActive: new Date(),
    currentDevice: false,
    save: async () => undefined,
  }));
  mock.method(Session, "updateMany", async () => ({ acknowledged: true }));
  mock.method(User, "findOne", async () => ({
    email: "demo@example.com",
    profileComplete: "Incomplete",
  }));

  const response = await request(app)
    .get("/api/users/me/profile-status")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("X-Session-Id", sessionId);

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.complete, false);
  assert.equal(response.body.data.profileComplete, "Incomplete");
});
