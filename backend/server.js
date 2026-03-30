import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
const port = process.env.PORT || 5000;
const dbName = process.env.MONGODB_DB_NAME;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

mongoose
  .connect(process.env.MONGODB_URI, dbName ? { dbName } : undefined)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Failed to connect with database: ", err);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
