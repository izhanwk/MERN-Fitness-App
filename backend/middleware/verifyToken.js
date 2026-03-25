import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Sessions from "../../Model/Sessions.js";
import { getClientIp } from "../utils/getClientIp.js";

const secretkey = process.env.SECRET_KEY;

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const sessionId = req.headers["x-session-id"];

  if (!token) {
    return res.status(403).json({ message: "No Token, Access denied" });
  }

  if (!sessionId) {
    return res.status(403).json({ message: "No session, Access denied" });
  }

  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    return res.status(403).json({ message: "Invalid or expired session" });
  }

  try {
    const decodedToken = jwt.verify(token, secretkey);

    req.user = decodedToken;
    req.email = decodedToken.email;
    req.userId = decodedToken.userId;
    req.sessionId = sessionId;

    const ip = getClientIp(req);
    console.log("IP of device : ", ip);

    const session = await Sessions.findOne({
      _id: sessionId,
      userId: decodedToken.userId,
    });

    if (!session) {
      return res.status(403).json({ message: "Invalid or expired session" });
    }

    session.lastActive = new Date();
    session.currentDevice = true;
    await session.save();

    await Sessions.updateMany(
      { userId: decodedToken.userId, _id: { $ne: sessionId } },
      { $set: { currentDevice: false } },
    );

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
