import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartfarming",
};