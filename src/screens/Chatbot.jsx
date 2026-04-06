import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { Send, Cpu, RotateCcw } from "lucide-react";
import { api } from "../lib/api";

export default function Chatbot() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: t
        ? "🙏 வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். பயிர், பூச்சி, உரம், சந்தை விலை பற்றி கேளுங்கள்!"
        : "🙏 Hello! I'm your AI Farming Assistant. Ask me about crops, pests, fertilizers, or market prices!",
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  useEffect(() => {
    async function loadSuggested() {
      try {
        const data = await api.get("/chatbot/suggested");
        setSuggestedQuestions(data?.suggestedQuestions || []);
      } catch (error) {
        console.error("Suggested load error:", error);
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

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setTyping(true);

    try {
      const data = await api.post("/chatbot/reply", {
        text: q,
        lang: t ? "ta" : "en",
        history: updatedMessages.map((m) => ({
          from: m.from,
          text: m.text,
        })),
      });

      const fullReply = data?.reply || "No response from AI.";
      const botId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        { id: botId, from: "bot", text: "", time: new Date() },
      ]);

      let currentText = "";

      for (let i = 0; i < fullReply.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 12));
        currentText += fullReply[i];

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, text: currentText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chatbot frontend error:", error);

      const botMsg = {
        id: Date.now() + 2,
        from: "bot",
        text:
          error?.response?.data?.reply ||
          error?.response?.data?.error ||
          (t
            ? "AI பதில் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
            : "Unable to get AI response. Please try again."),
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
        text: t
          ? "🙏 வணக்கம்! மீண்டும் கேள்வியை தொடங்குங்கள்."
          : "🙏 Hello again! Ask your farming doubt.",
        time: new Date(),
      },
    ]);
    setInput("");
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              borderRadius: 18,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} color="#fff" />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>Farmer AI</p>
            </div>

            <button onClick={reset} style={{ background: "none", border: "none" }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* ✅ Suggested buttons */}
        {messages.length === 1 && suggestedQuestions.length > 0 && (
          <div style={{ padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => send(t ? q.ta : q.en)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 20,
                  border: "1px solid #ddd",
                  background: "#fff",
                }}
              >
                {t ? q.ta : q.en}
              </button>
            ))}
          </div>
        )}

        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div>{m.text}</div>
              <small>{formatTime(m.time)}</small>
            </div>
          ))}

          {typing && <div>🤖 AI typing...</div>}
        </div>

        <div style={{ padding: "10px 16px 16px", display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1, padding: 12 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={() => send()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </Layout>
  );
}