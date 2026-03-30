/** @vitest-environment node */

import "./setup.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Data from "../../Model/Registerdata.js";
import Sessions from "../../Model/Sessions.js";

vi.mock("../emailSender.js", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

let app;

beforeEach(async () => {
  if (!app) {
    ({ default: app } = await import("../app.js"));
  }
});

describe("auth routes", () => {
  it("returns 401 when signin credentials are invalid", async () => {
    const response = await request(app).post("/signin").send({
      email: "missing@example.com",
      password: "Password123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "The information you entered is not correct",
    });
  });

  it("returns an access token and session id for a valid signin", async () => {
    const password = "Password123";
    const user = await Data.create({
      email: "valid@example.com",
      password: await bcrypt.hash(password, 10),
      verified: true,
      height: 180,
      weight: 80,
      activity: 3,
      profileComplete: "Complete",
    });

    const response = await request(app)
      .post("/signin")
      .set("User-Agent", "Vitest Browser/1.0")
      .send({
        email: user.email,
        password,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.needsOnboarding).toBe(false);
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.sessionId).toEqual(expect.any(String));
    expect(response.body.data.email).toBe(user.email);

    const session = await Sessions.findById(response.body.data.sessionId);
    expect(session).not.toBeNull();
    expect(session.userId.toString()).toBe(user._id.toString());
  });

  it("refreshes the access token for a valid session", async () => {
    const user = await Data.create({
      email: "refresh@example.com",
      password: await bcrypt.hash("Password123", 10),
      verified: true,
      profileComplete: "Complete",
    });

    const refreshToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.REFRESH,
      { expiresIn: "7d" },
    );

    const session = await Sessions.create({
      userId: user._id,
      token: refreshToken,
      device: "Vitest Device",
      ip: "127.0.0.1",
      createdAt: new Date(),
      lastActive: new Date(),
      currentDevice: true,
    });

    const response = await request(app).post("/refresh-token").send({
      sessionId: session._id.toString(),
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("rejects refresh token requests with an invalid session id", async () => {
    const response = await request(app).post("/refresh-token").send({
      sessionId: "not-a-valid-id",
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Invalid or expired session",
    });
  });
});
