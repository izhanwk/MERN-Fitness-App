import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import Data from "../Model/Registerdata.js";
import Foods from "../Model/Foods.js";

const app = express();
// app.use(express.json());
const port = process.env.PORT || 3000;
let primaryEmail = "";
let secretkey = process.env.SECRET_KEY;
let refreshkey = process.env.REFRESH;

app.use(
  cors({
    origin: "https://mern-fitness-app-one.vercel.app", // Your Vercel frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Failed to connect with database: ", err);
  });

app.use(bodyParser.json());
// app.use(cors());

// const deletFoodz = async () => {
//   await Foods.deleteMany();
// };

// deletFoodz();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No Token, Access denied" });
  } else {
    jwt.verify(token, secretkey, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      } else {
        req.user = decodedToken;
        req.email = decodedToken.email;
        next();
      }
    });
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
      console.log("User found");

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
      console.log("User found");
      user.array = array;

      // Ensure save completes before moving on
      await user.save();

      console.log("Data saved successfully");
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

app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Data.findOne({ email })
    .then((user) => {
      try {
        if (!user) {
          return res
            .status(401)
            .json({ message: "The information you entered is not correct" });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
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
      console.log("User found");
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

app.post("/register", (req, res) => {
  primaryEmail = req.body.email;
  Data.findOne({ email: primaryEmail }).then((exist) => {
    if (exist) {
      return res.status(503).json({ message: "User already exists" });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hashpassword) => {
          const newData = new Data({
            email: req.body.email,
            password: hashpassword,
          });
          newData.save();
        })
        .then(() => {
          res.status(200).send("Data sent to DB");
        })
        .catch((err) => {
          res.status(400).send("Data couldn't send to DB", err);
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
