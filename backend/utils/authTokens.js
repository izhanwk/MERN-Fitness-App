import jwt from "jsonwebtoken";

const secretkey = process.env.SECRET_KEY;
const refreshkey = process.env.REFRESH;

export const createAccessToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secretkey,
    { expiresIn: "5m" },
  );

export const createRefreshToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    refreshkey,
    { expiresIn: "7d" },
  );
