import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { api } from "../lib/api";

const fallbackSchemes = [
  {
    id: "pm",
    emoji: "🌾",
    nameEn: "PM-Kisan",
    nameTa: "PM-Kisan",
    descEn: "₹6,000 per year direct income support to all farmer families",
    descTa: "அனைத்து விவசாய குடும்பங்களுக்கும் ஆண்டுக்கு ₹6,000 நேரடி வருமான உதவி",
    link: "https://pmkisan.gov.in",
    tag: "Income",
    color: "#EBF4FF",
    tagColor: "#2F80ED",
  },
  {
    id: "pmfby",
    emoji: "🛡️",
    nameEn: "PMFBY",
    nameTa: "PMFBY (பயிர் காப்பீடு)",
    descEn: "Low premium crop insurance for protection against natural calamities",
    descTa: "இயற்கை பேரிடர்களிலிருந்து பாதுகாப்பு – குறைந்த பிரீமியம் பயிர் காப்பீடு",
    link: "https://pmfby.gov.in",
    tag: "Insurance",
    color: "#FEF9C3",
    tagColor: "#92400E",
  },
  {
    id: "soil",
    emoji: "🌱",
    nameEn: "Soil Health Card",
    nameTa: "மண் ஆரோக்கிய அட்டை",
    descEn: "Free soil testing and personalized fertilizer recommendations",
    descTa: "இலவச மண் பரிசோதனை மற்றும் தனிப்பயன் உர பரிந்துரை",
    link: "https://soilhealth.dac.gov.in",
    tag: "Free",
    color: "#D1FAE5",
    tagColor: "#065F46",
  },
  {
    id: "pmksy",
    emoji: "💧",
    nameEn: "PMKSY",
    nameTa: "நுண் நீர்ப்பாசனம் (PMKSY)",
    descEn: "Subsidies on drip and sprinkler irrigation systems",
    descTa: "டிரிப் & ஸ்பிரிங்க்லர் நீர்ப்பாசன மானியம்",
    link: "https://pmksy.gov.in",
    tag: "Subsidy",
    color: "#EBF4FF",
    tagColor: "#1D4ED8",
  },
  {
    id: "pkvy",
    emoji: "🌿",
    nameEn: "PKVY (Organic)",
    nameTa: "இயற்கை விவசாயம் (PKVY)",
    descEn: "Financial support for transitioning to organic farming",
    descTa: "இயற்கை விவசாயத்திற்கு மாறுவதற்கு நிதி உதவி",
    link: "https://pgsindia-ncof.gov.in",
    tag: "Organic",
    color: "#D1FAE5",
    tagColor: "#065F46",
  },
  {
    id: "kcc",
    emoji: "🏦",
    nameEn: "Kisan Credit Card",
    nameTa: "கிசான் கிரெடிட் கார்டு",
    descEn: "Low-interest crop loans up to ₹3 lakh for eligible farmers",
    descTa: "தகுதியான விவசாயிகளுக்கு ₹3 லட்சம் வரை குறைந்த வட்டி கடன்",
    link: "https://www.myscheme.gov.in",
    tag: "Loan",
    color: "#FEE2E2",
    tagColor: "#DC2626",
  },
];

export default function Schemes() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [openId, setOpenId] = useState("");
  const [schemes, setSchemes] = useState(fallbackSchemes);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await api.get("/content/schemes");
        setSchemes(Array.isArray(data) ? data : fallbackSchemes);
      } catch {
        setSchemes(fallbackSchemes);
      }
    }
    loadSchemes();
  }, []);

  return (
    <Layout title={t ? "அரசு திட்டங்கள்" : "Government Schemes"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            borderRadius: 20, padding: "16px 18px",
            marginBottom: 16,
            display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <div style={{ fontSize: 32 }}>🏛️</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              {t ? "விவசாயிகளுக்கான திட்டங்கள்" : "Farmer Welfare Schemes"}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              {t ? "6 திட்டங்கள் · அனைத்தும் இலவசம்" : "6 schemes · All government backed"}
            </p>
          </div>
        </motion.div>

        {/* Scheme Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {schemes.map((s, i) => {
            const isOpen = openId === s.id;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  border: isOpen ? "1.5px solid #2F80ED" : "1px solid #E5E7EB",
                }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? "" : s.id)}
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: s.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {s.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                        {t ? s.nameTa : s.nameEn}
                      </p>
                      <span style={{
                        padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: s.color, color: s.tagColor,
                      }}>
                        {s.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>
                      {t ? s.descTa.substring(0, 50) + "..." : s.descEn.substring(0, 50) + "..."}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {isOpen ? <ChevronUp size={16} color="#2F80ED" /> : <ChevronDown size={16} color="#9CA3AF" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 16px 16px" }}>
                        <div style={{ background: s.color, borderRadius: 12, padding: "12px", marginBottom: 10 }}>
                          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                            {t ? s.descTa : s.descEn}
                          </p>
                        </div>
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "10px 14px", borderRadius: 12,
                            background: "linear-gradient(135deg, #EBF4FF, #EDFBF1)",
                            border: "1px solid #BFDBFE",
                            color: "#2F80ED", textDecoration: "none",
                            fontSize: 13, fontWeight: 700,
                          }}
                        >
                          <ExternalLink size={14} />
                          {t ? "அதிகாரப்பூர்வ இணையதளம்" : "Official Website"}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}
