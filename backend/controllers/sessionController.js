import mongoose from "mongoose";
import Sessions from "../../Model/Sessions.js";

export const getSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const currentSessionId = req.sessionId;

    const sessions = await Sessions.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedSessions = sessions.map((session) => {
      const { token, __v, ...rest } = session;
      const id = session._id.toString();
      return {
        ...rest,
        _id: id,
        userId: session.userId.toString(),
        currentDevice: !!currentSessionId && currentSessionId.toString() === id,
      };
    });

    return res.status(200).json(sanitizedSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ message: "Error fetching sessions" });
  }
};

export const logout = async (req, res) => {
  try {
    await Sessions.deleteOne({ _id: req.sessionId, userId: req.userId });
    return res
      .status(200)
      .json({ message: "Logged out successfully, session removed" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutSession = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("Deleting session:", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session identifier" });
    }

    if (id === req.sessionId) {
      return res.status(400).json({ message: "Cannot revoke active session" });
    }

    const session = await Sessions.findOne({ _id: id, userId: req.userId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await session.deleteOne();

    return res.status(200).json({ message: "Killed the session successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return res.status(500).json({ message: "Server error deleting session" });
  }
};
