import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { api } from "../lib/api";

// ✅ Local image imports
import stemBoreImg from "./images/stem bore.jpg";
import fallArmywormImg from "./images/fallarmyworn image.jpg";
import fruitFlyImg from "./images/fruit fly image.webp";
import whiteflyImg from "./images/whitefly pest.jpg";

const fallbackPests = [
  {
    nameEn: "Stem Borer",
    nameTa: "தண்டு துளைப்பான்",
    emoji: "🐛",
    crop: "Paddy",
    image: stemBoreImg,
    symptoms: "Dead heart in young plants, white ear in mature plants",
    symptomsTa: "இளம் தாவரங்களில் இறந்த மையம்",
    disease: "Stem damage and yield loss",
    diseaseTa: "தண்டு சேதம் மற்றும் விளைச்சல் இழப்பு",
    prevention: "Use pheromone traps and balanced irrigation",
    preventionTa: "பெரோமோன் பொறி மற்றும் நீர் கட்டுப்பாடு",
    treatment: "Neem oil spray",
    treatmentTa: "வேப்பெண்ணெய் தெளி",
    preparationSteps: [
      "Take 1 litre water",
      "Add 5ml neem oil",
      "Add few drops liquid soap",
      "Mix well for 30 seconds",
      "Use fresh immediately",
    ],
    usage: "Spray every 7 days",
    usageTa: "7 நாட்களுக்கு ஒருமுறை தெளிக்கவும்",
  },
  {
    nameEn: "Fall Armyworm",
    nameTa: "படையெடுப்பு புழு",
    emoji: "🐛",
    crop: "Maize",
    image: fallArmywormImg,
    symptoms: "Leaf holes and frass",
    symptomsTa: "இலை துளைகள் மற்றும் கழிவு",
    disease: "Leaf destruction",
    diseaseTa: "இலை சேதம்",
    prevention: "Use pheromone traps",
    preventionTa: "பெரோமோன் பொறி",
    treatment: "Neem + chilli garlic spray",
    treatmentTa: "வேப்பெண்ணெய் + மிளகாய் பூண்டு",
    preparationSteps: [
      "Take 10 garlic cloves",
      "Add 5 dry chillies",
      "Grind into paste",
      "Mix with 1 litre water",
      "Add 5ml neem oil",
    ],
    usage: "Spray weekly",
    usageTa: "வாரத்திற்கு ஒருமுறை",
  },
  {
    nameEn: "Fruit Fly",
    nameTa: "பழ ஈ",
    emoji: "🪰",
    crop: "Watermelon",
    image: fruitFlyImg,
    symptoms: "Fruit rotting and punctures",
    symptomsTa: "பழத்தில் துளை மற்றும் அழுகல்",
    disease: "Fruit rot",
    diseaseTa: "பழ அழுகல்",
    prevention: "Use methyl eugenol traps",
    preventionTa: "பழ ஈ பொறி பயன்படுத்தவும்",
    treatment: "Neem seed kernel spray",
    treatmentTa: "வேப்பங்கொட்டை கரைசல்",
    preparationSteps: [
      "Take 100g neem seeds",
      "Crush well",
      "Soak overnight in 1 litre water",
      "Filter next day",
      "Spray on fruits",
    ],
    usage: "Spray every 5 days",
    usageTa: "5 நாட்களுக்கு ஒருமுறை",
  },
  {
    nameEn: "Whitefly",
    nameTa: "வெள்ளை ஈ",
    emoji: "🪰",
    crop: "Cotton",
    image: whiteflyImg,
    symptoms: "Leaf curling and yellowing",
    symptomsTa: "இலை சுருக்கு மற்றும் மஞ்சள்",
    disease: "Leaf curl virus",
    diseaseTa: "இலை சுருக்கு வைரஸ்",
    prevention: "Use sticky traps",
    preventionTa: "ஒட்டும் பொறி",
    treatment: "Neem oil soap spray",
    treatmentTa: "வேப்பெண்ணெய் + சோப்பு",
    preparationSteps: [
      "Take 1 litre water",
      "Add 5ml neem oil",
      "Add soap solution",
      "Shake bottle well",
      "Spray under leaves",
    ],
    usage: "Morning spray",
    usageTa: "காலை தெளிக்கவும்",
  },
];

export default function PestControl() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [pests, setPests] = useState(fallbackPests);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedPest, setDetectedPest] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadPests() {
      try {
        const data = await api.get("/content/pests");
        setPests(data.pests || fallbackPests);
      } catch {
        setPests(fallbackPests);
      }
    }
    loadPests();
  }, []);

  const openImagePicker = () => fileInputRef.current?.click();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    const randomPest = pests[Math.floor(Math.random() * pests.length)];
    setDetectedPest(randomPest);
  };

  const renderPestCard = (pest, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        marginTop: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={pest.image}
        alt={pest.nameEn}
        style={{
          width: "100%",
          height: 220,
          objectFit: "cover",
        }}
      />

      <div style={{ padding: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          {pest.emoji} {t ? pest.nameTa : pest.nameEn}
        </h2>

        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: 20,
            background: "#EEF2FF",
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          🌾 {pest.crop}
        </div>

        <p style={{ marginBottom: 8 }}>
          <b>⚠ Problem:</b> {t ? pest.symptomsTa : pest.symptoms}
        </p>
        <p style={{ marginBottom: 8 }}>
          <b>🦠 Disease:</b> {t ? pest.diseaseTa : pest.disease}
        </p>
        <p style={{ marginBottom: 8 }}>
          <b>🛡 Prevention:</b> {t ? pest.preventionTa : pest.prevention}
        </p>
        <p style={{ marginBottom: 12 }}>
          <b>🌿 Natural Solution:</b> {t ? pest.treatmentTa : pest.treatment}
        </p>

        <div
          style={{
            background: "linear-gradient(135deg,#ECFDF5,#F0FDF4)",
            padding: 16,
            borderRadius: 18,
          }}
        >
          <h4 style={{ marginBottom: 10 }}>🧪 Preparation Steps</h4>

          {pest.preparationSteps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  minWidth: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#16A34A",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <p style={{ margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 14 }}>
          <b>📌 Usage:</b> {t ? pest.usageTa : pest.usage}
        </p>
      </div>
    </motion.div>
  );

  return (
    <Layout title={t ? "பூச்சி கலைக்களஞ்சியம்" : "Premium Pest Encyclopedia"}>
      <div style={{ padding: 18 }}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />

        <button
          onClick={openImagePicker}
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 18,
            border: "none",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            background: "linear-gradient(135deg,#2563EB,#16A34A)",
            boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
            cursor: "pointer",
          }}
        >
          📷 Scan Pest with AI
        </button>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="uploaded"
            style={{
              width: "100%",
              marginTop: 18,
              borderRadius: 20,
              maxHeight: 260,
              objectFit: "cover",
            }}
          />
        )}

        {detectedPest && (
          <>
            <h2 style={{ marginTop: 26, fontSize: 24 }}>🤖 AI Detection Result</h2>
            {renderPestCard(detectedPest, "detected")}
          </>
        )}

        <h2 style={{ marginTop: 26, fontSize: 24 }}>🐛 All Crop Pests</h2>
        {pests.map(renderPestCard)}
      </div>
    </Layout>
  );
}