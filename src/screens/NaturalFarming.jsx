import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../lib/api";

const fallbackFarmingData = {
  paddy: {
    emoji: "🌾",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: {
      en: ["Cow dung 10 kg", "Cow urine 10 L", "Add jaggery", "Ferment 24 hours"],
      ta: ["மாட்டு சாணம் 10 கிலோ", "மாட்டு சிறுநீர் 10 லிட்டர்", "கருப்பட்டி சேர்க்கவும்", "24 மணி நேரம் ஊறவிடவும்"],
    },
    apply: { en: "Spray once every 15 days", ta: "15 நாட்களுக்கு ஒருமுறை தெளிக்கவும்" },
    safety: { en: "Wear gloves while spraying", ta: "கையுறை அணிந்து தெளிக்கவும்" },
    benefit: { en: "Improves soil fertility and water retention", ta: "மண் வளம் மற்றும் நீர் தக்க வைப்பு உயரும்" },
  },
  banana: {
    emoji: "🍌",
    fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" },
    prep: { en: ["Add milk, curd, ghee", "Ferment for 7 days"], ta: ["பால், தயிர், நெய் சேர்க்கவும்", "7 நாட்கள் ஊறவிடவும்"] },
    apply: { en: "Every 20 days", ta: "20 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Store in shade; avoid direct sunlight", ta: "நிழலில் சேமித்து வைக்கவும்" },
    benefit: { en: "Improves fruit size & quality", ta: "பழ அளவும் தரமும் உயரும்" },
  },
  tomato: {
    emoji: "🍅",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: { en: ["Ferment cow dung mix for 24 hours"], ta: ["22 மணி நேரம் ஊறவிடவும்"] },
    apply: { en: "Every 10 days", ta: "10 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Wear mask while spraying", ta: "முக கவசம் அணியவும்" },
    benefit: { en: "Higher yield with better disease resistance", ta: "அதிக மகசூல் மற்றும் நோய் எதிர்ப்பு" },
  },
  groundnut: {
    emoji: "🥜",
    fert: { en: "Vermicompost", ta: "வெர்மி கம்போஸ்ட்" },
    prep: { en: ["Mix with soil before sowing"], ta: ["விதைப்பதற்கு முன் மண்ணுடன் கலக்கவும்"] },
    apply: { en: "Before sowing", ta: "விதைப்பு முன்" },
    safety: { en: "Maintain soil moisture", ta: "ஈரப்பதம் பராமரிக்கவும்" },
    benefit: { en: "Strong root growth & nitrogen fixation", ta: "வேர் வளர்ச்சி மேம்படும்" },
  },
  cotton: {
    emoji: "🪴",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: { en: ["Ferment for 24 hours"], ta: ["24 மணி நேரம் ஊறவிடவும்"] },
    apply: { en: "Every 15 days", ta: "15 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Avoid direct sunlight storage", ta: "நேரடி வெயிலில் வைக்காதீர்கள்" },
    benefit: { en: "Reduces input costs significantly", ta: "உள்ளீடு செலவு குறையும்" },
  },
  sugarcane: {
    emoji: "🌿",
    fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" },
    prep: { en: ["Ferment for 7 days"], ta: ["7 நாட்கள் ஊறவிடவும்"] },
    apply: { en: "Every 20 days", ta: "20 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Keep away from children", ta: "குழந்தைகள் அருகில் வைக்காதீர்கள்" },
    benefit: { en: "Increases brix/sweetness level", ta: "இனிப்புத்தன்மை உயரும்" },
  },
};

export default function NaturalFarming() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [selected, setSelected] = useState("");
  const [farmingData, setFarmingData] = useState(fallbackFarmingData);

  useEffect(() => {
    async function loadNaturalFarming() {
      try {
        const data = await api.get("/content/naturalFarming");
        setFarmingData(data || fallbackFarmingData);
      } catch {
        setFarmingData(fallbackFarmingData);
      }
    }
    loadNaturalFarming();
  }, []);

  const crops = Object.keys(farmingData);
  const info = farmingData[selected];

  return (
    <Layout title={t ? "இயற்கை வேளாண்மை" : "Natural Farming"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Crop Grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t ? "பயிர் தேர்வு" : "Select Crop"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {crops.map(c => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(c)}
                style={{
                  padding: "12px 8px",
                  borderRadius: 16,
                  border: selected === c ? "none" : "1.5px solid #E5E7EB",
                  background: selected === c ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                  cursor: "pointer",
                  boxShadow: selected === c ? "0 4px 14px rgba(47,128,237,0.35)" : "0 2px 6px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{farmingData[c].emoji}</div>
                <p style={{ fontSize: 12, fontWeight: 600, color: selected === c ? "#fff" : "#374151" }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info Cards */}
        <AnimatePresence mode="wait">
          {info && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {/* Fertilizer */}
              <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#27AE60", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>🌿 {t ? "உரம்" : "Fertilizer"}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{t ? info.fert.ta : info.fert.en}</p>
              </div>

              {/* Preparation */}
              <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#2F80ED", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>🧪 {t ? "தயாரிப்பு முறை" : "Preparation"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(t ? info.prep.ta : info.prep.en).map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 8,
                        background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, paddingTop: 2 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage, Safety, Benefits */}
              {[
                { label: t ? "பயன்பாட்டு அட்டவணை" : "Usage Schedule", val: t ? info.apply.ta : info.apply.en, icon: "📅", bg: "#FEF9C3" },
                { label: t ? "பாதுகாப்பு" : "Safety", val: t ? info.safety.ta : info.safety.en, icon: "⚠️", bg: "#FFF5F5" },
                { label: t ? "பயன்கள்" : "Benefits", val: t ? info.benefit.ta : info.benefit.en, icon: "✅", bg: "#EDFBF1" },
              ].map(({ label, val, icon, bg }) => (
                <div key={label} style={{ background: bg, borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>{icon} {label}</p>
                  <p style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.5 }}>{val}</p>
                </div>
              ))}

              {/* Natural vs Chemical */}
              <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB", marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>⚖️ {t ? "இயற்கை vs ரசாயனம்" : "Natural vs Chemical"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: "#EDFBF1", borderRadius: 10 }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <span style={{ fontSize: 13, color: "#065F46", fontWeight: 500 }}>{t ? "மண் ஆரோக்கியம் உயரும்" : "Improves long-term soil health"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: "#FEF9C3", borderRadius: 10 }}>
                    <span style={{ fontSize: 16 }}>🚫</span>
                    <span style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>{t ? "ரசாயன எச்சம் இல்லை" : "Zero chemical residue"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: "#EBF4FF", borderRadius: 10 }}>
                    <span style={{ fontSize: 16 }}>💰</span>
                    <span style={{ fontSize: 13, color: "#1D4ED8", fontWeight: 500 }}>{t ? "செலவு 40% குறையும்" : "Up to 40% cost reduction"}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "32px 20px", color: "#9CA3AF" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <p style={{ fontSize: 14 }}>
              {t ? "மேலே பயிர் தேர்வு செய்து இயற்கை வேளாண்மை ஆலோசனை பெறுங்கள்" : "Select a crop above to get organic farming guidance"}
            </p>
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
