import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { Home, CloudSun, ShoppingBag, Bot, User, Sprout } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, labelEn: "Home", labelTa: "முகப்பு" },
  { path: "/weather", icon: CloudSun, labelEn: "Weather", labelTa: "வானிலை" },
  { path: "/market", icon: ShoppingBag, labelEn: "Market", labelTa: "சந்தை" },
  { path: "/chat", icon: Bot, labelEn: "AI Chat", labelTa: "AI" },
  { path: "/profile", icon: User, labelEn: "Profile", labelTa: "சுயவிவரம்" },
];

const hiddenRoutes = ["/", "/language", "/welcome"];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = lang === "ta";

  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div
      className="hidden-mobile"
      style={{
        width: 260,
        height: "100vh",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(229,231,235,0.8)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        zIndex: 50,
      }}
    >
      <div
        style={{ 
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingBottom: 32,
          borderBottom: "1px solid rgba(229,231,235,0.6)",
          marginBottom: 24,
        }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "linear-gradient(135deg, #2F80ED, #27AE60)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(47,128,237,0.35)",
        }}>
          <Sprout size={22} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <h1 style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            lineHeight: 1.2,
          }}>
            {t ? "விவசாயி" : "Farmer"}
          </h1>
          <h1 style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#27AE60",
            margin: 0,
            lineHeight: 1.2,
          }}>
            {t ? "உதவியாளர்" : "Assistant"}
          </h1>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map(({ path, icon: Icon, labelEn, labelTa }) => {
          const active = location.pathname.startsWith(path);
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                borderRadius: 14,
                border: "none",
                background: active
                  ? "linear-gradient(135deg, #2F80ED, #27AE60)"
                  : "transparent",
                color: active ? "#fff" : "#4B5563",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
                boxShadow: active ? "0 4px 14px rgba(47,128,237,0.3)" : "none",
              }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{
                fontSize: 15,
                fontWeight: active ? 600 : 500,
                letterSpacing: 0.2,
                fontFamily: "Inter, sans-serif",
              }}>
                {t ? labelTa : labelEn}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 24 }}>
        <div style={{
          padding: 16,
          background: "rgba(47,128,237,0.08)",
          borderRadius: 16,
          border: "1px solid rgba(47,128,237,0.15)",
        }}>
          <p style={{
            fontSize: 13,
            color: "#374151",
            margin: 0,
            fontWeight: 500,
            lineHeight: 1.4,
          }}>
            {t ? "உங்களுக்கு உதவி தேவையா?" : "Need help with farming?"}
          </p>
          <button
            onClick={() => navigate("/chat")}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "8px 0",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#2F80ED",
              cursor: "pointer",
            }}
          >
            {t ? "AI இடம் கேளுங்கள்" : "Ask AI Assistant"}
          </button>
        </div>
      </div>
    </div>
  );
}
