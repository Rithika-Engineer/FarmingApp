import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(globalThis.process?.env?.PORT) || 4000,
  corsOrigin: globalThis.process?.env?.CORS_ORIGIN || "http://localhost:5173",
  openWeatherApiKey: globalThis.process?.env?.OPENWEATHER_API_KEY || "",
};
