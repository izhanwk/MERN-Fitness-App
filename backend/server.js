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
import useragent from "useragent";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
// set view engine to ejs
app.set("view engine", "ejs");
// set views folder
app.set("views", path.join(__dirname, "views"));
const port = process.env.PORT || 3000;
let primaryEmail = "";
let secretkey = "izhanbhaikasecret";
let refreshkey = "oneandonlyIzhankirefreshsecretkey";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

app.use(cors());

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

  if (!token) {
    return res.status(403).json({ message: "No Token, Access denied" });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, secretkey);

    // Attach decoded info to request
    req.user = decodedToken;
    req.email = decodedToken.email;
    req.userId = decodedToken.userId;

    // Update lastActive for this session
    const session = await Sessions.findOne({ userId: req.userId });

    if (!session) {
      console.log(token);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    await Sessions.updateOne({ token }, { $set: { lastActive: new Date() } });

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

app.post("/refresh-token", async (req, res) => {
  const refresh = req.body.refreshtoken;
  console.log("token : ", refresh);
  if (!refresh) {
    return res.status(401).json({ message: "No refresh token provided" });
  } else {
    jwt.verify(refresh, refreshkey, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      } else {
        const user = await Data.findOne({ email: decoded.email });
        if (!user || user.refreshtoken !== refresh) {
          return res.status(403).json({ message: "Invalid refresh token" });
        } else {
          let token = jwt.sign(
            {
              userId: user.id,
              email: user.email,
            },
            secretkey,
            { expiresIn: "5m" }
          );
          // console.log("worked");
          return res.status(200).json({ token });
        }
      }
    });
  }
});

app.get("/getdata", verifyToken, async (req, res) => {
  try {
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

                user.refreshtoken = refreshToken;
                user.save();
                const agent = useragent.parse(req.headers["user-agent"]);
                const device = `${agent.os.toString()} ${agent.toAgent()}`;

                if (!user.height || !user.weight || !user.activity) {
                  return res.status(302).json({
                    success: true,
                    data: {
                      userId: user.id,
                      email: user.email,
                      token: token,
                      refresh: refreshToken,
                    },
                  });
                }
                const existing = await Sessions.findOne({
                  userId: user._id,
                  device: device,
                  ip: req.ip,
                });
                if (existing) {
                  return res.status(200).json({
                    success: true,
                    data: {
                      userId: user.id,
                      email: user.email,
                      token: token,
                      refresh: refreshToken,
                    },
                  });
                }
                await Sessions.create({
                  userId: user._id,
                  device,
                  ip: req.ip,
                  token,
                  createdAt: new Date(),
                  lastActive: new Date(),
                });
                return res.status(200).json({
                  success: true,
                  data: {
                    userId: user.id,
                    email: user.email,
                    token: token,
                    refresh: refreshToken,
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

app.post("/data", verifyToken, async (req, res) => {
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

    const url = `http://localhost:3000/verify/${token}`;

    // send verification email
    await transporter.sendMail({
      from: `"Fitness App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<h3>Click below to verify your email:</h3>
             <a href="${url}">${url}</a>`,
    });

    res.status(200).send("Verification email sent! Please check your inbox.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Registration failed.");
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
  const userId = req.query.id;

  const sessions = await Sessions.find({ userId });
  sessions.forEach((session) => {
    if (session.ip === req.ip) {
      session.currentDevice = true;
    }
  });
  console.log(sessions);
  res.status(200).json(sessions);
});

app.get("/logout", verifyToken, async (req, res) => {
  try {
    const agent = useragent.parse(req.headers["user-agent"]);
    const device = `${agent.os.toString()} ${agent.toAgent()}`;
    // console.log(req.email);
    const user = await Data.findOne({ email: req.email });
    // Delete the session linked to this token
    await Sessions.deleteOne({
      userId: user.id,
      ip: req.ip,
      device: device,
    });

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

    const deleted = await Sessions.deleteOne({ _id: id });

    if (deleted.deletedCount > 0) {
      return res
        .status(200)
        .json({ message: "Killed the session successfully" });
    } else {
      return res.status(404).json({ message: "Session not found" });
    }
  } catch (error) {
    console.error("Error deleting session:", error);
    return res.status(500).json({ message: "Server error deleting session" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
