import { Router } from "express";
import { config } from "../config.js";

const router = Router();

/**
 * ✅ Helper function for OpenWeather API
 */
async function fetchWeatherData(endpoint, lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/${endpoint}?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(
    lon
  )}&appid=${config.openWeatherApiKey}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.text();
    const error = new Error("Weather provider error");
    error.status = response.status;
    error.details = details;
    throw error;
  }

  return await response.json();
}

/**
 * 🌤 Current Weather API
 * GET /api/weather/current?lat=11.12&lon=78.65
 */
router.get("/current", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: "lat and lon are required",
      });
    }

    if (!config.openWeatherApiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENWEATHER_API_KEY is not configured",
      });
    }

    const data = await fetchWeatherData("weather", lat, lon);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("🌤 Current weather error:", error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to fetch current weather",
      details: error.details || null,
    });
  }
});

/**
 * 🌦 Forecast Weather API
 * GET /api/weather/forecast?lat=11.12&lon=78.65
 */
router.get("/forecast", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: "lat and lon are required",
      });
    }

    if (!config.openWeatherApiKey) {
      return res.status(500).json({
        success: false,
        error: "OPENWEATHER_API_KEY is not configured",
      });
    }

    const data = await fetchWeatherData("forecast", lat, lon);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("🌦 Forecast weather error:", error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Failed to fetch forecast weather",
      details: error.details || null,
    });
  }
});

export default router;