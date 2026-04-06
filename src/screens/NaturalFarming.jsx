import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { api } from "../lib/api";


const cropNames = {
  paddy: { en: "Paddy", ta: "நெல்" },
  banana: { en: "Banana", ta: "வாழை" },
  tomato: { en: "Tomato", ta: "தக்காளி" },
  groundnut: { en: "Groundnut", ta: "நிலக்கடலை" },
  cotton: { en: "Cotton", ta: "பருத்தி" },
  sugarcane: { en: "Sugarcane", ta: "கரும்பு" },
  maize: { en: "Maize", ta: "மக்காச்சோளம்" },
  chilli: { en: "Chilli", ta: "மிளகாய்" },
  brinjal: { en: "Brinjal", ta: "கத்தரிக்காய்" },
  coconut: { en: "Coconut", ta: "தேங்காய்" },
  mango: { en: "Mango", ta: "மாம்பழம்" },
  onion: { en: "Onion", ta: "வெங்காயம்" },
};
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
    prep: {
      en: ["Add milk, curd, ghee", "Ferment for 7 days", "Dilute before spraying"],
      ta: ["பால், தயிர், நெய் சேர்க்கவும்", "7 நாட்கள் ஊறவிடவும்", "தெளிக்கும் முன் நீருடன் கலக்கவும்"],
    },
    apply: { en: "Every 20 days", ta: "20 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Store in shade", ta: "நிழலில் சேமிக்கவும்" },
    benefit: { en: "Improves fruit size", ta: "பழ அளவு அதிகரிக்கும்" },
  },

  tomato: {
    emoji: "🍅",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: {
      en: ["Cow dung mix", "Ferment 24 hours"],
      ta: ["மாட்டு சாண கலவை", "24 மணி நேரம் ஊறவிடவும்"],
    },
    apply: { en: "Every 10 days", ta: "10 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Wear mask", ta: "முக கவசம் அணியவும்" },
    benefit: { en: "Better disease resistance", ta: "நோய் எதிர்ப்பு அதிகரிக்கும்" },
  },

  groundnut: {
    emoji: "🥜",
    fert: { en: "Vermicompost", ta: "வெர்மி கம்போஸ்ட்" },
    prep: {
      en: ["Mix before sowing", "Add neem cake"],
      ta: ["விதைப்பு முன் கலக்கவும்", "வேப்பம் பிண்ணாக்கு சேர்க்கவும்"],
    },
    apply: { en: "Before sowing", ta: "விதைப்பு முன்" },
    safety: { en: "Maintain moisture", ta: "ஈரப்பதம் பராமரிக்கவும்" },
    benefit: { en: "Strong root growth", ta: "வேர் வளர்ச்சி மேம்படும்" },
  },

  cotton: {
    emoji: "🪴",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: {
      en: ["Cow dung + jaggery", "Ferment 24 hours"],
      ta: ["மாட்டு சாணம் + கருப்பட்டி", "24 மணி நேரம் ஊறவிடவும்"],
    },
    apply: { en: "Every 15 days", ta: "15 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Avoid sunlight storage", ta: "வெயிலில் வைக்காதீர்கள்" },
    benefit: { en: "Reduces cost", ta: "செலவு குறையும்" },
  },

  sugarcane: {
    emoji: "🌿",
    fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" },
    prep: {
      en: ["Ferment 7 days", "Add jaggery"],
      ta: ["7 நாட்கள் ஊறவிடவும்", "கருப்பட்டி சேர்க்கவும்"],
    },
    apply: { en: "Every 20 days", ta: "20 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Keep away from children", ta: "குழந்தைகள் அருகில் வைக்காதீர்கள்" },
    benefit: { en: "Improves sweetness", ta: "இனிப்புத்தன்மை உயரும்" },
  },

  maize: {
    emoji: "🌽",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: {
      en: ["Ferment 24 hours", "Mix in irrigation"],
      ta: ["24 மணி நேரம் ஊறவிடவும்", "நீர்ப்பாசனத்தில் கலக்கவும்"],
    },
    apply: { en: "Every 12 days", ta: "12 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Spray evening", ta: "மாலையில் தெளிக்கவும்" },
    benefit: { en: "Improves cob filling", ta: "கதிர் நிரப்பு மேம்படும்" },
  },

  chilli: {
    emoji: "🌶️",
    fert: { en: "Fish Amino Acid", ta: "மீன் அமினோ அமிலம்" },
    prep: {
      en: ["Fish waste + jaggery", "Ferment 10 days"],
      ta: ["மீன் கழிவு + கருப்பட்டி", "10 நாட்கள் ஊறவிடவும்"],
    },
    apply: { en: "Every 7 days", ta: "7 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Avoid over spraying", ta: "அதிகமாக தெளிக்க வேண்டாம்" },
    benefit: { en: "Improves flowering", ta: "பூக்கும் திறன் உயரும்" },
  },

  brinjal: {
    emoji: "🍆",
    fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" },
    prep: {
      en: ["Milk + curd + ghee", "Ferment 7 days"],
      ta: ["பால் + தயிர் + நெய்", "7 நாட்கள் ஊறவிடவும்"],
    },
    apply: { en: "Every 15 days", ta: "15 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Use diluted spray", ta: "நீரில் கலந்தே தெளிக்கவும்" },
    benefit: { en: "Boosts fruit size", ta: "காய் அளவு அதிகரிக்கும்" },
  },

  coconut: {
    emoji: "🥥",
    fert: { en: "Vermicompost", ta: "வெர்மி கம்போஸ்ட்" },
    prep: {
      en: ["Apply near root", "Cover with mulch"],
      ta: ["வேர் பகுதியில் இடவும்", "மூல்சிங் செய்யவும்"],
    },
    apply: { en: "Every 30 days", ta: "30 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Water after applying", ta: "இட்ட பின் நீர் ஊற்றவும்" },
    benefit: { en: "Improves nut size", ta: "தேங்காய் அளவு உயரும்" },
  },

  mango: {
    emoji: "🥭",
    fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" },
    prep: {
      en: ["Ferment 7 days", "Dilute before spray"],
      ta: ["7 நாட்கள் ஊறவிடவும்", "தெளிக்கும் முன் கலக்கவும்"],
    },
    apply: { en: "Every 25 days", ta: "25 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Spray morning", ta: "காலை தெளிக்கவும்" },
    benefit: { en: "Improves fruit sweetness", ta: "பழ இனிப்பு உயரும்" },
  },

  onion: {
    emoji: "🧅",
    fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" },
    prep: {
      en: ["Cow dung + jaggery", "Ferment 24 hours"],
      ta: ["மாட்டு சாணம் + கருப்பட்டி", "24 மணி நேரம் ஊறவிடவும்"],
    },
    apply: { en: "Every 10 days", ta: "10 நாட்களுக்கு ஒருமுறை" },
    safety: { en: "Avoid over watering", ta: "அதிக நீர் விட வேண்டாம்" },
    benefit: { en: "Improves bulb size", ta: "கிழங்கு அளவு உயரும்" },
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

        setFarmingData({
          ...fallbackFarmingData,
          ...(data || {}),
        });
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10 }}>
            {t ? "பயிர் தேர்வு" : "Select Crop"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {crops.map((c) => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(c)}
                style={{
                  padding: "12px 8px",
                  borderRadius: 16,
                  border: selected === c ? "none" : "1.5px solid #E5E7EB",
                  background: selected === c ? "linear-gradient(135deg,#2F80ED,#27AE60)" : "#fff",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24 }}>{farmingData[c].emoji}</div>
                <p style={{ fontSize: 12, fontWeight: 600 }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {info && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ background: "#fff", borderRadius: 18, padding: 16 }}>
                <p>🌿 <b>{t ? info.fert.ta : info.fert.en}</b></p>
              </div>

              <div style={{ background: "#fff", borderRadius: 18, padding: 16 }}>
                {(t ? info.prep.ta : info.prep.en).map((step, i) => (
                  <p key={i}>{i + 1}. {step}</p>
                ))}
              </div>

              <div style={{ background: "#FEF9C3", borderRadius: 16, padding: 16 }}>
                📅 {t ? info.apply.ta : info.apply.en}
              </div>

              <div style={{ background: "#FFF5F5", borderRadius: 16, padding: 16 }}>
                ⚠️ {t ? info.safety.ta : info.safety.en}
              </div>

              <div style={{ background: "#EDFBF1", borderRadius: 16, padding: 16 }}>
                ✅ {t ? info.benefit.ta : info.benefit.en}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}