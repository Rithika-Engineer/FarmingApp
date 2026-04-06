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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(135deg, #0f172a 0%, #14532d 55%, #166534 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(47,128,237,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(39,174,96,0.15)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 50,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT HERO */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 30,
              background: "linear-gradient(135deg, #2F80ED, #27AE60)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              boxShadow: "0 18px 48px rgba(47,128,237,0.5)",
            }}
          >
            <Sprout size={46} color="#fff" />
          </div>

          <h1
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            {t ? "விவசாயி" : "Farmer"}{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#60A5FA,#34D399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t ? "உதவியாளர்" : "Assistant"}
            </span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 18,
              lineHeight: 1.7,
              maxWidth: 500,
              marginBottom: 28,
            }}
          >
            {t
              ? "வானிலை, சந்தை, இயற்கை வேளாண்மை, AI உதவி அனைத்தும் ஒரே இடத்தில்."
              : "Weather, crop planning, natural farming, market prices and AI support in one smart platform."}
          </p>

          <button
            onClick={() => navigate("/language")}
            style={{
              padding: "18px 28px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(135deg,#2F80ED,#27AE60)",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 10px 30px rgba(47,128,237,0.4)",
            }}
          >
            {t ? "தொடங்கு" : "Get Started"}
            <ChevronRight size={22} />
          </button>
        </motion.div>

        {/* RIGHT FEATURES */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                borderRadius: 24,
                padding: 28,
                color: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: 34, marginBottom: 12 }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                {feature.text}
              </h3>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}