import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendPort = process.env.E2E_BACKEND_PORT || process.env.BACKEND_PORT || "5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "..",
  server: {
    host: "0.0.0.0", // Makes the server accessible externally
    port: 5173, // Ensure the port is correct
    proxy: {
      "/api": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    hookTimeout: 180000,
  },
});
