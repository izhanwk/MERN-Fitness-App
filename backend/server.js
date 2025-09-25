import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import Data from "../Model/Registerdata.js";
import Foods from "../Model/Foods.js";
import nodemailer from "nodemailer";
import Sessions from "../Model/Sessions.js";
import Otp from "../Model/Otp.js";
import useragent from "useragent";
import { sendGmail } from "./gmailSender.js";
import { OAuth2Client } from "google-auth-library";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
// set view engine to ejs
app.set("view engine", "ejs");
// set views folder
app.set("views", path.join(__dirname, "views"));
const port = process.env.PORT || 5000;
let primaryEmail = "";
let secretkey = process.env.SECRET_KEY;
let refreshkey = process.env.REFRESH;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const allowedOrigins = [
  "http://localhost:5173", // local React dev
  "https://mern-fitness-app-one.vercel.app", // your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Session-Id",
      "ngrok-skip-browser-warning",
    ],
    credentials: true, // only if you use cookies or auth headers
  })
);

const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;

mongoose
  .connect(
    "mongodb+srv://izhanwaseem6:0d1P5WuAsnyKy4no@cluster0.j2hzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Failed to connect with database: ", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const verifyToken = async (req, res, next) => {
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
      { $set: { currentDevice: false } }
    );

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.post("/refresh-token", async (req, res) => {
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

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secretkey,
      { expiresIn: "5m" }
    );

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
});

app.get("/getdata", verifyToken, async (req, res) => {
  try {
    console.log("Hite");
    const email = req.email;
    const user = await Data.findOne({ email: email });
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro while fetching data ERROR: ", err });
  }
});

