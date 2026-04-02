import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { Send, Mic, Sprout, Cpu, RotateCcw } from "lucide-react";
import { api } from "../lib/api";

export default function Chatbot() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: t
        ? "🙏 வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். பயிர், பூச்சி, உரம், சந்தை விலை பற்றி கேளுங்கள்!"
        : "🙏 Hello! I'm your AI Farming Assistant. Ask me about crops, pests, fertilizers, or market prices!",
      time: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    async function loadSuggested() {
      try {
        const data = await api.get("/chatbot/suggested");
        setSuggestedQuestions(data.suggestedQuestions || []);
      } catch {
        setSuggestedQuestions([]);
      }
    }
    loadSuggested();
  }, []);

  async function send(text = input) {
    const q = text.trim();
    if (!q) return;
    setInput("");

    const userMsg = { from: "user", text: q, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    try {
      const data = await api.post("/chatbot/reply", { text: q, lang: t ? "ta" : "en" });
      const botMsg = { from: "bot", text: data.reply, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg = {
        from: "bot",
        text: t ? "சர்வர் பிழை. மீண்டும் முயற்சிக்கவும்." : "Server error. Please try again.",
        time: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setTyping(false);
    }
  }

  function reset() {
    setMessages([{
      from: "bot",
      text: t ? "🙏 வணக்கம்! மீண்டும் கேடு தொடங்குங்கள்." : "🙏 Hello again! How can I help you?",
      time: new Date(),
    }]);
  }

  const formatTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Layout title={t ? "AI உதவியாளர்" : "AI Assistant"}>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>

        {/* AI Header Pill */}
        <div style={{ padding: "0 16px 12px" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", borderRadius: 18, padding: "12px 16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: "linear-gradient(135deg, #2F80ED, #9B51E0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(47,128,237,0.35)",
            }}>
              <Cpu size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                {t ? "Farmer AI" : "Farmer AI"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>
                  {t ? "தயாராக உள்ளது" : "Online"}
                </span>
              </div>
            </div>
            <button
              onClick={reset}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}
            >
              <RotateCcw size={16} />
            </button>
          </motion.div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div style={{ padding: "0 16px 12px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t ? "பரிந்துரைக்கப்பட்ட கேள்விகள்" : "Suggested Questions"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestedQuestions.map(({ en, ta }) => (
                <motion.button
                  key={en}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => send(t ? ta : en)}
                  style={{
                    textAlign: "left", padding: "10px 14px",
                    borderRadius: 14, border: "1.5px solid #E5E7EB",
                    background: "#fff", color: "#374151",
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  💬 {t ? ta : en}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div
          ref={chatRef}
          style={{
            flex: 1, overflowY: "auto",
            padding: "0 16px 8px",
            display: "flex", flexDirection: "column", gap: 8,
          }}
          className="scrollbar-hide"
        >
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                {m.from === "bot" && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "85%" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 10, flexShrink: 0,
                      background: "linear-gradient(135deg, #2F80ED, #9B51E0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Sprout size={13} color="#fff" />
                    </div>
                    <div>
                      <div style={{
                        background: "#fff",
                        borderRadius: "18px 18px 18px 4px",
                        padding: "11px 14px",
                        fontSize: 14, color: "#111827", lineHeight: 1.5,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        border: "1px solid #E5E7EB",
                      }}>
                        {m.text}
                      </div>
                      <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, paddingLeft: 4, display: "block" }}>
                        {formatTime(m.time)}
                      </span>
                    </div>
                  </div>
                )}
                {m.from === "user" && (
                  <div style={{ maxWidth: "80%" }}>
                    <div style={{
                      background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                      borderRadius: "18px 18px 4px 18px",
                      padding: "11px 14px",
                      fontSize: 14, color: "#fff", lineHeight: 1.5,
                      boxShadow: "0 4px 14px rgba(47,128,237,0.3)",
                    }}>
                      {m.text}
                    </div>
                    <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, paddingRight: 4, display: "block", textAlign: "right" }}>
                      {formatTime(m.time)}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 10,
                  background: "linear-gradient(135deg, #2F80ED, #9B51E0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sprout size={13} color="#fff" />
                </div>
                <div style={{
                  background: "#fff", border: "1px solid #E5E7EB",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "14px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  display: "flex", gap: 4,
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "#9CA3AF" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div style={{
          padding: "10px 16px 16px",
          background: "rgba(247,249,252,0.8)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input-field"
              style={{ flex: 1, borderRadius: 20 }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t ? "உங்கள் கேள்வியை எழுதுங்கள்..." : "Type your question..."}
              onKeyDown={e => e.key === "Enter" && send()}
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => send()}
              disabled={!input.trim() && !typing}
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: input.trim()
                  ? "linear-gradient(135deg, #2F80ED, #27AE60)"
                  : "#E5E7EB",
                border: "none", cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: input.trim() ? "0 4px 14px rgba(47,128,237,0.35)" : "none",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <Send size={16} color={input.trim() ? "#fff" : "#9CA3AF"} />
            </motion.button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
