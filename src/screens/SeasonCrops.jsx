import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import Layout from "../components/Layout";

const fallbackCropNameTa = {
  Paddy: "நெல்",
  Maize: "மக்காச்சோளம்",
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
    soil: { en: "Clay / Loamy", ta: "களிமண் / கலப்பு மண்" },
    water: { en: "High", ta: "அதிகம்" },
    days: "120–150",
    emoji: "🌾",
    whyBest: {
      en: "Best for Kharif because high rainfall and standing water improve tillering and grain filling.",
      ta: "அதிக மழை மற்றும் நீர் தேக்கம் நெல் வளர்ச்சிக்கு மிகவும் உகந்தது.",
    },
    whyOthersLess: {
      en: "Cotton and chilli require better drainage and less water.",
      ta: "பருத்தி மற்றும் மிளகாய் குறைந்த நீர் மற்றும் நல்ல வடிகால் தேவை.",
    },
  },

  Maize: {
    soil: { en: "Well drained", ta: "நன்றாக வடிகால் மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "90–110",
    emoji: "🌽",
    whyBest: {
      en: "Fast growing crop with strong market demand.",
      ta: "வேகமாக வளரும் மற்றும் சந்தை தேவை அதிகம்.",
    },
    whyOthersLess: {
      en: "Paddy needs more water.",
      ta: "நெல் அதிக நீர் தேவைப்படும்.",
    },
  },

  Groundnut: {
    soil: { en: "Sandy Loam", ta: "மணற்பான்மை கலப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "100–110",
    emoji: "🥜",
    whyBest: {
      en: "Excellent oilseed crop for sandy soil and moderate heat.",
      ta: "மணற்பான்மை மண்ணில் மற்றும் மிதமான வெப்பத்தில் சிறந்த எண்ணெய் விதை பயிர்.",
    },
    whyOthersLess: {
      en: "Paddy requires more water.",
      ta: "நெல் அதிக நீர் தேவைப்படும்.",
    },
  },

  Cotton: {
    soil: { en: "Black Soil", ta: "கருப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "150–170",
    emoji: "🧵",
    whyBest: {
      en: "Best in black soil with moderate rainfall.",
      ta: "கருப்பு மண்ணிலும் மிதமான மழையிலும் சிறந்தது.",
    },
    whyOthersLess: {
      en: "Short duration crops give less profit.",
      ta: "குறுகிய கால பயிர்கள் குறைந்த லாபம் தரும்.",
    },
  },

  Soybean: {
    soil: { en: "Loamy", ta: "கலப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "95–110",
    emoji: "🫘",
    whyBest: {
      en: "Profitable oilseed crop with nitrogen fixing benefit.",
      ta: "நைட்ரஜன் சேர்க்கும் திறன் கொண்ட லாபகரமான எண்ணெய் விதை பயிர்.",
    },
    whyOthersLess: {
      en: "Water-heavy crops reduce yield.",
      ta: "அதிக நீர் பயிர்கள் விளைச்சலை குறைக்கும்.",
    },
  },

  Chilli: {
    soil: { en: "Red Soil", ta: "சிவப்பு மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "120–140",
    emoji: "🌶️",
    whyBest: {
      en: "High market demand and drought tolerance.",
      ta: "சந்தை தேவை அதிகம் மற்றும் வறட்சியை தாங்கும்.",
    },
    whyOthersLess: {
      en: "Paddy needs high water.",
      ta: "நெல் அதிக நீர் தேவைப்படும்.",
    },
  },

  Wheat: {
    soil: { en: "Loam", ta: "கலப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "120–140",
    emoji: "🌾",
    whyBest: {
      en: "Cool Rabi climate supports grain formation.",
      ta: "குளிரான ரபி காலநிலை தானிய உருவாக்கத்திற்கு உதவும்.",
    },
    whyOthersLess: {
      en: "Summer crops fail in winter cold.",
      ta: "கோடை பயிர்கள் குளிரில் வளரவியலாது.",
    },
  },

  Mustard: {
    soil: { en: "Sandy", ta: "மணல் மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "100–110",
    emoji: "🌼",
    whyBest: {
      en: "Best winter oilseed crop.",
      ta: "சிறந்த குளிர்கால எண்ணெய் விதை பயிர்.",
    },
    whyOthersLess: {
      en: "Heavy water crops lose yield.",
      ta: "அதிக நீர் பயிர்கள் விளைச்சல் குறையும்.",
    },
  },

  Onion: {
    soil: { en: "Loamy", ta: "கலப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "90–110",
    emoji: "🧅",
    whyBest: {
      en: "Strong winter market crop.",
      ta: "குளிர்காலத்தில் நல்ல சந்தை மதிப்பு.",
    },
    whyOthersLess: {
      en: "Rain-heavy crops not suitable.",
      ta: "அதிக மழை பயிர்கள் பொருத்தமில்லை.",
    },
  },

  Peas: {
    soil: { en: "Loamy", ta: "கலப்பு மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "90–100",
    emoji: "🫛",
    whyBest: {
      en: "Short duration winter profit crop.",
      ta: "குறுகிய கால குளிர்கால லாப பயிர்.",
    },
    whyOthersLess: {
      en: "Long crops delay next season.",
      ta: "நீண்டகால பயிர்கள் அடுத்த பருவத்தை தாமதப்படுத்தும்.",
    },
  },

  Watermelon: {
    soil: { en: "Sandy loam", ta: "மணற்பான்மை கலப்பு மண்" },
    water: { en: "Medium", ta: "மிதமான" },
    days: "80–95",
    emoji: "🍉",
    whyBest: {
      en: "High summer sunlight improves sweetness.",
      ta: "கோடை வெயில் இனிப்பை அதிகரிக்கும்.",
    },
    whyOthersLess: {
      en: "Water-loving crops lose yield in heat.",
      ta: "அதிக நீர் பயிர்கள் வெயிலில் குறையும்.",
    },
  },

  Sesame: {
    soil: { en: "Sandy", ta: "மணல் மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "85–95",
    emoji: "🌱",
    whyBest: {
      en: "Highly heat tolerant oilseed crop.",
      ta: "வெப்பத்தை தாங்கும் சிறந்த எண்ணெய் விதை பயிர்.",
    },
    whyOthersLess: {
      en: "Other crops need more irrigation.",
      ta: "மற்ற பயிர்களுக்கு அதிக பாசனம் தேவை.",
    },
  },

  "Green gram": {
    soil: { en: "Loamy", ta: "கலப்பு மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "65–75",
    emoji: "🟢",
    whyBest: {
      en: "Short duration pulse crop improves soil nitrogen.",
      ta: "குறுகிய கால பயிர் மண்ணில் நைட்ரஜனை அதிகரிக்கும்.",
    },
    whyOthersLess: {
      en: "Long crops reduce summer efficiency.",
      ta: "நீண்ட பயிர்கள் கோடை பயன்திறனை குறைக்கும்.",
    },
  },

  Cowpea: {
    soil: { en: "Sandy", ta: "மணல் மண்" },
    water: { en: "Low", ta: "குறைவு" },
    days: "70–80",
    emoji: "🫘",
    whyBest: {
      en: "Fast summer crop with soil fertility improvement.",
      ta: "மண் வளத்தை மேம்படுத்தும் வேகமான கோடை பயிர்.",
    },
    whyOthersLess: {
      en: "Heavy water crops are less suitable.",
      ta: "அதிக நீர் பயிர்கள் பொருத்தமில்லை.",
    },
  },
};

const fallbackSeasonMeta = {
  kharif: {
    emoji: "🌧️",
    labelEn: "Kharif",
    labelTa: "காரிஃப்",
    crops: ["Paddy", "Maize"],
  },
  rabi: {
    emoji: "❄️",
    labelEn: "Rabi",
    labelTa: "ரபி",
    crops: ["Wheat", "Mustard"],
  },
  summer: {
    emoji: "☀️",
    labelEn: "Summer",
    labelTa: "கோடை",
    crops: ["Watermelon", "Sesame"],
  },
};

export default function SeasonCrops() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [season, setSeason] = useState("kharif");
  const [crop, setCrop] = useState("Paddy");

  const cropData = fallbackCropData[crop];

  return (
    <Layout title={t ? "பருவ பயிர்கள்" : "Season Crops"}>
      <div style={{ padding: 18, background: "#F8FAFC", minHeight: "100vh" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {Object.entries(fallbackSeasonMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => {
                setSeason(key);
                setCrop(meta.crops[0]);
              }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 18,
                border: "none",
                color: season === key ? "#fff" : "#111",
                background:
                  season === key
                    ? "linear-gradient(135deg,#3B82F6,#10B981)"
                    : "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                fontWeight: 700,
              }}
            >
              {meta.emoji} {t ? meta.labelTa : meta.labelEn}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {fallbackSeasonMeta[season].crops.map((c) => (
            <button
              key={c}
              onClick={() => setCrop(c)}
              style={{
                borderRadius: 999,
                padding: "10px 16px",
                border: crop === c ? "2px solid #16A34A" : "1px solid #ddd",
                background: crop === c ? "#ECFDF5" : "#fff",
                fontWeight: 600,
              }}
            >
              {(fallbackCropData[c]?.emoji || "🌾")}{" "}
              {t ? fallbackCropNameTa[c] || c : c}
            </button>
          ))}
        </div>

        {crop && cropData && (
          <div
            style={{
              background: "#fff",
              marginTop: 18,
              padding: 20,
              borderRadius: 22,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <h2>
              {cropData.emoji} {t ? fallbackCropNameTa[crop] || crop : crop}
            </h2>

            <div style={{ display: "grid", gap: 8 }}>
              <p>🌱 {t ? "மண்" : "Soil"}: {t ? cropData.soil.ta : cropData.soil.en}</p>
              <p>💧 {t ? "நீர்" : "Water"}: {t ? cropData.water.ta : cropData.water.en}</p>
              <p>📆 {t ? "நாட்கள்" : "Days"}: {cropData.days}</p>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                padding: 14,
                borderRadius: 16,
                marginTop: 14,
              }}
            >
              <p><b>{t ? "✅ ஏன் சிறந்தது?" : "✅ Why Best?"}</b></p>
              <p>{t ? cropData.whyBest.ta : cropData.whyBest.en}</p>
            </div>

            <div
              style={{
                background: "#FEF2F2",
                padding: 14,
                borderRadius: 16,
                marginTop: 14,
              }}
            >
              <p><b>{t ? "⚠️ ஏன் மற்றவை குறைவு?" : "⚠️ Why Others Less Suitable?"}</b></p>
              <p>{t ? cropData.whyOthersLess.ta : cropData.whyOthersLess.en}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}