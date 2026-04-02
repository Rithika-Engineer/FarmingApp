import { Router } from "express";
import { config } from "../config.js";

const router = Router();

router.get("/current", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon are required" });
  }

  if (!config.openWeatherApiKey) {
    return res.status(500).json({ error: "OPENWEATHER_API_KEY is not configured" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&appid=${config.openWeatherApiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      const details = await response.text();
      return res.status(response.status).json({ error: "Weather provider error", details });
    }

    const data = await response.json();
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Failed to fetch weather" });
  }
});

export default router;
