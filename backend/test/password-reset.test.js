/** @vitest-environment node */

import "./setup.js";
import bcrypt from "bcrypt";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Data from "../../Model/Registerdata.js";
import Otp from "../../Model/Otp.js";
import OtpRequest from "../../Model/OtpRequest.js";

const sendEmailMock = vi.fn().mockResolvedValue(undefined);

vi.mock("../emailSender.js", () => ({
  sendEmail: sendEmailMock,
}));

let app;

beforeEach(async () => {
  sendEmailMock.mockClear();

  if (!app) {
    ({ default: app } = await import("../app.js"));
  }
});

describe("password reset routes", () => {
  it("returns 404 for forgot-password when the user does not exist", async () => {
    const response = await request(app).post("/forgot-password").send({
      email: "missing@example.com",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found",
    });
  });

  it("creates an OTP request and sends email for forgot-password", async () => {
    const email = "forgot@example.com";
    await Data.create({
      email,
      password: await bcrypt.hash("Password123", 10),
      verified: true,
    });

    const response = await request(app).post("/forgot-password").send({ email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "OTP sent" });
    expect(await Otp.findOne({ email })).not.toBeNull();
    expect(await OtpRequest.findOne({ email })).not.toBeNull();
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
  });

  it("updates the password when a valid OTP is provided", async () => {
    const email = "changepassword@example.com";
    const oldPassword = "Password123";
    const newPassword = "NewPassword456";

    await Data.create({
      email,
      password: await bcrypt.hash(oldPassword, 10),
      verified: true,
    });
    await Otp.create({ email, otp: "123456" });

    const response = await request(app).post("/change-password").send({
      email,
      otp: "123456",
      password: newPassword,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Password updated" });

    const updatedUser = await Data.findOne({ email });
    expect(await bcrypt.compare(newPassword, updatedUser.password)).toBe(true);
    expect(await Otp.findOne({ email })).toBeNull();
  });

  it("returns 400 when change-password receives an invalid OTP", async () => {
    const email = "badotp@example.com";

    await Data.create({
      email,
      password: await bcrypt.hash("Password123", 10),
      verified: true,
    });

    const response = await request(app).post("/change-password").send({
      email,
      otp: "000000",
      password: "NewPassword456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid or expired OTP",
    });
  });

  it("returns 429 when OTP request limit is exceeded", async () => {
    const email = "ratelimit@example.com";
    await Data.create({
      email,
      password: await bcrypt.hash("Password123", 10),
      verified: true,
    });

    await OtpRequest.insertMany(
      Array.from({ length: 10 }, () => ({
        email,
        createdAt: new Date(),
      })),
    );

    const response = await request(app).post("/forgot-password").send({ email });

    expect(response.status).toBe(429);
    expect(response.body.message).toContain("OTP request limit reached");
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
