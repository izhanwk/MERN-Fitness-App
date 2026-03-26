import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Data from "../../Model/Registerdata.js";
import Sessions from "../../Model/Sessions.js";
import { sendEmail } from "../emailSender.js";
import { OAuth2Client } from "google-auth-library";
import { buildAuthResponsePayload } from "../utils/authPayload.js";
import { createSession } from "../services/sessionService.js";
import {
  isStrongEnoughPassword,
  isValidEmail,
  normalizeEmail,
} from "../utils/validators.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/authTokens.js";

const refreshkey = process.env.REFRESH;
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

export const refreshToken = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(401).json({ message: "No session provided" });
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(403).json({ message: "Invalid or expired session" });
  }

  try {
    const session = await Sessions.findById(sessionId);

    if (!session) {
      return res.status(403).json({ message: "Invalid or expired session" });
    }

    const decoded = jwt.verify(session.token, refreshkey);

    if (session.userId.toString() !== decoded.userId) {
      await Sessions.deleteOne({ _id: sessionId });
      return res.status(403).json({ message: "Invalid or expired session" });
    }

    const user =
      (await Data.findById(decoded.userId)) ||
      (await Data.findOne({ email: decoded.email }));

    if (!user) {
      await Sessions.deleteOne({ _id: sessionId });
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const token = createAccessToken(user);

    session.lastActive = new Date();
    await session.save();

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Session refresh failed:", err);

    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      try {
        await Sessions.deleteOne({ _id: sessionId });
      } catch (cleanupError) {
        console.error("Error cleaning up invalid session:", cleanupError);
      }

      return res.status(403).json({ message: "Invalid or expired token" });
    }

    return res
      .status(500)
      .json({ message: "Server error while validating session" });
  }
};

export const signIn = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!isValidEmail(email) || !isStrongEnoughPassword(password)) {
      return res
        .status(401)
        .json({ message: "The information you entered is not correct" });
    }

    const user = await Data.findOne({ email });

    if (!user || !user.password) {
      return res
        .status(401)
        .json({ message: "The information you entered is not correct" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "The password you entered is incorrect" });
    }

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    console.log("Session not exist");
    const newSession = await createSession({
      user,
      req,
      refreshToken,
    });
    const sessionId = newSession._id.toString();
    const payload = buildAuthResponsePayload({
      user,
      token,
      refreshToken,
      sessionId,
    });

    if (payload.needsOnboarding) {
      return res.status(302).json(payload);
    }

    return res.status(200).json(payload);
  } catch (err) {
    console.error("Sign-in error:", err);
    return res.status(500).json({ message: "An error occurred", err });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    if (!googleClient) {
      return res
        .status(503)
        .json({ message: "Google sign-in is not configured" });
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const googleId = payload?.sub;
    const name = payload?.name;
    const picture = payload?.picture;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Unable to verify Google account" });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Unable to verify Google account" });
    }

    let user = await Data.findOne({ email: normalizedEmail });

    if (!user) {
      user = new Data({
        email: normalizedEmail,
        password: null,
        verified: true,
        name: name || normalizedEmail,
        googleId,
        authProvider: "google",
        avatar: picture,
      });
    } else {
      user.googleId = user.googleId || googleId;
      user.authProvider = "google";
      if (!user.verified) {
        user.verified = true;
      }
      if (!user.name && name) {
        user.name = name;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
    }

    await user.save();

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const newSession = await createSession({ user, req, refreshToken });
    const sessionId = newSession._id.toString();

    const responsePayload = buildAuthResponsePayload({
      user,
      token,
      refreshToken,
      sessionId,
    });

    if (responsePayload.needsOnboarding) {
      return res.status(302).json(responsePayload);
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return res.status(500).json({ message: "Failed to sign in with Google" });
  }
};

export const register = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!isValidEmail(email) || !isStrongEnoughPassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const exist = await Data.findOne({ email });
    if (exist) {
      return res.status(503).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { email, password: hashpassword },
      process.env.JWT_VERIFY,
      { expiresIn: "1h" },
    );

    const baseUrl =
      process.env.SERVER_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/verify/${token}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<h3>Click below to verify your email:</h3>
             <a href="${url}">Click here to verify</a>`,
    });
    res.status(200).send(email);
  } catch (err) {
    console.error("Error sending verification email : ", err);
    res.status(400).send("Registration failed : ", err);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);

    const exist = await Data.findOne({ email: decoded.email });
    if (exist) {
      return res.render("verified", {
        success: false,
        message: "User already exists or verified!",
      });
    }

    const newUser = new Data({
      email: decoded.email,
      password: decoded.password,
      verified: true,
    });
    await newUser.save();

    res.render("verified", {
      success: true,
      message: "Your email has been verified. Account created successfully!",
    });
  } catch (err) {
    console.error(err);
    res.render("verified", {
      success: false,
      message: "Invalid or expired verification link.",
    });
  }
};
