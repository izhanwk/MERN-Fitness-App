/** @vitest-environment node */

import "./setup.js";
import bcrypt from "bcrypt";
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

async function createSignedInUser(email) {
  const password = "Password123";

  await Data.create({
    email,
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
    .send({ email, password });

  return {
    token: response.body.data.token,
    sessionId: response.body.data.sessionId,
  };
}

describe("session routes", () => {
  it("requires both authorization and session headers for /sessions", async () => {
    const response = await request(app).get("/sessions");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "No Token, Access denied",
    });
  });

  it("returns the current user's sessions and marks the active one", async () => {
    const email = "sessions@example.com";
    const { token, sessionId } = await createSignedInUser(email);
    const user = await Data.findOne({ email });

    await Sessions.create({
      userId: user._id,
      token: "refresh-token-placeholder",
      device: "Other Device",
      ip: "10.0.0.8",
      createdAt: new Date(),
      lastActive: new Date(),
      currentDevice: false,
    });

    const response = await request(app)
      .get("/sessions")
      .set("Authorization", `Bearer ${token}`)
      .set("X-Session-Id", sessionId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.some((session) => session._id === sessionId)).toBe(true);
    expect(
      response.body.some(
        (session) => session._id === sessionId && session.currentDevice === true,
      ),
    ).toBe(true);
  });

  it("revokes another session for the authenticated user", async () => {
    const email = "logoutsession@example.com";
    const { token, sessionId } = await createSignedInUser(email);
    const user = await Data.findOne({ email });

    const otherSession = await Sessions.create({
      userId: user._id,
      token: "refresh-token-placeholder",
      device: "Tablet Safari",
      ip: "10.0.0.9",
      createdAt: new Date(),
      lastActive: new Date(),
      currentDevice: false,
    });

    const response = await request(app)
      .delete(`/logoutsession?id=${otherSession._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("X-Session-Id", sessionId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Killed the session successfully",
    });
    expect(await Sessions.findById(otherSession._id)).toBeNull();
  });

  it("does not allow revoking the active session through /logoutsession", async () => {
    const { token, sessionId } = await createSignedInUser("activesession@example.com");

    const response = await request(app)
      .delete(`/logoutsession?id=${sessionId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("X-Session-Id", sessionId);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Cannot revoke active session",
    });
  });
});
