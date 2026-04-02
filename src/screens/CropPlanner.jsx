import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../lib/api";

const fallbackCrops = {
  kharif: [
    { name: "Paddy", ta: "நெல்", soil: "Clay / Loamy", water: "High", days: "120–150", gains: "Adds organic matter", next: "Wheat / Pulses", tip: "Avoid water stress during tillering", emoji: "🌾" },
    { name: "Maize", ta: "சோளம்", soil: "Well drained", water: "Medium", days: "90–110", gains: "Improves soil tilth", next: "Potato / Pulses", tip: "Ensure weed control in first 30 days", emoji: "🌽" },
    { name: "Cotton", ta: "பருத்தி", soil: "Black soil", water: "Medium", days: "150–180", gains: "Deep root improves soil", next: "Groundnut", tip: "Avoid excess nitrogen", emoji: "🪴" },
    { name: "Groundnut", ta: "வேர்க்கடலை", soil: "Sandy loam", water: "Low", days: "100–120", gains: "Fixes nitrogen", next: "Maize / Sorghum", tip: "Good drainage required", emoji: "🥜" },
    { name: "Soybean", ta: "சோயாபீன்", soil: "Clay loam", water: "Medium", days: "90–110", gains: "High nitrogen fixing", next: "Wheat", tip: "Do not waterlog", emoji: "🫘" },
  ],
  rabi: [
    { name: "Wheat", ta: "கோதுமை", soil: "Loam", water: "Medium", days: "120–140", gains: "Moderate residue", next: "Paddy / Maize", tip: "Avoid late sowing", emoji: "🌾" },
    { name: "Mustard", ta: "கடுகு", soil: "Loam", water: "Low", days: "100–120", gains: "Improves structure", next: "Pulses", tip: "Needs cool dry weather", emoji: "🌿" },
    { name: "Peas", ta: "பட்டாணி", soil: "Light loam", water: "Low", days: "90–110", gains: "Fixes nitrogen", next: "Wheat / Maize", tip: "Avoid water stagnation", emoji: "🫛" },
    { name: "Garlic", ta: "வெள்ளை பூண்டு", soil: "Loose soil", water: "Medium", days: "150–180", gains: "Light feeder", next: "Vegetables", tip: "Needs well-aerated soil", emoji: "🧄" },
  ],
  summer: [
    { name: "Watermelon", ta: "தர்பூஸ்", soil: "Sandy loam", water: "Medium", days: "80–95", gains: "Covers soil surface", next: "Pulses", tip: "Needs high sunlight", emoji: "🍉" },
    { name: "Cowpea", ta: "தட்டைப் பயறு", soil: "Any", water: "Low", days: "70–90", gains: "High nitrogen fixing", next: "Cereals", tip: "Very heat tolerant", emoji: "🌱" },
    { name: "Green gram", ta: "பாசிப்பயறு", soil: "Light soil", water: "Low", days: "60–75", gains: "Restores soil", next: "Wheat", tip: "Good for drylands", emoji: "🫘" },
    { name: "Sesame", ta: "எள்ளு", soil: "Well drained", water: "Low", days: "90–110", gains: "Deep roots loosen soil", next: "Vegetables", tip: "Avoid heavy rains", emoji: "🌿" },
  ],
};

const fallbackSeasons = [
  { id: "kharif", emoji: "🌧️", labelEn: "Kharif", subEn: "Jun – Oct", labelTa: "காரிப்", subTa: "ஜூன்–அக்" },
  { id: "rabi", emoji: "❄️", labelEn: "Rabi", subEn: "Nov – Feb", labelTa: "ரபி", subTa: "நவ்–பிப்" },
  { id: "summer", emoji: "☀️", labelEn: "Summer", subEn: "Mar – May", labelTa: "கோடை", subTa: "மார்–மே" },
];

const waterColors = { High: "#DBEAFE", Medium: "#D1FAE5", Low: "#FEF9C3" };
const waterText = { High: "#1D4ED8", Medium: "#065F46", Low: "#92400E" };