app.get("/store", verifyToken, async (req, res) => {
  try {
    const email = req.email;
    // const array = req.body.array;
    // console.log(array);

    // Make sure we correctly await the findOne method
    const user = await Data.findOne({ email });

    if (user) {
      // console.log("User found");

      // Ensure save completes before moving on
      return res.status(200).json(user.array);
    } else {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error storing data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/store", verifyToken, async (req, res) => {
  try {
    const email = req.email;
    const array = req.body.array;
    console.log(array);

    // Make sure we correctly await the findOne method
    const user = await Data.findOne({ email });

    if (user) {
      // console.log("User found");
      user.array = array;

      // Ensure save completes before moving on
      await user.save();

      // console.log("Data saved successfully");
      return res.status(200).json(array);
    } else {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error storing data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getfood", verifyToken, async (req, res) => {
  try {
    const foodItems = await Foods.find();
    return res.status(200).json(foodItems);
  } catch (err) {
    return res.status(500).json({ message: "Error occured: ", err });
  }
});

app.get("/getfood2", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default page = 1
  try {
    const totalLength = await Foods.countDocuments({});
    const limit = 15;
    const skip = limit * page;
    const products = await Foods.find({}).skip(skip).limit(limit);
    const response = products.map((product) => ({
      ...product.toObject(),
      showMore: totalLength > skip + products.length,
    }));
    console.log("Our response : ", response);
    console.log("Response length : ", response.length);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(200).json({ message: "An error occured" });
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Data.findOne({ email: email })
    .then((user) => {
      try {
        if (!user) {
          return res
            .status(401)
            .json({ message: "The information you entered is not correct" });
        } else {
          bcrypt.compare(password, user.password, async (err, isMatch) => {
            if (err) {
              return res.status(500).send({
                message: "An error occurred during password comparison ERROR: ",
                err,
              });
            }
            if (isMatch) {
              try {
                let token = jwt.sign(
                  {
                    userId: user.id,
                    email: user.email,
                  },
                  secretkey,
                  { expiresIn: "5m" }
                );
                let refreshToken = jwt.sign(
                  {
                    userId: user.id,
                    email: user.email,
                  },
                  refreshkey,
                  { expiresIn: "7d" }
                );

                // Don't overwrite user.refreshtoken - store per session instead
                const agent = useragent.parse(req.headers["user-agent"]);
                const device = `${agent.os.toString()} ${agent.toAgent()}`;
                const ip = getClientIp(req);

                if (!user.height || !user.weight || !user.activity) {
                  // const existing = await Sessions.findOne({
                  //   userId: user._id,
                  //   device: device,
                  //   ip,
                  // });
                  // if (existing) {
                  //   console.log("Session already exist");
                  //   return res.status(302).json({
                  //     success: true,
                  //     data: {
                  //       userId: user.id,
                  //       email: user.email,
                  //       token: token,
                  //       refresh: refreshToken,
                  //     },
                  //   });
                  // }
                  console.log("Session not exist");
                  const newSession = new Sessions({
                    userId: user._id,
                    device,
                    ip,
                    token: refreshToken,
                    createdAt: new Date(),
                    lastActive: new Date(),
                    currentDevice: true,
                  });
                  await newSession.save();
                  const sessionId = newSession._id.toString();
                  return res.status(302).json({
                    success: true,
                    data: {
                      userId: user.id,
                      email: user.email,
                      token: token,
                      refresh: refreshToken,
                      sessionId,
                    },
                  });
                }
                // const existing = await Sessions.findOne({
                //   userId: user._id,
                //   device: device,
                //   ip,
                // });
                // if (existing) {
                //   console.log("Session already exist");
                //   return res.status(200).json({
                //     success: true,
                //     data: {
                //       userId: user.id,
                //       email: user.email,
                //       token: token,
                //       refresh: refreshToken,
                //     },
                //   });
                // }
                console.log("Session not exist");
                const newSession = new Sessions({
                  userId: user._id,
                  device,
                  ip,
                  token: refreshToken,
                  createdAt: new Date(),
                  lastActive: new Date(),
                  currentDevice: true,
                });
                await newSession.save();
                const sessionId = newSession._id.toString();
                return res.status(200).json({
                  success: true,
                  data: {
                    userId: user.id,
                    email: user.email,
                    token: token,
                    refresh: refreshToken,
                    sessionId,
                  },
                });
              } catch (JWSerr) {
                return res.status(500).json({
                  message: "Error occured while generation JWS Token ERROR: ",
                  JWSerr,
                });
              }
            } else {
              return res
                .status(401)
                .send({ message: "The password you entered is incorrect" });
            }
          });
        }
      } catch {
        return res.status(600).json({ message: "A Problem occured" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "An error occurred", err });
    });
});

app.post("/signin/google", async (req, res) => {
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

    let user = await Data.findOne({ email });

    if (!user) {
      user = new Data({
        email,
        password: null,
        verified: true,
        name: name || email,
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

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secretkey,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      refreshkey,
      { expiresIn: "7d" }
    );

    const agent = useragent.parse(req.headers["user-agent"]);
    const device = `${agent.os.toString()} ${agent.toAgent()}`;
    const ip = getClientIp(req);

    const newSession = new Sessions({
      userId: user._id,
      device,
      ip,
      token: refreshToken,
      createdAt: new Date(),
      lastActive: new Date(),
      currentDevice: true,
    });
    await newSession.save();
    const sessionId = newSession._id.toString();

    const responsePayload = {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        token,
        refresh: refreshToken,
        sessionId,
      },
    };

    if (!user.height || !user.weight || !user.activity) {
      return res.status(302).json(responsePayload);
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return res.status(500).json({ message: "Failed to sign in with Google" });
  }
});

app.post("/data", verifyToken, async (req, res) => {
  console.log("Data hit");
  const email = req.user.email; // from JWT
  const { name, date, gender, weight, weightScale, height, lengthScale } =
    req.body;

  // return res.status(200).json({ email });
  try {
    const user = await Data.findOne({ email: email });

    if (user) {
      // console.log("User found");
      user.name = name;
      user.date = date;
      user.gender = gender;
      user.weight = weight;
      user.weightScale = weightScale;
      user.height = height;
      user.lengthScale = lengthScale;

      await user.save();
      return res.status(200).json({ message: "Data saved in DB collection" });
    } else {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    return res.status(500).json({ message: "Unexpected error occurred", err });
  }
});

app.post("/mode", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await Data.findOne({ email: email });
    if (user) {
      user.mode = req.body.mode;
      await user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      console.log("User not found");
      return res.status(400).json({ message: "Could not save in DB" });
    }
  } catch (err) {
    return res.status(402).json({ message: "Error occurred: ", err });
  }
});

app.post("/activity", verifyToken, async (req, res) => {
  const email = req.user.email;
  const user = await Data.findOne({ email: email });
  if (user) {
    if (user) {
      user.activity = req.body.activity;
      user.profileComplete = "Complete";
      user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      console.log("User not found");
      return res.status(400).json({ message: "Could not save in DB" });
    }
  } else {
    return res.status(402).json({ message: "Error occured: ", err });
  }
});

app.post("/goals", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await Data.findOne({ email: email });
    if (user) {
      user.goal = req.body.goal;
      await user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      console.log("User not found");
      return res.status(400).json({ message: "Could not save in DB" });
    }
  } catch (err) {
    return res.status(402).json({ message: "Error occurred: ", err });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const exist = await Data.findOne({ email });
    if (exist) {
      return res.status(503).json({ message: "User already exists" });
    }

    // hash password but don’t store yet
    const hashpassword = await bcrypt.hash(password, 10);

    // create JWT with email + hashed password
    const token = jwt.sign(
      { email, password: hashpassword },
      process.env.JWT_VERIFY,
      { expiresIn: "1h" }
    );

    const baseUrl =
      process.env.SERVER_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/verify/${token}`;
    console.log(url);
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    // send verification email
    // await transporter.sendMail({
    //   from: `"Fitness App" <${process.env.EMAIL_USER}>`,
    //   to: email,
    //   subject: "Verify your email",
    //   html: `<h3>Click below to verify your email:</h3>
    //          <a href="${url}">${url}</a>`,
    // });

    await sendGmail({
      to: email,
      subject: "Verify your email",
      html: `<h3>Click below to verify your email:</h3>
             <a href="${url}">${url}</a>`,
    });
    res.status(200).send(email);
  } catch (err) {
    console.error("Error sending verification email : ", err);
    res.status(400).send("Registration failed : ", err);
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY);

    // check again to avoid duplicate
    const exist = await Data.findOne({ email: decoded.email });
    if (exist) {
      return res.render("verified", {
        success: false,
        message: "User already exists or verified!",
      });
    }

    // now save user
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
});

app.get("/sessions", verifyToken, async (req, res) => {
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
});

app.get("/logout", verifyToken, async (req, res) => {
  try {
    await Sessions.deleteOne({ _id: req.sessionId, userId: req.userId });
    return res
      .status(200)
      .json({ message: "Logged out successfully, session removed" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.delete("/logoutsession", verifyToken, async (req, res) => {
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
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });
    // await transporter.sendMail({
    //   from: `"Fitness App" <${process.env.EMAIL_USER}>`,
    //   to: email,
    //   subject: "Password reset OTP",
    //   html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    // });
    await sendGmail({
      to: email,
      subject: "Password reset OTP",
      html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    });
    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error("OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/checkData", verifyToken, async (req, res) => {
  const email = req.email;
  try {
    const user = await Data.findOne({ email: email });
    if (user.profileComplete === "Complete") {
      return res.status(200).json({ message: "Completed" });
    } else {
      return res.status(210).json({ message: "Not completed" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Not Completed" });
  }
});
app.post("/change-password", async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await Otp.deleteMany({ email });
    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/editdata", verifyToken, async (req, res) => {
  const email = req.email;
  const user = await Data.findOne({ email: email });
  if (user) {
    delete user.password;
    delete user.refreshtoken;
    return res.status(200).json(user);
  }
});

app.put("/editdata", verifyToken, async (req, res) => {
  try {
    // Only allow updates to these fields
    const allowed = [
      "name",
      "date",
      "gender",
      "weight",
      "weightScale",
      "height",
      "lengthScale",
      "goal",
      "mode",
      "activity",
      // if you want to allow `array`, add it here:
      // "array",
      // do NOT allow password/refreshtoken/verified updates here
      // do NOT allow email changes via this route unless you confirm ownership again
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Coerce types to match schema
    if (updates.date) updates.date = new Date(updates.date);
    if (updates.weight != null) updates.weight = Number(updates.weight);
    if (updates.height != null) updates.height = Number(updates.height);
    if (updates.activity != null) updates.activity = Number(updates.activity);

    const user = await Data.findOneAndUpdate(
      { email: req.email },
      { $set: updates },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
