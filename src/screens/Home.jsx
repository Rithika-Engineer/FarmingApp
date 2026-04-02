import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import {
  Cloud, TrendingUp, Leaf, Bug, DollarSign, ShoppingCart,
  BookOpen, PlayCircle, Briefcase, Bot, Mic, Calendar,
  Sprout, Phone, ChevronRight, Sun, Wind, MapPin,
  BarChart2, Cpu
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
});

const quickActions = [
  { path: "/weather", icon: Cloud, label: "Weather", labelTa: "வானிலை", color: "#2F80ED", bg: "#EBF4FF" },
  { path: "/natural", icon: Leaf, label: "Natural", labelTa: "இயற்கை", color: "#27AE60", bg: "#EDFBF1" },
  { path: "/pesticide", icon: Bug, label: "Pest", labelTa: "பூச்சி", color: "#F2994A", bg: "#FFF5EB" },
  { path: "/profit", icon: DollarSign, label: "Profit", labelTa: "லாபம்", color: "#9B51E0", bg: "#F5EDFF" },
  { path: "/market", icon: ShoppingCart, label: "Market", labelTa: "சந்தை", color: "#EB5757", bg: "#FFEBEB" },
  { path: "/schemes", icon: BookOpen, label: "Schemes", labelTa: "திட்டங்கள்", color: "#2F80ED", bg: "#EBF4FF" },
  { path: "/videos", icon: PlayCircle, label: "Videos", labelTa: "வீடியோ", color: "#F2994A", bg: "#FFF5EB" },
  { path: "/jobs", icon: Briefcase, label: "Jobs", labelTa: "வேலைகள்", color: "#27AE60", bg: "#EDFBF1" },
  { path: "/chat", icon: Bot, label: "AI Chat", labelTa: "AI", color: "#2F80ED", bg: "#EBF4FF" },
  { path: "/assistant", icon: Mic, label: "Voice", labelTa: "குரல்", color: "#9B51E0", bg: "#F5EDFF" },
  { path: "/cropplanner", icon: Sprout, label: "Planner", labelTa: "திட்டமிடல்", color: "#27AE60", bg: "#EDFBF1" },
  { path: "/season", icon: Calendar, label: "Season", labelTa: "பருவம்", color: "#F2994A", bg: "#FFF5EB" },
];

