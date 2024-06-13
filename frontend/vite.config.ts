import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

const envDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(envDir, ".env") });

const serverPort = process.env.VITE_PORT;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${serverPort}`,
      },
    },
  },
  envDir: envDir,
});
