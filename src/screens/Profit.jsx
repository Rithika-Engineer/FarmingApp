import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import {
  Volume2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const fallbackCropList = [
  "Paddy",
  "Maize",
  "Cotton",
  "Groundnut",
  "Tomato",
  "Chilli",
  "Banana",
  "Watermelon",
  "Coconut",
  "Sugarcane",
  "Brinjal",
  "Onion",
  "Turmeric",
  "Sunflower",
  "Millets",
];

const cropTamil = {
  Paddy: "நெல்",
  Maize: "மக்காச்சோளம்",
  Cotton: "பருத்தி",
  Groundnut: "வேர்க்கடலை",
  Tomato: "தக்காளி",
  Chilli: "மிளகாய்",
  Banana: "வாழை",
  Watermelon: "தர்பூசணி",
  Coconut: "தேங்காய்",
  Sugarcane: "கரும்பு",
  Brinjal: "கத்தரிக்காய்",
  Onion: "வெங்காயம்",
  Turmeric: "மஞ்சள்",
  Sunflower: "சூரியகாந்தி",
  Millets: "சிறுதானியங்கள்",
};

const todayMarketPrice = {
  Paddy: 21.69,
  Maize: 22.5,
  Cotton: 62,
  Groundnut: 52,
  Tomato: 28,
  Chilli: 95,
  Banana: 18,
  Watermelon: 14,
  Coconut: 35,
  Sugarcane: 4,
  Brinjal: 26,
  Onion: 32,
  Turmeric: 78,
  Sunflower: 58,
  Millets: 42,
};

export default function Profit() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [crop, setCrop] = useState("Paddy");
  const [cost, setCost] = useState("");
  const [yieldKg, setYieldKg] = useState("");
  const [price, setPrice] = useState("");
  const [history, setHistory] = useState([]);

  const income = Number(price) * Number(yieldKg);
  const profit = income - Number(cost);
  const hasResult = cost && yieldKg && price;
  const isProfit = profit >= 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("seasonProfitHistory") || "[]"
    );
    setHistory(saved);
  }, []);

  function useTodayPrice() {
    setPrice(todayMarketPrice[crop]);
  }

  function calculate() {
    if (!hasResult) return;

    const entry = {
      id: Date.now(),
      season: `S${history.length + 1}`,
      crop,
      value: profit,
      month: currentMonth,
      year: currentYear,
      timestamp: new Date().toISOString(),
      label: `${now.toLocaleString("default", {
        month: "short",
      })}-${currentYear}`,
    };

    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem("seasonProfitHistory", JSON.stringify(updated));
  }

  function speak() {
    const msg = isProfit
      ? `நீங்கள் லாபம் பெற்றுள்ளீர்கள். ரூபாய் ${profit}`
      : `இந்த பருவத்தில் இழப்பு ஏற்பட்டுள்ளது`;

    const speech = new SpeechSynthesisUtterance(msg);
    speech.lang = "ta-IN";
    window.speechSynthesis.speak(speech);
  }

  function reset() {
    setCost("");
    setYieldKg("");
    setPrice("");
  }

  const cropHistory = history.filter((h) => h.crop === crop);

  const chartData = cropHistory.map((h) => ({
    label: h.label,
    value: h.value,
  }));

  return (
    <Layout title={t ? "வருட லாப ஒப்பீடு" : "Yearly Profit Comparison"}>
      <div style={{ padding: 18, display: "grid", gap: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {fallbackCropList.map((c) => (
            <button
              key={c}
              onClick={() => setCrop(c)}
              style={{
                padding: "10px 18px",
                borderRadius: 24,
                border: "none",
                background:
                  crop === c
                    ? "linear-gradient(135deg,#2563EB,#16A34A)"
                    : "#E5E7EB",
                color: crop === c ? "#fff" : "#374151",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t ? cropTamil[c] || c : c}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#DBEAFE,#DCFCE7)",
            borderRadius: 20,
            padding: 18,
          }}
        >
          <h3>
            📈 {t ? "இன்றைய சந்தை விலை" : "Today Market Price"} (
            {t ? cropTamil[crop] || crop : crop})
          </h3>
          <h2>₹{todayMarketPrice[crop]}/kg</h2>
          <button
            onClick={useTodayPrice}
            style={{
              padding: "10px 16px",
              borderRadius: 14,
              border: "none",
              background: "#2563EB",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {t ? "இன்றைய விலையை பயன்படுத்து" : "Use Today Price"}
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <input
            type="number"
            placeholder={t ? "மொத்த செலவு" : "Total Cost"}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <input
            type="number"
            placeholder={t ? "மகசூல் (kg)" : "Yield (kg)"}
            value={yieldKg}
            onChange={(e) => setYieldKg(e.target.value)}
          />
          <input
            type="number"
            placeholder={t ? "ஒரு kg விலை" : "Price per kg"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={calculate}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg,#2563EB,#16A34A)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t ? "லாபம் கணக்கிடு" : "Calculate Profit"}
          </button>

          <button
            onClick={reset}
            style={{
              padding: 14,
              borderRadius: 16,
              border: "none",
              background: "#F3F4F6",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {hasResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: isProfit
                ? "linear-gradient(135deg,#DCFCE7,#BBF7D0)"
                : "linear-gradient(135deg,#FEE2E2,#FECACA)",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <h2>
              {isProfit ? <TrendingUp /> : <TrendingDown />} ₹
              {Math.abs(profit).toLocaleString()}
            </h2>
            <p>💰 {t ? "வருமானம்" : "Income"}: ₹{income.toLocaleString()}</p>
            <p>💸 {t ? "செலவு" : "Cost"}: ₹{Number(cost).toLocaleString()}</p>
            <button
              onClick={speak}
              style={{
                marginTop: 10,
                padding: "10px 14px",
                borderRadius: 14,
                border: "none",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <Volume2 size={16} /> {t ? "தமிழ் குரல்" : "Tamil Voice"}
            </button>
          </motion.div>
        )}

        {chartData.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 16 }}>
            <h3>{t ? "📊 பயிர் வரலாறு" : "📊 Crop History"}</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginBottom: 14 }}>
              {t
                ? "🌾 முந்தைய பயிர் அறிக்கைகள்"
                : "🌾 Previous Cultivated Crop Reports"}
            </h3>

            <div style={{ display: "grid", gap: 12 }}>
              {history
                .slice()
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: 16,
                      padding: 14,
                      background: "#F9FAFB",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      🌱 {t ? cropTamil[item.crop] || item.crop : item.crop}
                    </p>
                    <p style={{ margin: "6px 0", color: "#6B7280" }}>
                      📅 {item.label}
                    </p>
                    <p style={{ margin: "6px 0", color: "#6B7280" }}>
                      🕒 {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: item.value >= 0 ? "#16A34A" : "#DC2626",
                      }}
                    >
                      {item.value >= 0
                        ? t
                          ? "📈 லாபம்"
                          : "📈 Profit"
                        : t
                        ? "📉 இழப்பு"
                        : "📉 Loss"}{" "}
                      ₹{Math.abs(item.value).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
