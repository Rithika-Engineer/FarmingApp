import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { api } from "../lib/api";
import {
  User, MapPin, Crop, Phone, FlaskConical,
  ChevronRight, LogOut, Globe, HelpCircle, Bell,
  Shield, Star, CheckCircle2
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
});

export default function Profile() {
  const { lang, changeLang } = useLanguage();
  const navigate = useNavigate();
  const t = lang === "ta";

  const [farmerName, setFarmerName] = useState(localStorage.getItem("farmerName") || "");
  const [village, setVillage] = useState(localStorage.getItem("village") || "");
  const [land, setLand] = useState(localStorage.getItem("land") || "");
  const [crop, setCrop] = useState(localStorage.getItem("crop") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.get("/profile");
        setFarmerName(data.farmerName || "");
        setVillage(data.village || "");
        setLand(data.land || "");
        setCrop(data.crop || "");
        setPhone(data.phone || "");
      } catch {
        // Keep local storage fallbacks when backend is unavailable.
      }
    }
    loadProfile();
  }, []);

  const saveProfile = async () => {
    localStorage.setItem("farmerName", farmerName);
    localStorage.setItem("village", village);
    localStorage.setItem("land", land);
    localStorage.setItem("crop", crop);
    localStorage.setItem("phone", phone);
    try {
      await api.put("/profile", { farmerName, village, land, crop, phone });
    } catch {
      // Keep UI responsive even if server save fails.
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate("/home"); }, 1500);
  };

  const fields = [
    { key: "name", label: t ? "பெயர்" : "Full Name", value: farmerName, setter: setFarmerName, placeholder: t ? "உங்கள் பெயர்" : "Enter your name", icon: "👤", type: "text" },
    { key: "village", label: t ? "கிராமம் / இடம்" : "Village / Location", value: village, setter: setVillage, placeholder: t ? "கிராமம்" : "Village name", icon: "📍", type: "text" },
    { key: "land", label: t ? "நில அளவு (ஏக்கர்)" : "Land Size (acres)", value: land, setter: setLand, placeholder: t ? "உதா: 2.5" : "e.g. 2.5", icon: "🌿", type: "number" },
    { key: "crop", label: t ? "பயிர் வகை" : "Crop Type", value: crop, setter: setCrop, placeholder: t ? "உதா: நெல்" : "e.g. Paddy", icon: "🌾", type: "text" },
    { key: "phone", label: t ? "தொலைபேசி எண்" : "Phone Number", value: phone, setter: setPhone, placeholder: t ? "உங்கள் எண்" : "Phone number", icon: "📱", type: "tel" },
  ];

  return (
    <Layout title={t ? "சுயவிவரம்" : "Profile"}>
      <div className="inner-screen-container" style={{ padding: "16px 24px 40px" }}>

        {/* Avatar Area */}
        <motion.div {...fadeUp(0)} style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 28,
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 32,
            boxShadow: "0 8px 28px rgba(47,128,237,0.35)",
          }}>
            🧑‍🌾
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            {farmerName || (t ? "விவசாயி" : "Farmer")}
          </h2>
          {village && (
            <p style={{ fontSize: 13, color: "#6B7280" }}>📍 {village}</p>
          )}
        </motion.div>

        {/* Form Fields */}
        <motion.div {...fadeUp(0.08)} style={{
          background: "#fff", borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          border: "1px solid #E5E7EB",
          marginBottom: 16,
        }}>
          {fields.map(({ key, label, value, setter, placeholder, icon, type }, i) => (
            <div key={key} style={{
              padding: "14px 16px",
              borderBottom: i < fields.length - 1 ? "1px solid #F3F4F6" : "none",
            }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>
                {icon} {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%", border: "none", outline: "none",
                  fontSize: 15, fontWeight: 500,
                  color: "#111827", background: "transparent",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Language Toggle */}
        <motion.div {...fadeUp(0.14)} style={{
          background: "#fff", borderRadius: 20,
          padding: "4px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          border: "1px solid #E5E7EB",
          marginBottom: 16,
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
              🌐 {t ? "மொழி" : "Language"}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["en", "ta"].map(l => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => changeLang(l)}
                  style={{
                    flex: 1, padding: "10px 12px",
                    borderRadius: 12, border: "none",
                    background: lang === l ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#F3F4F6",
                    color: lang === l ? "#fff" : "#374151",
                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                    boxShadow: lang === l ? "0 4px 12px rgba(47,128,237,0.3)" : "none",
                  }}
                >
                  {l === "en" ? "🇬🇧 English" : "🇮🇳 தமிழ்"}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Nav */}
        <motion.div {...fadeUp(0.18)} style={{
          background: "#fff", borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          border: "1px solid #E5E7EB",
          marginBottom: 20,
        }}>
          {[
            { label: t ? "உதவி" : "Help & Support", icon: "❓", path: "/help" },
            { label: t ? "அரசு திட்டங்கள்" : "Government Schemes", icon: "📋", path: "/schemes" },
            { label: t ? "லாப கணக்கீடு" : "Profit Calculator", icon: "💰", path: "/profit" },
          ].map(({ label, icon, path }, i) => (
            <motion.button
              key={path}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(path)}
              style={{
                width: "100%", padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
                background: "none", border: "none",
                borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#111827", textAlign: "left" }}>{label}</span>
              <ChevronRight size={16} color="#9CA3AF" />
            </motion.button>
          ))}
        </motion.div>

        {/* Save Button */}
        <motion.button
          {...fadeUp(0.22)}
          whileTap={{ scale: 0.97 }}
          onClick={saveProfile}
          style={{
            width: "100%", padding: "15px 20px",
            borderRadius: 18, border: "none",
            background: saved ? "#27AE60" : "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(47,128,237,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background 0.3s",
            marginBottom: 8,
          }}
        >
          {saved ? (
            <><CheckCircle2 size={18} /> {t ? "சேமிக்கப்பட்டது!" : "Saved!"}</>
          ) : (
            t ? "சுயவிவரம் சேமிக்கவும்" : "Save Profile"
          )}
        </motion.button>

      </div>
    </Layout>
  );
}
