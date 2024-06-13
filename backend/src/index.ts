import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import AuthRoutes from "./routes/auth.route";
import MessageRoutes from "./routes/message.route";

import dotenv from "dotenv";
import { app, server } from "./socket/socket";

dotenv.config();

const PORT = process.env.VITE_PORT;

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

if (process.env.NODE_ENV !== "development") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
