import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Phone, ExternalLink, MessageCircle } from "lucide-react";
import { api } from "../lib/api";

const fallbackContacts = [
  {
    icon: "📞",
    titleEn: "Farmer Helpline",
    titleTa: "விவசாயி ஹெல்ப்லைன்",
    number: "1800-180-1551",
    tel: "18001801551",
    descEn: "Free call • 24/7 • All crops & schemes",
    descTa: "இலவச அழைப்பு • 24/7 • அனைத்து சேவைகளும்",
    color: "#EBF4FF",
    btnColor: "#2F80ED",
  },
  {
    icon: "🏛️",
    titleEn: "District Agriculture Office",
    titleTa: "மாவட்ட விவசாய அலுவலகம்",
    number: "1967",
    tel: "1967",
    descEn: "Contact local agriculture officers near you",
    descTa: "உங்கள் பகுதி விவசாய அதிகாரிகளை தொடர்பு கொள்ளுங்கள்",
    color: "#EDFBF1",
    btnColor: "#27AE60",
  },
  {
    icon: "🌾",
    titleEn: "KISAN Call Centre",
    titleTa: "கிசான் அழைப்பு மையம்",
    number: "1551",
    tel: "1551",
    descEn: "Crop advice & market info in Tamil",
    descTa: "தமிழில் பயிர் ஆலோசனை மற்றும் சந்தை தகவல்",
    color: "#FEF9C3",
    btnColor: "#92400E",
  },
];

const fallbackMenuOptions = [
  { num: "1", en: "Weather Info", ta: "வானிலை தகவல்" },
  { num: "2", en: "Natural Farming Guide", ta: "இயற்கை வேளாண்மை ஆலோசனை" },
  { num: "3", en: "Market Prices", ta: "சந்தை விலை" },
  { num: "4", en: "Government Schemes", ta: "அரசு திட்டங்கள்" },
];

export default function Help() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [contacts, setContacts] = useState(fallbackContacts);
  const [menuOptions, setMenuOptions] = useState(fallbackMenuOptions);

  useEffect(() => {
    async function loadHelp() {
      try {
        const data = await api.get("/content/help");
        setContacts(data.contacts || fallbackContacts);
        setMenuOptions(data.menuOptions || fallbackMenuOptions);
      } catch {
        setContacts(fallbackContacts);
        setMenuOptions(fallbackMenuOptions);
      }
    }
    loadHelp();
  }, []);

  return (
    <Layout title={t ? "உதவி" : "Help"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #1a6fd4, #27AE60)",
            borderRadius: 22, padding: "20px 20px",
            marginBottom: 16,
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
              {t ? "📱 இணையம் இல்லாமலும் உதவி பெறலாம்" : "📱 Get help even without internet"}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              {t ? "விவசாயி ஹெல்ப்லைன்" : "Farmer Helpline"}
            </h2>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#A7F3D0", marginBottom: 12 }}>
              📞 1800-180-1551
            </p>
            <a href="tel:18001801551" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 18px",
              borderRadius: 14, background: "rgba(255,255,255,0.2)",
              color: "#fff", textDecoration: "none",
              fontSize: 14, fontWeight: 700,
              backdropFilter: "blur(10px)",
            }}>
              <Phone size={15} /> {t ? "இப்போதே அழைக்கவும்" : "Call Now – Free"}
            </a>
          </div>
        </motion.div>

        {/* IVR Menu */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "#fff", borderRadius: 18,
            padding: "14px 16px", marginBottom: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            border: "1px solid #E5E7EB",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            📡 {t ? "அழைத்த பிறகு தேர்வு செய்யுங்கள்" : "Menu After Calling"}
          </p>
          {menuOptions.map(({ num, en, ta }, i) => (
            <div key={num} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: i < menuOptions.length - 1 ? "1px solid #F3F4F6" : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0,
              }}>
                {num}
              </div>
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                {t ? ta : en}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Contact Cards */}
        <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {t ? "தொடர்பு எண்கள்" : "Helpline Numbers"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {contacts.map(({ icon, titleEn, titleTa, number, tel, descEn, descTa, color, btnColor }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.06 }}
              style={{
                background: "#fff", borderRadius: 18,
                padding: "14px 16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                border: "1px solid #E5E7EB",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: color, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>
                  {t ? titleTa : titleEn}
                </p>
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                  {t ? descTa : descEn}
                </p>
                <a
                  href={`tel:${tel}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 10,
                    background: btnColor, color: "#fff",
                    textDecoration: "none", fontSize: 13, fontWeight: 700,
                  }}
                >
                  <Phone size={12} /> {number}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
