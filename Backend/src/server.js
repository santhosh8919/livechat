import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

// CORS configuration
const configuredClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://livechat1-o99g.onrender.com",
  "https://livechat-rose.vercel.app",
  ...configuredClientUrls,
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalized = origin.replace(/\/$/, "");
  if (allowedOrigins.has(normalized)) return true;

  try {
    const { protocol, hostname } = new URL(normalized);
    if (protocol !== "https:") return false;

    // Vercel production + preview URLs change on every deploy
    if (hostname === "livechat-rose.vercel.app") return true;
    if (
      hostname.endsWith(".vercel.app") &&
      (hostname.startsWith("livechat-") ||
        hostname.includes("santhosh-mudavaths-projects-9da694fd"))
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

console.log("Allowed CORS origins:", [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", origin);
      return callback(null, false);
    },
    credentials: true, // allow frontend to send cookies
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Only serve static files if frontend/dist exists (for combined deployment)
// For separate frontend/backend deployment, this is skipped
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("/{*splat}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
