import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { assertRequiredConfig, config } from "./config/env.js";

const missingConfig = assertRequiredConfig();
if (missingConfig.length) {
  console.warn(`Missing recommended environment variables: ${missingConfig.join(", ")}`);
}

const app = createApp();

connectDatabase()
  .then(() => {
    console.log("Connected to database");
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