export default function Home() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  const [farmerName, setFarmerName] = useState("");
  const [village, setVillage] = useState("");
  const [crop, setCrop] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await api.get("/profile");
        setFarmerName(profile.farmerName || localStorage.getItem("farmerName") || "");
        setVillage(profile.village || localStorage.getItem("village") || "");
        setCrop(profile.crop || localStorage.getItem("crop") || "");
      } catch {
        setFarmerName(localStorage.getItem("farmerName") || "");
        setVillage(localStorage.getItem("village") || "");
        setCrop(localStorage.getItem("crop") || "");
      }
    }
    loadProfile();
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12
    ? (t ? "காலை வணக்கம்" : "Good Morning")
    : hour < 17
    ? (t ? "மதிய வணக்கம்" : "Good Afternoon")
    : (t ? "மாலை வணக்கம்" : "Good Evening");

  return (
    <Layout>
      <div style={{ padding: "20px 24px 40px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>

        {/* Greeting Section */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#6B7280", marginBottom: 4 }}>
            {greeting} 👋
          </p>
          <h2 style={{
            fontSize: 26, fontWeight: 800,
            color: "#111827", lineHeight: 1.2,
            fontFamily: "Inter, sans-serif",
          }}>
            {farmerName || (t ? "விவசாயி" : "Farmer")}
          </h2>
          {village && (
            <p style={{
              fontSize: 13, color: "#6B7280",
              display: "flex", alignItems: "center", gap: 4, marginTop: 4
            }}>
              <MapPin size={12} /> {village}
            </p>
          )}
        </motion.div>

        {/* Dashboard Grid for Major Cards */}
        <div className="dashboard-grid" style={{ marginBottom: 32 }}>

          {/* Hero Weather-style Card */}
          <motion.div {...fadeUp(0.08)}
            onClick={() => navigate("/weather")}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, #1a6fd4, #27AE60)",
              borderRadius: 24,
              padding: "20px 22px",
              cursor: "pointer",
              boxShadow: "0 12px 40px rgba(47,128,237,0.35)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circle */}
            <div style={{
              position: "absolute", right: -30, top: -30,
              width: 130, height: 130,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }} />
            <div style={{
              position: "absolute", right: 20, top: 20,
              width: 70, height: 70,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                    {t ? "வானிலை" : "Weather"}
                  </p>
                  <div style={{ fontSize: 48, lineHeight: 1 }}>☀️</div>
                  {crop && (
                    <div style={{
                      marginTop: 16,
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 20, padding: "6px 14px",
                    }}>
                      <Sprout size={14} color="#fff" />
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{crop}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginBottom: 4 }}>
                    {t ? "இன்று" : "Today"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
                    <div style={{ textAlign: "center" }}>
                      <Wind size={16} color="rgba(255,255,255,0.8)" />
                      <p style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>12 km/h</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Cloud size={16} color="rgba(255,255,255,0.8)" />
                      <p style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>65%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", marginTop: 16 }}>
                 <p style={{ color: "#fff", fontSize: 13, opacity: 0.85, fontWeight: 500 }}>
                    {t ? "தகவல் பார்க்க →" : "View Forecast →"}
                  </p>
              </div>
            </div>
          </motion.div>

          {/* AI Assist Card */}
          <motion.div {...fadeUp(0.14)}
            onClick={() => navigate("/chat")}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "24px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #2F80ED, #9B51E0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(47,128,237,0.35)",
              }}>
                <Cpu size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  {t ? "AI விவசாய உதவியாளர்" : "AI Farming Assistant"}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>
                  {t ? "பயிர், பூச்சி, உரம் பற்றி கேளுங்கள்" : "Ask about crops, pests, and fertilizers"}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: "#2F80ED", fontWeight: 600 }}>Start Chat</span>
                <ChevronRight size={18} color="#2F80ED" />
            </div>
          </motion.div>

          {/* Market Quick Card */}
          <motion.div {...fadeUp(0.18)}
            onClick={() => navigate("/market")}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "24px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #27AE60, #1a8a4a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(39,174,96,0.35)",
              }}>
                <BarChart2 size={24} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  {t ? "இன்று சந்தை விலை" : "Today's Market Prices"}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4 }}>
                  {t ? "நேரலை விலை புதுப்பிப்பு" : "Live price updates for crops in your region"}
                </p>
              </div>
            </div>
             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8 }}>
                <span style={{ fontSize: 13, color: "#27AE60", fontWeight: 600 }}>View Market</span>
                <ChevronRight size={18} color="#27AE60" />
            </div>
          </motion.div>
        </div>

        {/* Section title */}
        <motion.p {...fadeUp(0.2)} style={{
          fontSize: 18, fontWeight: 700,
          color: "#111827", marginBottom: 14,
        }}>
          {t ? "சேவைகள்" : "Services"}
        </motion.p>

        {/* Quick Actions Grid */}
        <style>
          {`
            .services-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 32px;
            }
            @media (min-width: 768px) {
              .services-grid {
                grid-template-columns: repeat(6, 1fr);
              }
            }
          `}
        </style>
        <motion.div
          {...fadeUp(0.22)}
          className="services-grid"
        >
          {quickActions.map(({ path, icon: Icon, label, labelTa, color, bg }, i) => (
            <motion.button
              key={path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(path)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px 8px",
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: 12,
                background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} color={color} strokeWidth={2} />
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#374151",
                textAlign: "center",
                lineHeight: 1.3,
              }}>
                {t ? labelTa : label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Help Button */}
        <motion.button
          {...fadeUp(0.26)}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/help")}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 16,
            border: "1.5px solid #FECACA",
            background: "#FFF5F5",
            color: "#EF4444",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, marginBottom: 8,
          }}
        >
          <Phone size={15} /> {t ? "🆘 உதவி / Helpline" : "🆘 Help / Helpline"}
        </motion.button>

        <motion.button
          {...fadeUp(0.28)}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/profile")}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(47,128,237,0.3)",
            marginBottom: 8,
          }}
        >
          {t ? "✏️ விவரம் மாற்ற" : "✏️ Edit Profile"}
        </motion.button>

      </div>
    </Layout>
  );
}
