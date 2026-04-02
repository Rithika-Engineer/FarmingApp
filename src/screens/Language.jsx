import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const languages = [
  { code: "en", native: "English", sub: "English (Indian)", flag: "🇬🇧" },
  { code: "ta", native: "தமிழ்", sub: "Tamil", flag: "🇮🇳" },
];

export default function Language() {
  const { lang, changeLang } = useLanguage();
  const navigate = useNavigate();
  const t = lang === "ta";

  return (
    <div style={{
      minHeight: "100vh", maxWidth: 430, margin: "0 auto",
      background: "var(--color-bg)",
      display: "flex", flexDirection: "column",
      padding: "60px 24px 40px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
          {t ? "மொழியை தேர்வு செய்க" : "Select Language"}
        </h1>
        <p style={{ fontSize: 15, color: "#6B7280" }}>
          {t ? "உங்கள் விருப்பமான மொழியை தேர்வு செய்யுங்கள்" : "Choose your preferred language to continue"}
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {languages.map(({ code, native, sub, flag }, i) => {
          const selected = lang === code;
          return (
            <motion.button
              key={code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => changeLang(code)}
              style={{
                padding: "18px 18px",
                borderRadius: 20,
                border: selected ? "none" : "1.5px solid #E5E7EB",
                background: selected
                  ? "linear-gradient(135deg, #2F80ED, #27AE60)"
                  : "#fff",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: selected
                  ? "0 8px 28px rgba(47,128,237,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 32 }}>{flag}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: selected ? "#fff" : "#111827", marginBottom: 2 }}>
                  {native}
                </p>
                <p style={{ fontSize: 13, color: selected ? "rgba(255,255,255,0.75)" : "#6B7280" }}>
                  {sub}
                </p>
              </div>
              {selected && (
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: 14 }}>✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginTop: 32 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profile")}
          style={{
            width: "100%", padding: "16px 20px",
            borderRadius: 18, border: "none",
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(47,128,237,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {t ? "தொடரவும்" : "Continue"}
          <ChevronRight size={18} strokeWidth={2.5} />
        </motion.button>
      </motion.div>
    </div>
  );
}
