import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { Mic, MicOff, Volume2 } from "lucide-react";

function getReply(q, t) {
  const text = q.toLowerCase();
  if (text.includes("rain") || text.includes("weather") || text.includes("மழை") || text.includes("வானிலை"))
    return t ? "இன்று மழை வாய்ப்பு உள்ளது. தெளிப்பு செய்ய வேண்டாம்." : "There is a chance of rain today. Avoid spraying.";
  if (text.includes("fertilizer") || text.includes("உரம்"))
    return t ? "மண் பரிசோதனை செய்து தேவையான உரம் மட்டும் பயன்படுத்தவும்." : "Test soil first and apply only the required fertilizer.";
  if (text.includes("water") || text.includes("நீர்"))
    return t ? "காலை அல்லது மாலை நேரத்தில் பாசனம் சிறந்தது." : "Water crops in the morning or evening for best results.";
  if (text.includes("pest") || text.includes("பூச்சி"))
    return t ? "வேம்பெண்ணெய் தெளிப்பு இயற்கையான பூச்சி கட்டுப்பாட்டு முறை." : "Neem oil spray is a safe, natural pest control method.";
  if (text.includes("seed") || text.includes("விதை"))
    return t ? "சான்றளிக்கப்பட்ட, தரமான விதைகளை மட்டும் பயன்படுத்தவும்." : "Always use certified quality seeds for better yield.";
  if (text.includes("scheme") || text.includes("அரசு"))
    return t ? "அருகிலுள்ள விவசாய அலுவலகத்தை தொடர்பு கொள்ளவும்." : "Contact your nearest agriculture office for schemes.";
  return t ? "உங்கள் கேள்வி புரிந்தது. தெளிவாக மீண்டும் கேளுங்கள்." : "Understood. Please ask your question more clearly.";
}

export default function VoiceChat() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [pulse, setPulse] = useState(false);

  function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = t ? "ta-IN" : "en-US";
    window.speechSynthesis.speak(msg);
  }

  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SR = window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = t ? "ta-IN" : "en-US";
    recognition.continuous = false;

    setListening(true);
    setPulse(true);
    setQuestion("");
    setAnswer("");

    recognition.start();
    recognition.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setQuestion(txt);
      const rep = getReply(txt, t);
      setAnswer(rep);
      speak(rep);
      setListening(false);
      setPulse(false);
    };
    recognition.onerror = () => {
      setListening(false);
      setPulse(false);
    };
    recognition.onend = () => {
      setListening(false);
      setPulse(false);
    };
  }

  return (
    <Layout title={t ? "குரல் உதவியாளர்" : "Voice Assistant"}>
      <div style={{ padding: "24px 16px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Hero Mic area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {/* Pulse rings */}
            {pulse && [1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                style={{
                  position: "absolute",
                  width: 100, height: 100, borderRadius: "50%",
                  background: "rgba(47,128,237,0.3)",
                }}
              />
            ))}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={startListening}
              disabled={listening}
              style={{
                width: 100, height: 100, borderRadius: "50%",
                border: "none",
                background: listening
                  ? "linear-gradient(135deg, #EF4444, #DC2626)"
                  : "linear-gradient(135deg, #2F80ED, #27AE60)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: listening
                  ? "0 8px 32px rgba(239,68,68,0.5)"
                  : "0 8px 32px rgba(47,128,237,0.45)",
                position: "relative", zIndex: 2,
              }}
            >
              {listening
                ? <MicOff size={36} color="#fff" />
                : <Mic size={36} color="#fff" />
              }
            </motion.button>
          </div>

          <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginTop: 20 }}>
            {listening
              ? (t ? "கேட்கிறேன்..." : "Listening...")
              : (t ? "பேச கிளிக் செய்யுங்கள்" : "Tap to speak")
            }
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
            {t ? "பயிர், வானிலை, பூச்சி, உரம் பற்றி கேளுங்கள்" : "Ask about crops, weather, pests, fertilizers"}
          </p>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence>
          {question && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%", background: "#fff",
                borderRadius: 20, padding: "16px",
                marginBottom: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                border: "1px solid #E5E7EB",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>
                🎤 {t ? "உங்கள் கேள்வி" : "Your Question"}
              </p>
              <p style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>{question}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Card */}
        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #EBF4FF, #EDFBF1)",
                borderRadius: 20, padding: "16px",
                marginBottom: 16,
                border: "1px solid #BFDBFE",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#2F80ED", textTransform: "uppercase", letterSpacing: 0.3 }}>
                  🤖 {t ? "AI பதில்" : "AI Response"}
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speak(answer)}
                  style={{
                    background: "rgba(47,128,237,0.1)", border: "none",
                    borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Volume2 size={14} color="#2F80ED" />
                  <span style={{ fontSize: 11, color: "#2F80ED", fontWeight: 600 }}>Play</span>
                </motion.button>
              </div>
              <p style={{ fontSize: 14, color: "#1E40AF", lineHeight: 1.6, fontWeight: 500 }}>{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Voice Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ width: "100%" }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t ? "விரைவு தலைப்புகள்" : "Quick Topics"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { en: "Weather today?", ta: "இன்று வானிலை?" },
              { en: "Pest control?", ta: "பூச்சி கட்டுப்பாடு?" },
              { en: "Organic fertilizer?", ta: "இயற்கை உரம்?" },
              { en: "Best watering time?", ta: "நீர் பாய்ச்சும் நேரம்?" },
            ].map(({ en, ta }) => (
              <motion.button
                key={en}
                whileTap={{ scale: 0.93 }}
                onClick={() => {
                  const q = t ? ta : en;
                  setQuestion(q);
                  const rep = getReply(q, t);
                  setAnswer(rep);
                  speak(rep);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 20, border: "1.5px solid #E5E7EB",
                  background: "#fff", color: "#374151",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                {t ? ta : en}
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
