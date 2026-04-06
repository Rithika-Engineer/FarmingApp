import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import Layout from "../components/Layout";
import { Volume2 } from "lucide-react";
import { api } from "../lib/api";

const fallbackCropNameTa = {
  Paddy: "நெல்",
  Maize: "சோளம்",
  Groundnut: "நிலக்கடலை",
  Cotton: "பருத்தி",
  Soybean: "சோயாபீன்",
  Chilli: "மிளகாய்",
  Wheat: "கோதுமை",
  Mustard: "கடுகு",
  Onion: "வெங்காயம்",
  Peas: "பட்டாணி",
  Watermelon: "தர்பூசணி",
  Sesame: "எள்",
  "Green gram": "பச்சைப்பயறு",
  Cowpea: "தட்டைப் பயறு",
};

const fallbackCropData = {
  Paddy: {
    soil: "Clay / Loamy",
    water: "High",
    days: "120–150",
    next: "Pulses / Sesame",
    emoji: "🌾",
    speakEn: "Paddy requires high water. Ensure proper irrigation.",
    speakTa: "நெல் பயிருக்கு அதிக நீர் தேவைப்படுகிறது.",
  },
  Maize: {
    soil: "Well drained",
    water: "Medium",
    days: "90–110",
    next: "Green gram",
    emoji: "🌽",
    speakEn: "Maize is a high income crop.",
    speakTa: "சோளம் நல்ல வருமானம் தரும் பயிர்.",
  },
  Groundnut: {
    soil: "Sandy loam",
    water: "Low",
    days: "100–120",
    next: "Rice / Maize",
    emoji: "🥜",
    speakEn: "Groundnut fixes nitrogen.",
    speakTa: "நிலக்கடலை நைட்ரஜன் நிர்ணயிக்கும்.",
  },
  Wheat: {
    soil: "Loam",
    water: "Medium",
    days: "120–140",
    next: "Paddy / Maize",
    emoji: "🌾",
    speakEn: "Wheat needs timely sowing.",
    speakTa: "கோதுமை சரியான நேரத்தில் விதைக்க வேண்டும்.",
  },
  Watermelon: {
    soil: "Sandy loam",
    water: "Medium",
    days: "80–95",
    next: "Pulses",
    emoji: "🍉",
    speakEn: "Watermelon needs high sunlight.",
    speakTa: "தர்பூசணிக்கு அதிக வெயில் தேவை.",
  },
};

const fallbackSeasonMeta = {
  kharif: {
    emoji: "🌧️",
    labelEn: "Kharif",
    labelTa: "காரிப்",
    crops: ["Paddy", "Maize", "Groundnut", "Cotton", "Soybean", "Chilli"],
  },
  rabi: {
    emoji: "❄️",
    labelEn: "Rabi",
    labelTa: "ரபி",
    crops: ["Wheat", "Mustard", "Onion", "Peas"],
  },
  summer: {
    emoji: "☀️",
    labelEn: "Summer",
    labelTa: "கோடை",
    crops: ["Watermelon", "Sesame", "Green gram", "Cowpea"],
  },
};

const seasonMonths = {
  kharif: "Jun – Oct",
  rabi: "Nov – Feb",
  summer: "Mar – May",
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

    const msg = new SpeechSynthesisUtterance(
      t ? info.speakTa : info.speakEn
    );
    msg.lang = t ? "ta-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  return (
    <Layout title={t ? "பருவகால பயிர்கள்" : "Season Crops"}>
      <div style={{ padding: "16px 16px 0" }}>
        {/* Season Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {Object.entries(seasonMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => {
                setSeason(key);
                setCrop(null);
              }}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 14,
                border: "none",
                color: season === key ? "#fff" : "#222",
                background:
                  season === key
                    ? "linear-gradient(135deg,#2F80ED,#27AE60)"
                    : "#fff",
              }}
            >
              {meta.emoji}
              <div>{t ? meta.labelTa : meta.labelEn}</div>
            </button>
          ))}
        </div>

        {/* Season Info Banner */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 14,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p>
            📅 Current Season:{" "}
            <b>{t ? seasonMeta[season].labelTa : seasonMeta[season].labelEn}</b>
          </p>
          <p>
            🗓 Months: <b>{seasonMonths[season]}</b>
          </p>
          <p>
            🌾 Total Crops: <b>{seasonMeta[season].crops.length}</b>
          </p>
          <p>
            ⭐ Best Crop: <b>{seasonMeta[season].crops[0]}</b>
          </p>
        </div>

        {/* ✅ UPDATED CHIP BUTTON UI */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {seasonMeta[season].crops.map((c) => {
            const info = cropData[c];
            const active = crop === c;

            return (
              <button
                key={c}
                onClick={() => setCrop(c)}
                style={{
                  border: active ? "2px solid #27AE60" : "1px solid #ddd",
                  background: active ? "#f6fff8" : "#fff",
                  borderRadius: 999,
                  padding: "10px 14px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {info?.emoji || "🌾"} {t ? cropNameTa[c] || c : c}
              </button>
            );
          })}
        </div>

        {/* Crop Detail */}
        {crop && cropData[crop] && (
          <div
            style={{
              background: "#fff",
              marginTop: 16,
              padding: 16,
              borderRadius: 16,
            }}
          >
            <h3>
              {cropData[crop].emoji} {t ? cropNameTa[crop] : crop}
            </h3>
            <p>🌱 Soil: {cropData[crop].soil}</p>
            <p>💧 Water: {cropData[crop].water}</p>
            <p>📆 Days: {cropData[crop].days}</p>
            <p>🔁 Next: {cropData[crop].next}</p>

            <button onClick={() => speak(crop)} style={{ marginTop: 10 }}>
              <Volume2 size={16} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}