export default function CropPlanner() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [season, setSeason] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [crops, setCrops] = useState(fallbackCrops);
  const [seasons, setSeasons] = useState(fallbackSeasons);

  useEffect(() => {
    async function loadPlanner() {
      try {
        const data = await api.get("/content/cropPlanner");
        setCrops(data.crops || fallbackCrops);
        setSeasons(data.seasons || fallbackSeasons);
      } catch {
        setCrops(fallbackCrops);
        setSeasons(fallbackSeasons);
      }
    }
    loadPlanner();
  }, []);

  const list = crops[season] || [];

  return (
    <Layout title={t ? "பயிர் திட்டமிடல்" : "Crop Planner"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Season Selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 20 }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t ? "பருவகாலம் தேர்வு" : "Growing Season"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {seasons.map(({ id, emoji, labelEn, subEn, labelTa, subTa }) => {
              const active = season === id;
              return (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { setSeason(id); setExpanded(null); }}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 16, border: active ? "none" : "1.5px solid #E5E7EB",
                    background: active ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                    cursor: "pointer",
                    boxShadow: active ? "0 6px 20px rgba(47,128,237,0.35)" : "0 2px 6px rgba(0,0,0,0.05)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: active ? "#fff" : "#111827", marginBottom: 2 }}>
                    {t ? labelTa : labelEn}
                  </p>
                  <p style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}>
                    {t ? subTa : subEn}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Crop List */}
        {list.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t ? "பரிந்துரைத்த பயிர்கள்" : "Recommended Crops"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {list.map((c, i) => {
                const open = expanded === i;
                return (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                      border: open ? "1.5px solid #2F80ED" : "1px solid #E5E7EB",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setExpanded(open ? null : i)}
                      style={{
                        width: "100%", padding: "14px 16px",
                        display: "flex", alignItems: "center", gap: 12,
                        background: "none", border: "none", cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: "linear-gradient(135deg, #EBF4FF, #EDFBF1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22, flexShrink: 0,
                      }}>
                        {c.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                          {t ? c.ta : c.name}
                        </p>
                        <p style={{ fontSize: 12, color: "#6B7280" }}>
                          📆 {c.days} days · 🌱 {c.soil}
                        </p>
                      </div>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: open ? "#EBF4FF" : "#F3F4F6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {open ? <ChevronUp size={14} color="#2F80ED" /> : <ChevronDown size={14} color="#6B7280" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <span style={{
                                padding: "4px 10px", borderRadius: 20,
                                background: waterColors[c.water] || "#F3F4F6",
                                color: waterText[c.water] || "#374151",
                                fontSize: 12, fontWeight: 600,
                              }}>
                                💧 {t ? "நீர்" : "Water"}: {c.water}
                              </span>
                              <span style={{ padding: "4px 10px", borderRadius: 20, background: "#F3F4F6", color: "#374151", fontSize: 12, fontWeight: 600 }}>
                                📆 {c.days} days
                              </span>
                            </div>
                            {[
                              { label: t ? "மண்ணுக்கு பயன்" : "Soil Benefit", val: c.gains, icon: "🌱" },
                              { label: t ? "அடுத்து விதைக்கலாம்" : "Next Crop", val: c.next, icon: "🔁" },
                            ].map(({ label, val, icon }) => (
                              <div key={label} style={{ background: "#F7F9FC", borderRadius: 12, padding: "10px 12px" }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 }}>
                                  {icon} {label}
                                </p>
                                <p style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{val}</p>
                              </div>
                            ))}
                            <div style={{
                              background: "linear-gradient(135deg, #EBF4FF, #EDFBF1)",
                              borderRadius: 12, padding: "10px 12px",
                              border: "1px solid #BFDBFE",
                            }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 }}>
                                💡 {t ? "லாப அறிவுரை" : "Pro Tip"}
                              </p>
                              <p style={{ fontSize: 13, color: "#1E40AF", fontWeight: 500 }}>{c.tip}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!season && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗓️</div>
            <p style={{ fontSize: 14 }}>
              {t ? "பருவகாலம் தேர்வு செய்து பயிர் பட்டியலை காணுங்கள்" : "Select a season above to view crop recommendations"}
            </p>
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
