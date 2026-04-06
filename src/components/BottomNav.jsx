import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Home, CloudSun, ShoppingBag, Bot, User } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, labelEn: "Home", labelTa: "முகப்பு" },
  { path: "/weather", icon: CloudSun, labelEn: "Weather", labelTa: "வானிலை" },
  { path: "/market", icon: ShoppingBag, labelEn: "Market", labelTa: "சந்தை" },
  { path: "/chat", icon: Bot, labelEn: "AI Chat", labelTa: "AI" },
  { path: "/profile", icon: User, labelEn: "Profile", labelTa: "சுயவிவரம்" },
];

const hiddenRoutes = ["/", "/language", "/welcome"];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const t = lang === "ta";

  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <div 
      className="hidden-desktop"
      style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 420,
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      paddingBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      pointerEvents: "none",
    }}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 32,
          padding: "8px 12px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.6)",
          pointerEvents: "auto",
        }}
      >
        {navItems.map(({ path, icon: Icon, labelEn, labelTa }) => {
          const active = location.pathname === path;
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: active ? "8px 18px" : "8px 14px",
                borderRadius: 22,
                border: "none",
                background: active
                  ? "linear-gradient(135deg, #2F80ED, #27AE60)"
                  : "transparent",
                color: active ? "#fff" : "#6B7280",
                cursor: "pointer",
                transition: "all 0.25s ease",
                minWidth: active ? 72 : 48,
                boxShadow: active ? "0 4px 14px rgba(47,128,237,0.4)" : "none",
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: active ? 0.2 : 0,
                fontFamily: "Inter, sans-serif",
              }}>
                {t ? labelTa : labelEn}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
