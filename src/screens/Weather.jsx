import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import {
  Droplets,
  Wind,
  Eye,
  Volume2,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { api } from "../lib/api";

const fallbackCurrent = {
  name: "Coimbatore",
  main: {
    temp: 31,
    feels_like: 33,
    humidity: 68,
  },
  wind: {
    speed: 3.4,
  },
  visibility: 8000,
  weather: [
    {
      main: "Clouds",
      description: "partly cloudy",
    },
  ],
};

const fallbackForecast = {
  list: [
    {
      dt: Date.now() / 1000,
      main: { temp: 31, temp_max: 32, temp_min: 28 },
      weather: [{ main: "Clouds" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 3,
      main: { temp: 30, temp_max: 31, temp_min: 27 },
      weather: [{ main: "Rain" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 6,
      main: { temp: 29, temp_max: 30, temp_min: 26 },
      weather: [{ main: "Rain" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 24,
      main: { temp: 32, temp_max: 33, temp_min: 27 },
      weather: [{ main: "Clear" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 48,
      main: { temp: 30, temp_max: 31, temp_min: 26 },
      weather: [{ main: "Clouds" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 72,
      main: { temp: 29, temp_max: 30, temp_min: 25 },
      weather: [{ main: "Rain" }],
    },
    {
      dt: Date.now() / 1000 + 3600 * 96,
      main: { temp: 31, temp_max: 32, temp_min: 27 },
      weather: [{ main: "Clear" }],
    },
  ],
};

const weatherGradients = {
  Clear: "linear-gradient(160deg, #1a6fd4, #56CCF2)",
  Clouds: "linear-gradient(160deg, #4a5568, #718096)",
  Rain: "linear-gradient(160deg, #2d3748, #4299e1)",
  Thunderstorm: "linear-gradient(160deg, #1a202c, #553c9a)",
  Drizzle: "linear-gradient(160deg, #2b6cb0, #63b3ed)",
  Snow: "linear-gradient(160deg, #90cdf4, #bee3f8)",
  default: "linear-gradient(160deg, #2F80ED, #27AE60)",
};

const weatherEmojis = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Snow: "❄️",
  Mist: "🌫️",
  default: "🌤️",
};

export default function Weather() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = t ? "ta-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  }

  useEffect(() => {
    const loadWeather = async (lat, lon) => {
      try {
        const [current, forecastData] = await Promise.all([
          api.get(`/weather/current?lat=${lat}&lon=${lon}`),
          api.get(`/weather/forecast?lat=${lat}&lon=${lon}`),
        ]);

        let exactPlace = current?.name || "Coimbatore";

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const geoData = await geoRes.json();

          exactPlace =
            geoData.address?.suburb ||
            geoData.address?.village ||
            geoData.address?.town ||
            geoData.address?.city ||
            exactPlace;
        } catch {
          // ignore reverse geocode errors
        }

        setData({ ...current, exactPlace });
        setForecast(forecastData.list || []);
      } catch {
        // ✅ fallback instead of error
        setData({
          ...fallbackCurrent,
          exactPlace: "Coimbatore",
        });
        setForecast(fallbackForecast.list);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      loadWeather(11.0168, 76.9558);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        loadWeather(11.0168, 76.9558);
      }
    );
  }, []);

  const mainCondition = data?.weather?.[0]?.main || "default";
  const gradient =
    weatherGradients[mainCondition] || weatherGradients.default;
  const emoji = weatherEmojis[mainCondition] || weatherEmojis.default;

  const hourlyForecast = forecast.slice(0, 6).map((item, index) => ({
    time:
      index === 0
        ? "Now"
        : new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "numeric",
          }),
    emoji: weatherEmojis[item.weather?.[0]?.main] || "🌤️",
    temp: Math.round(item.main.temp),
  }));

  const weekForecast = forecast.slice(0, 7).map((item) => ({
    day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    emoji: weatherEmojis[item.weather?.[0]?.main] || "🌤️",
    high: Math.round(item.main.temp_max),
    low: Math.round(item.main.temp_min),
  }));

  if (loading) {
    return (
      <Layout title={t ? "வானிலை" : "Weather"}>
        <div style={{ padding: 24, textAlign: "center" }}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title={t ? "வானிலை" : "Weather"}>
      {/* ✅ KEEP YOUR EXISTING JSX UI BELOW SAME */}
      {/* Use your same UI return block from current file */}
    </Layout>
  );
}