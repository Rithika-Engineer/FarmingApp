import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Droplets, Wind, Eye, TrendingUp, Volume2, AlertTriangle } from "lucide-react";
import { api } from "../lib/api";

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

const hourlyForecast = [
  { time: "Now", emoji: "☀️", temp: 32 },
  { time: "1PM", emoji: "⛅", temp: 33 },
  { time: "2PM", emoji: "⛅", temp: 34 },
  { time: "3PM", emoji: "🌤️", temp: 33 },
  { time: "4PM", emoji: "🌥️", temp: 31 },
  { time: "5PM", emoji: "🌥️", temp: 30 },
  { time: "6PM", emoji: "🌇", temp: 28 },
];

const weekForecast = [
  { day: "Mon", emoji: "☀️", high: 34, low: 26 },
  { day: "Tue", emoji: "⛅", high: 32, low: 25 },
  { day: "Wed", emoji: "🌧️", high: 28, low: 22 },
  { day: "Thu", emoji: "🌧️", high: 27, low: 21 },
  { day: "Fri", emoji: "⛅", high: 31, low: 24 },
  { day: "Sat", emoji: "☀️", high: 35, low: 27 },
  { day: "Sun", emoji: "☀️", high: 36, low: 28 },
];

export default function Weather() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = t ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(speech);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const w = await api.get(
            `/weather/current?lat=${encodeURIComponent(pos.coords.latitude)}&lon=${encodeURIComponent(pos.coords.longitude)}`
          );
          setData(w);
          setLoading(false);
        } catch {
          setError("Failed to fetch weather");
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      }
    );
  }, []);

  const mainCondition = data?.weather?.[0]?.main || "default";
  const gradient = weatherGradients[mainCondition] || weatherGradients.default;
  const emoji = weatherEmojis[mainCondition] || weatherEmojis.default;

  return (
    <Layout title={t ? "வானிலை" : "Weather"}>
      {loading ? (
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: i === 1 ? 220 : 80, borderRadius: 20 }} />
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: 32, textAlign: "center" }}
        >
          <AlertTriangle size={40} color="#F2994A" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#6B7280", fontSize: 14 }}>{error}</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Retry
          </button>
        </motion.div>
      ) : (
        <div className="inner-screen-container" style={{ padding: "16px 24px 40px" }}>

          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: gradient,
              borderRadius: 28,
              padding: "28px 24px",
              marginBottom: 16,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(47,128,237,0.4)",
            }}
          >
            {/* Background circles */}
            <div style={{ position: "absolute", right: -40, bottom: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", right: 30, bottom: 30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 4 }}>
                📍 {data?.name || "—"}
              </p>
              <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 8 }}>{emoji}</div>
              <h1 style={{ fontSize: 56, fontWeight: 800, color: "#fff", lineHeight: 1, margin: 0 }}>
                {Math.round(data?.main?.temp || 0)}°
              </h1>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 500, textTransform: "capitalize", marginTop: 4 }}>
                {data?.weather?.[0]?.description}
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 4 }}>
                {t ? "உணர்வு வெப்பம்" : "Feels like"} {Math.round(data?.main?.feels_like || 0)}°
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                {[
                  { icon: Droplets, val: `${data?.main?.humidity}%`, label: t ? "ஈரம்" : "Humidity" },
                  { icon: Wind, val: `${data?.wind?.speed} m/s`, label: t ? "காற்று" : "Wind" },
                  { icon: Eye, val: `${((data?.visibility || 0) / 1000).toFixed(1)} km`, label: t ? "தெரிவு" : "Visibility" },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.18)", borderRadius: 14,
                      padding: "8px 6px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 4,
                    }}>
                      <Icon size={14} color="rgba(255,255,255,0.85)" />
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{val}</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Farming Advisory */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              background: data?.weather?.[0]?.main === "Rain" ? "#FFF3CD" : "#EDFBF1",
              borderRadius: 18, padding: "14px 16px",
              marginBottom: 16,
              border: `1px solid ${data?.weather?.[0]?.main === "Rain" ? "#FBBF24" : "#A7F3D0"}`,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}
          >
            <div style={{ fontSize: 20 }}>
              {data?.weather?.[0]?.main === "Rain" ? "⚠️" : "✅"}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                {t ? "விவசாய ஆலோசனை" : "Farming Advisory"}
              </p>
              <p style={{ fontSize: 12, color: "#374151" }}>
                {data?.weather?.[0]?.main === "Rain"
                  ? (t ? "இன்று தெளிப்பு செய்ய வேண்டாம் — மழை வாய்ப்பு உள்ளது" : "Avoid spraying today — rain expected")
                  : (data?.main?.temp > 32
                    ? (t ? "அதிக வெப்பம் — அதிகமாக நீர்ப்பாய்ச்சி செய்யவும்" : "High heat — Increase irrigation")
                    : (t ? "சாகுபடி பணிக்கு நல்ல வானிலை" : "Good weather for field work")
                  )
                }
              </p>
            </div>
          </motion.div>

          {/* Hourly Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              background: "#fff", borderRadius: 20,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t ? "இன்றைய முன்னறிவிப்பு" : "Hourly Forecast"}
            </p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="scrollbar-hide">
              {hourlyForecast.map(({ time, emoji, temp }, i) => (
                <div key={i} style={{
                  flexShrink: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 6, padding: "10px 14px",
                  borderRadius: 16, background: i === 0 ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#F7F9FC",
                }}>
                  <span style={{ fontSize: 10, color: i === 0 ? "rgba(255,255,255,0.8)" : "#6B7280", fontWeight: 600 }}>{time}</span>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#fff" : "#111827" }}>{temp}°</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 7-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{
              background: "#fff", borderRadius: 20,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t ? "7 நாள் முன்னறிவிப்பு" : "7-Day Forecast"}
            </p>
            {weekForecast.map(({ day, emoji, high, low }, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < weekForecast.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", width: 40 }}>{day}</span>
                <span style={{ fontSize: 22, margin: "0 12px 0 8px" }}>{emoji}</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    flex: 1, height: 4, borderRadius: 4,
                    background: `linear-gradient(90deg, #2F80ED, #27AE60)`,
                  }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{high}°</span>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>{low}°</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Voice Button */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => speak(
              t
                ? `இன்றைய வெப்பநிலை ${Math.round(data?.main?.temp || 0)} டிகிரி, ஈரப்பதம் ${data?.main?.humidity} சதவீதம்`
                : `Today's temperature is ${Math.round(data?.main?.temp || 0)} degrees and humidity is ${data?.main?.humidity} percent`
            )}
            style={{
              width: "100%", padding: "14px 20px",
              borderRadius: 16, border: "none",
              background: "linear-gradient(135deg, #2F80ED, #27AE60)",
              color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(47,128,237,0.3)",
              marginBottom: 8,
            }}
          >
            <Volume2 size={16} />
            {t ? "குரலில் கேட்க" : "Play Voice Report"}
          </motion.button>

        </div>
      )}
    </Layout>
  );
}
