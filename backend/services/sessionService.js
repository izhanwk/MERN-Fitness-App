import Sessions from "../../Model/Sessions.js";
import useragent from "useragent";
import { getClientIp } from "../utils/getClientIp.js";

export const createSession = async ({ user, req, refreshToken }) => {
  const agent = useragent.parse(req.headers["user-agent"]);
  const device = `${agent.os.toString()} ${agent.toAgent()}`;
  const ip = getClientIp(req);

  const session = new Sessions({
    userId: user._id,
    device,
    ip,
    token: refreshToken,
    createdAt: new Date(),
    lastActive: new Date(),
    currentDevice: true,
  });

  await session.save();
  return session;
};
