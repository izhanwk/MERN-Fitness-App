import {
  loginWithEmailPassword,
  loginWithGoogle,
  refreshAccessToken,
  registerUser,
  verifyRegistrationToken,
} from "../services/authService.js";
import { resetPassword, sendPasswordResetOtp } from "../services/passwordResetService.js";
import {
  listUserSessions,
  revokeCurrentSession,
  revokeOtherSession,
} from "../services/sessionService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function register(req, res) {
  const result = await registerUser({ ...req.body, req });
  return sendSuccess(res, {
    statusCode: 200,
    message: `Verification email sent to ${result.email}`,
    data: result,
  });
}

export async function verifyEmail(req, res) {
  try {
    await verifyRegistrationToken(req.params.token);
    return res.render("verified", {
      success: true,
      message: "Your email has been verified. Account created successfully!",
    });
  } catch (error) {
    return res.render("verified", {
      success: false,
      message:
        error.code === "USER_EXISTS"
          ? "User already exists or verified!"
          : "Invalid or expired verification link.",
    });
  }
}

export async function signIn(req, res) {
  const data = await loginWithEmailPassword({ ...req.body, req });
  return sendSuccess(res, { statusCode: 200, data });
}

export async function googleSignIn(req, res) {
  const data = await loginWithGoogle({ ...req.body, req });
  return sendSuccess(res, { statusCode: 200, data });
}

export async function refreshToken(req, res) {
  const data = await refreshAccessToken(req.body.sessionId);
  return sendSuccess(res, { statusCode: 200, data });
}

export async function forgotPassword(req, res) {
  await sendPasswordResetOtp(req.body.email);
  return sendSuccess(res, { statusCode: 200, message: "OTP sent" });
}

export async function changePassword(req, res) {
  await resetPassword(req.body);
  return sendSuccess(res, { statusCode: 200, message: "Password updated" });
}

export async function getSessions(req, res) {
  const data = await listUserSessions(req.userId, req.sessionId);
  return sendSuccess(res, { statusCode: 200, data });
}

export async function logoutCurrentSession(req, res) {
  await revokeCurrentSession(req.sessionId, req.userId);
  return sendSuccess(res, {
    statusCode: 200,
    message: "Logged out successfully, session removed",
  });
}

export async function logoutOtherSession(req, res) {
  await revokeOtherSession(req.params.sessionId, req.sessionId, req.userId);
  return sendSuccess(res, {
    statusCode: 200,
    message: "Session revoked successfully",
  });
}
