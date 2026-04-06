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
      id: 1,
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
    if (!q || typing) return;

    setInput("");

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: q,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const data = await api.post("/chatbot/reply", {
        text: q,
        lang: t ? "ta" : "en",
      });

      const fullReply = data.reply;
      const botId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        { id: botId, from: "bot", text: "", time: new Date() },
      ]);

      let currentText = "";

      for (let i = 0; i < fullReply.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentText += fullReply[i];

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, text: currentText } : msg
          )
        );
      }
    } catch {
      const botMsg = {
        id: Date.now() + 2,
        from: "bot",
        text: t ? "சர்வர் பிழை. மீண்டும் முயற்சிக்கவும்." : "Server error. Please try again.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setTyping(false);
    }
  }

  function reset() {
    setMessages([
      {
        id: Date.now(),
        from: "bot",
        text: t ? "🙏 வணக்கம்! மீண்டும் கேடு தொடங்குங்கள்." : "🙏 Hello again! How can I help you?",
        time: new Date(),
      },
    ]);
  }

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Layout title={t ? "AI உதவியாளர்" : "AI Assistant"}>
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
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
            }}>
              <Cpu size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>Farmer AI</p>
              <span style={{ fontSize: 11, color: "#10B981" }}>
                {t ? "தயாராக உள்ளது" : "Online"}
              </span>
            </div>
            <button
              onClick={reset}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <RotateCcw size={16} />
            </button>
          </motion.div>
        </div>

        {messages.length <= 1 && (
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestedQuestions.map(({ en, ta }) => (
                <button
                  key={en}
                  onClick={() => send(t ? ta : en)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 14,
                    border: "1.5px solid #E5E7EB",
                    background: "#fff",
                  }}
                >
                  💬 {t ? ta : en}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 16px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg, #2F80ED, #27AE60)"
                        : "#fff",
                    color: m.from === "user" ? "#fff" : "#111827",
                    borderRadius:
                      m.from === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    padding: "11px 14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: m.from === "bot" ? "1px solid #E5E7EB" : "none",
                  }}
                >
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
                  {formatTime(m.time)}
                </span>
              </motion.div>
            ))}

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "14px 18px",
                    width: "fit-content",
                  }}
                >
                  AI typing...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ padding: "10px 16px 16px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="input-field"
              style={{ flex: 1, borderRadius: 20 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t ? "உங்கள் கேள்வியை எழுதுங்கள்..." : "Type your question..."}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={() => send()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
