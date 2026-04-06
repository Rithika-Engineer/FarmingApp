import cors from "cors";
import express from "express";
import { config } from "./config.js";
import healthRoutes from "./routes/health.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import marketRoutes from "./routes/market.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import contentRoutes from "./routes/content.routes.js";
import profitRoutes from "./routes/profit.routes.js";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Farm Assistant backend is running" });
});

app.use("/api/health", healthRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/profit", profitRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

export default app;
