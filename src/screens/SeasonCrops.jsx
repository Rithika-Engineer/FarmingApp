import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { Volume2 } from "lucide-react";
import { api } from "../lib/api";

const fallbackCropNameTa = {
  Paddy: "நெல்", Maize: "சோளம்", Groundnut: "நிலக்கடலை",
  Cotton: "பருத்தி", Soybean: "சோயாபீன்", Chilli: "மிளகாய்",
  Wheat: "கோதுமை", Mustard: "கடுகு", Onion: "வெங்காயம்",
  Peas: "பட்டாணி", Watermelon: "தர்பூசணி", Sesame: "எள்",
  "Green gram": "பச்சைப்பயறு", Cowpea: "தட்டைப் பயறு",
};

const fallbackCropData = {
  Paddy: { soil: "Clay / Loamy", water: "High", days: "120–150", next: "Pulses / Sesame", emoji: "🌾", speakEn: "Paddy requires high water. Ensure proper irrigation.", speakTa: "நெல் பயிருக்கு அதிக நீர் தேவைப்படுகிறது." },
  Maize: { soil: "Well drained", water: "Medium", days: "90–110", next: "Green gram", emoji: "🌽", speakEn: "Maize is a high income crop. Ensure weed control.", speakTa: "சோளம் நல்ல வருமானம் தரும் பயிர்." },
  Groundnut: { soil: "Sandy loam", water: "Low", days: "100–120", next: "Rice / Maize", emoji: "🥜", speakEn: "Groundnut fixes nitrogen. Great for rotation.", speakTa: "நிலக்கடலை நைட்ரஜன் நிர்ணயிக்கும். சுழற்சிக்கு சிறந்தது." },
  Cotton: { soil: "Black soil", water: "Medium", days: "150–180", next: "Groundnut", emoji: "☁️", speakEn: "Cotton grows well in black soil.", speakTa: "பருத்தி கரிமண்ணில் நன்றாக வளரும்." },
  Wheat: { soil: "Loam", water: "Medium", days: "120–140", next: "Paddy / Maize", emoji: "🌾", speakEn: "Wheat needs timely sowing.", speakTa: "கோதுமை சரியான நேரத்தில் விதைக்க வேண்டும்." },
  Watermelon: { soil: "Sandy loam", water: "Medium", days: "80–95", next: "Pulses", emoji: "🍉", speakEn: "Watermelon needs high sunlight.", speakTa: "தர்பூசணிக்கு அதிக வெயில் தேவை." },
};

const fallbackSeasonMeta = {
  kharif: { emoji: "🌧️", labelEn: "Kharif", labelTa: "காரிப்", crops: ["Paddy", "Maize", "Groundnut", "Cotton", "Soybean", "Chilli"] },
  rabi: { emoji: "❄️", labelEn: "Rabi", labelTa: "ரபி", crops: ["Wheat", "Mustard", "Onion", "Peas"] },
  summer: { emoji: "☀️", labelEn: "Summer", labelTa: "கோடை", crops: ["Watermelon", "Sesame", "Green gram", "Cowpea"] },
};

export default function SeasonCrops() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [season, setSeason] = useState("kharif");
  const [crop, setCrop] = useState(null);
  const [cropNameTa, setCropNameTa] = useState(fallbackCropNameTa);
  const [cropData, setCropData] = useState(fallbackCropData);
  const [seasonMeta, setSeasonMeta] = useState(fallbackSeasonMeta);

  useEffect(() => {
    async function loadSeasonData() {
      try {
        const data = await api.get("/content/seasonCrops");
        setCropNameTa(data.cropNameTa || fallbackCropNameTa);
        setCropData(data.cropData || fallbackCropData);
        setSeasonMeta(data.seasonMeta || fallbackSeasonMeta);
      } catch {
        setCropNameTa(fallbackCropNameTa);
        setCropData(fallbackCropData);
        setSeasonMeta(fallbackSeasonMeta);
      }
    }
    loadSeasonData();

    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) setSeason("kharif");
    else if (m >= 11 || m <= 2) setSeason("rabi");
    else setSeason("summer");
  }, []);

  function speak(c) {
    const info = cropData[c];
    if (!info) return;
    const msg = new SpeechSynthesisUtterance(t ? info.speakTa : info.speakEn);
    msg.lang = t ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(msg);
  }

  return (
    <Layout title={t ? "பருவகால பயிர்கள்" : "Season Crops"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Season Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(seasonMeta).map(([key, { emoji, labelEn, labelTa }]) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.93 }}
                onClick={() => { setSeason(key); setCrop(null); }}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 14,
                  border: season === key ? "none" : "1.5px solid #E5E7EB",
                  background: season === key ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                  cursor: "pointer",
                  boxShadow: season === key ? "0 4px 14px rgba(47,128,237,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>{emoji}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: season === key ? "#fff" : "#374151" }}>
                  {t ? labelTa : labelEn}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Crop Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t ? "பரிந்துரைக்கப்பட்ட பயிர்கள்" : "Recommended Crops"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
            {seasonMeta[season].crops.map((c, i) => {
              const info = cropData[c];
              const sel = crop === c;
              return (
                <motion.button
                  key={c}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { setCrop(c); localStorage.setItem("lastCrop", c); }}
                  style={{
                    padding: "14px 12px",
                    borderRadius: 16,
                    border: sel ? "none" : "1.5px solid #E5E7EB",
                    background: sel ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                    cursor: "pointer",
                    boxShadow: sel ? "0 6px 18px rgba(47,128,237,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{info?.emoji || "🌾"}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: sel ? "#fff" : "#111827", marginBottom: 2 }}>
                    {t ? (cropNameTa[c] || c) : c}
                  </p>
                  {info && (
                    <p style={{ fontSize: 10, color: sel ? "rgba(255,255,255,0.75)" : "#6B7280" }}>
                      ⏱ {info.days} days
                    </p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Crop Detail */}
        <AnimatePresence mode="wait">
          {crop && cropData[crop] && (
            <motion.div
              key={crop}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                background: "#fff", borderRadius: 20,
                padding: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #E5E7EB",
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {t ? "பயிர் விவரம்" : "Crop Details"}
                  </p>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "4px 0 0" }}>
                    {cropData[crop].emoji} {t ? (cropNameTa[crop] || crop) : crop}
                  </h3>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speak(crop)}
                  style={{
                    background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                    border: "none", borderRadius: 10, padding: "8px 12px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    boxShadow: "0 4px 12px rgba(47,128,237,0.3)",
                  }}
                >
                  <Volume2 size={14} color="#fff" />
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Speak</span>
                </motion.button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: t ? "மண்" : "Soil", val: cropData[crop].soil },
                  { label: t ? "நீர்" : "Water", val: cropData[crop].water },
                  { label: t ? "நாட்கள்" : "Days", val: cropData[crop].days },
                  { label: t ? "அடுத்த பயிர்" : "Next Crop", val: cropData[crop].next },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: "#F7F9FC", borderRadius: 12, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
