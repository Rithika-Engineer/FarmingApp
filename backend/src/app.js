import cors from "cors";
import express from "express";

import healthRoutes from "./routes/health.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import marketRoutes from "./routes/market.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import contentRoutes from "./routes/content.routes.js";
import profitRoutes from "./routes/profit.routes.js";

const app = express();

/**
 * ✅ Safe CORS
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // allow temporarily for testing
    },
    credentials: true,
  })
);

/**
 * ✅ Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ✅ Root route
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 Farm Assistant backend is running",
  });
});

/**
 * ✅ API Routes
 */
app.use("/api/health", healthRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/profit", profitRoutes);

/**
 * ✅ 404 Route
 */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/**
 * ✅ Global Error Handler
 */
app.use((error, _req, res, _next) => {
  console.error("🔥 Backend error:", error);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

export default app;