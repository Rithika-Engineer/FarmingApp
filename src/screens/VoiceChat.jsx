import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function VoiceChat() {
  const { lang } = useLanguage();
  const isTamil = lang === "ta";

  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [season, setSeason] = useState("kharif");

  const seasons = [
    { id: "kharif", label: isTamil ? "🌧️ கரீஃப்" : "🌧️ Kharif" },
    { id: "rabi", label: isTamil ? "❄️ ரபி" : "❄️ Rabi" },
    { id: "summer", label: isTamil ? "☀️ கோடை" : "☀️ Summer" },
  ];

  function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = isTamil ? "ta-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }

  // ✅ REAL smart farming chat engine
  function getRealChatReply(q, currentSeason) {
    const lower = q.toLowerCase();

    const seasonBest = {
      kharif: "🌾 Paddy, 🌽 Maize, 🧵 Cotton are best crops for Kharif.",
      rabi: "🌾 Wheat, 🌼 Mustard, 🌱 Chickpea are best crops for Rabi.",
      summer: "🍉 Watermelon, 🌱 Sesame, 🥒 Cucumber are best for Summer.",
    };

    if (lower.includes("best") || lower.includes("crop")) {
      return seasonBest[currentSeason];
    }

    if (lower.includes("pest") || lower.includes("disease")) {
      return isTamil
        ? "வேப்பெண்ணெய் தெளிப்பு, பெரோமோன் கண்ணிகள் மற்றும் பூஞ்சை மருந்து பயன்படுத்தவும்."
        : "Use neem oil spray, pheromone traps, and fungicide based on crop stage.";
    }

    if (
      lower.includes("fertilizer") ||
      lower.includes("fertiliser") ||
      lower.includes("organic")
    ) {
      return isTamil
        ? "கம்போஸ்ட், DAP, யூரியா, பொட்டாசியம் மற்றும் ஜீவாமிர்தம் பயன்படுத்தலாம்."
        : "Use compost, DAP, urea, potash, and Jeevamrutham based on crop growth.";
    }

    if (lower.includes("water") || lower.includes("irrigation")) {
      return isTamil
        ? "அதிகாலை மற்றும் மாலை நேரம் நீர் பாய்ச்சுவது சிறந்தது."
        : "Water early morning and evening to reduce evaporation loss.";
    }

    if (lower.includes("soil")) {
      return isTamil
        ? "மண் pH, ஈரப்பதம், வடிகால் மற்றும் நைட்ரஜன் நிலையை பரிசோதிக்கவும்."
        : "Check soil pH, moisture, drainage, and nitrogen before crop selection.";
    }

    if (lower.includes("weather") || lower.includes("rain")) {
      return isTamil
        ? "இந்த பருவ மழை மற்றும் வெப்பநிலைக்கு ஏற்ற பயிர் தேர்வு செய்யவும்."
        : "Choose crop based on rainfall and seasonal temperature.";
    }

    if (lower.includes("yield") || lower.includes("profit")) {
      return isTamil
        ? "சரியான உரம், நீர் மற்றும் பூச்சி கட்டுப்பாட்டால் அதிக மகசூல் கிடைக்கும்."
        : "Proper fertilizer, irrigation, and pest control improve yield and profit.";
    }

    if (lower.includes("market") || lower.includes("price")) {
      return isTamil
        ? "உள்ளூர் சந்தை மற்றும் பருவ தேவை அடிப்படையில் விலை மாறும்."
        : "Market price depends on local demand, season, and crop quality.";
    }

    if (lower.includes("harvest")) {
      return isTamil
        ? "பயிரின் முதிர்ச்சி நிலை மற்றும் பருவத்தை பொறுத்து அறுவடை செய்யவும்."
        : "Harvest based on crop maturity stage and seasonal timing.";
    }

    if (lower.includes("rotation") || lower.includes("next crop")) {
      return isTamil
        ? "பயிர் சுழற்சிக்கு பருப்பு, கோதுமை அல்லது எண்ணெய் விதைகள் நல்லவை."
        : "Pulses, wheat, and oilseeds are good for crop rotation.";
    }

    // ✅ Smart default answer for ANY farming question
    return isTamil
      ? `${seasonBest[currentSeason]} மண், நீர், உரம், பூச்சி கட்டுப்பாடு மற்றும் சந்தை நிலையை பார்த்து சிறந்த முடிவு எடுக்கவும்.`
      : `${seasonBest[currentSeason]} Also consider soil, water, fertilizer, pest control, and market demand for best results.`;
  }

  async function askAI(q) {
    const rep = getRealChatReply(q, season);
    setAnswer(rep);
    speak(rep);
  }

  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported.");
      return;
    }

    const SR = window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = isTamil ? "ta-IN" : "en-US";
    recognition.continuous = false;

    setListening(true);
    setQuestion("");
    setAnswer("");

    recognition.start();

    recognition.onresult = async (e) => {
      const txt = e.results[0][0].transcript;
      setQuestion(txt);
      setListening(false);
      await askAI(txt);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  }

  return (
    <Layout title={isTamil ? "குரல் உதவியாளர்" : "Voice Assistant"}>
      <div
        style={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        {/* Season Tabs */}
        <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 20 }}>
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 14,
                border: "none",
                fontWeight: 600,
                background: season === s.id ? "#16A34A" : "#fff",
                color: season === s.id ? "#fff" : "#111",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Mic */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={startListening}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "none",
            background: listening
              ? "linear-gradient(135deg,#EF4444,#DC2626)"
              : "linear-gradient(135deg,#2F80ED,#27AE60)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {listening ? <MicOff size={36} color="#fff" /> : <Mic size={36} color="#fff" />}
        </motion.button>

        <p style={{ marginTop: 16 }}>
          {listening
            ? isTamil
              ? "கேட்கிறது..."
              : "Listening..."
            : isTamil
            ? "பேச கிளிக் செய்யவும்"
            : "Tap to speak"}
        </p>

        {question && (
          <div style={{ width: "100%", background: "#fff", borderRadius: 20, padding: 16, marginTop: 20 }}>
            🎤 {question}
          </div>
        )}

        {answer && (
          <div
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#EBF4FF,#EDFBF1)",
              borderRadius: 20,
              padding: 16,
              marginTop: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{isTamil ? "🤖 AI பதில்" : "🤖 AI Response"}</b>
              <button
                onClick={() => speak(answer)}
                style={{ border: "none", background: "transparent" }}
              >
                <Volume2 size={18} />
              </button>
            </div>
            <p style={{ marginTop: 8 }}>{answer}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}