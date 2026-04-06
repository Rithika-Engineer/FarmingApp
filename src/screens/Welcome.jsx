import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { Sprout, ChevronRight } from "lucide-react";

const features = [
  { icon: "🌤️", text: "Weather Forecast" },
  { icon: "🌾", text: "Crop Planning" },
  { icon: "💰", text: "Market Prices" },
  { icon: "🤖", text: "AI Assistant" },
  { icon: "🌿", text: "Natural Farming" },
];

export default function Welcome() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      background: "linear-gradient(160deg, #0f172a 0%, #14532d 60%, #166534 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative bubbles */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "rgba(47,128,237,0.12)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(39,174,96,0.15)" }} />
      <div style={{ position: "absolute", top: "40%", left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 1 }}
      >
        <div style={{
          width: 88, height: 88,
          borderRadius: 28,
          background: "linear-gradient(135deg, #2F80ED, #27AE60)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 16px 48px rgba(47,128,237,0.5)",
        }}>
          <Sprout size={40} color="#fff" strokeWidth={2} />
        </div>

        <h1 style={{
          fontSize: 32, fontWeight: 800, color: "#fff",
          fontFamily: "Inter, sans-serif", lineHeight: 1.2, marginBottom: 8,
        }}>
          {t ? "விவசாயி" : "Farmer"}<br />
          <span style={{
            background: "linear-gradient(135deg, #60A5FA, #34D399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {t ? "உதவியாளர்" : "Assistant"}
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 400, lineHeight: 1.5 }}>
          {t
            ? "இயற்கை வேளாண்மை • வானிலை • சந்தை"
            : "Natural Farming • Weather • Market"}
        </p>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          justifyContent: "center", marginBottom: 40,
          position: "relative", zIndex: 1,
        }}
      >
        {features.map(({ icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 12, fontWeight: 500,
            }}
          >
            <span>{icon}</span> {text}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/language")}
          style={{
            width: "100%", padding: "17px 24px",
            borderRadius: 20, border: "none",
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff", fontWeight: 700, fontSize: 17,
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(47,128,237,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {t ? "தொடங்கு" : "Get Started"}
          <ChevronRight size={20} strokeWidth={2.5} />
        </motion.button>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 16 }}>
          {t ? "விவசாயிகளுக்காக உருவாக்கப்பட்டது" : "Made for Indian Farmers 🇮🇳"}
        </p>
      </motion.div>

    </div>
  );
}
