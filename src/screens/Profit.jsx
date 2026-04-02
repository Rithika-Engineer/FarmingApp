import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { TrendingUp, TrendingDown, Volume2, RotateCcw } from "lucide-react";
import { api } from "../lib/api";

const fallbackCropList = ["Paddy", "Maize", "Cotton", "Groundnut"];
const fallbackMarketPrice = {
  Paddy: { min: 18, max: 24 },
  Maize: { min: 16, max: 22 },
  Cotton: { min: 55, max: 70 },
  Groundnut: { min: 45, max: 60 },
};

export default function Profit() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [crop, setCrop] = useState("Paddy");
  const [cropList, setCropList] = useState(fallbackCropList);
  const [marketPrice, setMarketPrice] = useState(fallbackMarketPrice);
  const [cost, setCost] = useState("");
  const [yieldKg, setYieldKg] = useState("");
  const [price, setPrice] = useState("");

  const m = new Date().getMonth() + 1;
  const season = m >= 6 && m <= 10 ? "Kharif" : m >= 11 || m <= 2 ? "Rabi" : "Summer";

  const income = Number(price) * Number(yieldKg);
  const profit = income - Number(cost);
  const hasResult = cost && yieldKg && price;
  const isProfit = profit >= 0;

  const [history, setHistory] = useState({});
  useEffect(() => {
    async function loadProfitData() {
      try {
        const config = await api.get("/profit/config");
        const historyRes = await api.get("/profit/history");
        const loadedList = config.cropList || fallbackCropList;
        setCropList(loadedList);
        setMarketPrice(config.marketPrice || fallbackMarketPrice);
        setHistory(historyRes.history || {});
        if (!loadedList.includes(crop)) {
          setCrop(loadedList[0] || "Paddy");
        }
      } catch {
        setCropList(fallbackCropList);
        setMarketPrice(fallbackMarketPrice);
        setHistory(JSON.parse(localStorage.getItem("seasonProfit") || "{}"));
      }
    }
    loadProfitData();
  }, []);

  async function calculate() {
    if (!hasResult) return;
    const updated = { ...history, [season]: profit };
    setHistory(updated);
    localStorage.setItem("seasonProfit", JSON.stringify(updated));
    try {
      await api.put("/profit/history", { history: updated });
    } catch {
      // Keep local fallback only if backend update fails.
    }
  }

  function speak() {
    const msg = isProfit
      ? `நீங்கள் லாபம் பெற்றுள்ளீர்கள். லாபம் ரூபாய் ${profit}`
      : `இந்த பருவத்தில் இழப்பு ஏற்பட்டுள்ளது`;
    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = "ta-IN";
    window.speechSynthesis.speak(speech);
  }

  function reset() {
    setCost(""); setYieldKg(""); setPrice("");
  }

  return (
    <Layout title={t ? "லாப கணக்கீடு" : "Profit Calculator"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Season info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            borderRadius: 18, padding: "14px 18px",
            marginBottom: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              {t ? "தற்போதைய பருவம்" : "Current Season"}
            </p>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>🌾 {season}</p>
          </div>
          <button onClick={reset} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: "#fff" }}>
            <RotateCcw size={14} />
          </button>
        </motion.div>

        {/* Crop Selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>
            {t ? "பயிர் தேர்வு" : "Select Crop"}
          </p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="scrollbar-hide">
            {cropList.map(c => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.92 }}
                onClick={() => setCrop(c)}
                style={{
                  flexShrink: 0, padding: "8px 16px", borderRadius: 20,
                  border: crop === c ? "none" : "1.5px solid #E5E7EB",
                  background: crop === c ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                  color: crop === c ? "#fff" : "#374151",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  boxShadow: crop === c ? "0 4px 12px rgba(47,128,237,0.3)" : "none",
                }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Market Price Reference */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "#fff", borderRadius: 16, padding: "12px 16px",
            marginBottom: 16, border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex", gap: 12,
          }}
        >
          <div style={{ fontSize: 22 }}>📊</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 2 }}>
              {t ? `${crop} இன்றைய விலை` : `${crop} Market Price`}
            </p>
            <p style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>
              ₹{marketPrice[crop].min} – ₹{marketPrice[crop].max} /kg
            </p>
          </div>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{
            background: "#fff", borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            border: "1px solid #E5E7EB",
            marginBottom: 16,
          }}
        >
          {[
            { label: t ? "மொத்த செலவு (₹)" : "Total Cost (₹)", value: cost, setter: setCost, placeholder: "0", icon: "💸" },
            { label: t ? "உற்பத்தி (kg)" : "Yield (kg)", value: yieldKg, setter: setYieldKg, placeholder: "0", icon: "⚖️" },
            { label: t ? "விலை / kg (₹)" : "Price per kg (₹)", value: price, setter: setPrice, placeholder: "0", icon: "🏷️" },
          ].map(({ label, value, setter, placeholder, icon }, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
              }}
            >
              <label style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>
                {icon} {label}
              </label>
              <input
                type="number"
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%", border: "none", outline: "none",
                  fontSize: 18, fontWeight: 600, color: "#111827",
                  background: "transparent", fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Calculate Button */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.16 }}
          whileTap={{ scale: 0.97 }}
          onClick={calculate}
          style={{
            width: "100%", padding: "15px 20px",
            borderRadius: 18, border: "none",
            background: "linear-gradient(135deg, #2F80ED, #27AE60)",
            color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(47,128,237,0.3)",
            marginBottom: 16,
          }}
        >
          {t ? "கணக்கிடு" : "Calculate Profit"}
        </motion.button>

        {/* Result Card */}
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: isProfit ? "linear-gradient(135deg, #EDFBF1, #D1FAE5)" : "linear-gradient(135deg, #FFF5F5, #FEE2E2)",
              borderRadius: 20, padding: "20px",
              marginBottom: 16,
              border: `1.5px solid ${isProfit ? "#6EE7B7" : "#FECACA"}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: isProfit ? "#065F46" : "#DC2626", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>
                  {isProfit
                    ? (t ? "🎉 லாபம்" : "🎉 Profit")
                    : (t ? "⚠️ இழப்பு" : "⚠️ Loss")}
                </p>
                <h2 style={{ fontSize: 36, fontWeight: 800, color: isProfit ? "#065F46" : "#DC2626", margin: 0 }}>
                  ₹{Math.abs(profit).toLocaleString()}
                </h2>
              </div>
              {isProfit
                ? <TrendingUp size={36} color="#10B981" />
                : <TrendingDown size={36} color="#EF4444" />
              }
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Cost</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>₹{Number(cost).toLocaleString()}</p>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>Income</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>₹{income.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={speak}
              style={{
                width: "100%", marginTop: 12, padding: "10px",
                borderRadius: 12, border: "none",
                background: isProfit ? "#10B981" : "#EF4444",
                color: "#fff", fontWeight: 700, fontSize: 13,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Volume2 size={14} /> {t ? "தமிழில் கேட்க" : "Tamil Voice Report"}
            </button>
            {!isProfit && (
              <p style={{ fontSize: 12, color: "#DC2626", marginTop: 10, textAlign: "center", fontWeight: 500 }}>
                🛡 {t ? "இழப்பு – PMFBY காப்பீட்டுக்கு தகுதி" : "Loss detected — PMFBY Insurance eligible"}
              </p>
            )}
          </motion.div>
        )}

        {/* Season History */}
        {Object.keys(history).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#fff", borderRadius: 18,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
              📊 {t ? "பருவ அறிக்கை" : "Season History"}
            </p>
            {Object.entries(history).map(([s, val]) => (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#374151" }}>🌾 {s}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: val >= 0 ? "#10B981" : "#EF4444" }}>
                  {val >= 0 ? "+" : ""}₹{Number(val).toLocaleString()}
                </span>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
