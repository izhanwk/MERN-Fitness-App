import "dotenv/config";
import { defineConfig } from "@playwright/test";

const backendPort = process.env.E2E_BACKEND_PORT || "5001";
const frontendPort = process.env.E2E_FRONTEND_PORT || "4173";
const baseURL = `http://localhost:${frontendPort}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL,
    headless: true,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm.cmd run start:server",
      url: `http://localhost:${backendPort}`,
      reuseExistingServer: false,
      env: {
        ...process.env,
        PORT: backendPort,
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "fittrack_e2e",
        FRONTEND_ORIGIN: baseURL,
      },
    },
    {
      command: `npm.cmd run dev -- --host localhost --port ${frontendPort}`,
      url: baseURL,
      reuseExistingServer: false,
      env: {
        ...process.env,
        VITE_API_URL: `http://localhost:${backendPort}`,
      },
    },
  ],
});
