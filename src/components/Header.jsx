import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import { ChevronLeft, Sprout } from "lucide-react";

export default function Header({ title = "", back = true }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = lang === "ta";
  const location = useLocation();
  const isHome = location.pathname === "/home";

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(247,249,252,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(229,231,235,0.6)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {back && !isHome && (
        <motion.button
          className="hidden-desktop"
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate(-1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: "none",
            background: "rgba(229,231,235,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#111827",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </motion.button>
      )}

      {isHome && (
        <div 
          className="hidden-desktop"
          style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: "linear-gradient(135deg, #2F80ED, #27AE60)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(47,128,237,0.35)",
        }}>
          <Sprout size={18} color="#fff" strokeWidth={2.2} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#111827",
          fontFamily: "Inter, sans-serif",
          margin: 0,
          lineHeight: 1.2,
        }}>
          {title || (t ? "விவசாயி உதவியாளர்" : "Farmer Assistant")}
        </h1>
        {isHome && (
          <p style={{
            fontSize: 12,
            color: "#6B7280",
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}>
            {t ? "உங்கள் AI மேலாண்மை பயன்பாடு" : "Your AI-powered farming app"}
          </p>
        )}
      </div>
    </motion.div>
  );
}
