import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sprout, Heart } from "lucide-react";
import { api } from "../lib/api";

const fallbackQuotes = [
  { en: "Farming is the backbone of civilization.", ta: "விவசாயம் நாகரிகத்தின் முதுகெலும்பு." },
  { en: "Natural food is the best medicine.", ta: "இயற்கை உணவே சிறந்த மருந்து." },
  { en: "A farmer's hands shape the future of food.", ta: "விவசாயியின் கைகளே உலக உணவின் எதிர்காலம்." },
];

export default function FarmingMessage() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState(fallbackQuotes);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const data = await api.get("/content/farmingMessage");
        setQuotes(data.quotes || fallbackQuotes);
      } catch {
        setQuotes(fallbackQuotes);
      }
    }
    loadQuotes();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", maxWidth: 430, margin: "0 auto",
      background: "linear-gradient(160deg, #0f172a, #14532d 70%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "rgba(47,128,237,0.1)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(39,174,96,0.12)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 24,
          background: "linear-gradient(135deg, #2F80ED, #27AE60)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 12px 40px rgba(47,128,237,0.5)",
        }}>
          <Sprout size={34} color="#fff" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
          🌾 Farming is Profit
        </h1>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 24 }}>
          Natural Food is Health 🌿
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {quotes.map(({ en, ta }, i) => (
            <motion.div
              key={en}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: 16, padding: "14px 16px",
                border: "1px solid rgba(255,255,255,0.1)",
                textAlign: "left",
              }}
            >
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, marginBottom: 4, lineHeight: 1.4 }}>
                "{en}"
              </p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>"{ta}"</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{
            background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "16px 20px",
            marginBottom: 28, border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
            <Heart size={16} color="#EF4444" fill="#EF4444" />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Thank You for Supporting Farmers</span>
            <Heart size={16} color="#EF4444" fill="#EF4444" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center" }}>
            "Farming Feeds The World — Respect The Farmer"
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, textAlign: "center", marginTop: 4 }}>
            "விவசாயமே வாழ்க்கை — இயற்கை உணவே ஆரோக்கியம்"
          </p>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/home")}
          style={{
            width: "100%", padding: "15px 20px",
            borderRadius: 18, border: "none",
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(47,128,237,0.45)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          🌾 Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
