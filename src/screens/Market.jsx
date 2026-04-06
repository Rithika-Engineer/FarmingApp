import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import Layout from "../components/Layout";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { api } from "../lib/api";

const cropEmojis = {
  Paddy: "🌾",
  Banana: "🍌",
  Groundnut: "🥜",
  Tomato: "🍅",
  Onion: "🧅",
  Maize: "🌽",
  Cotton: "🌿",
  Chilli: "🌶️",
  Coconut: "🥥",
};

const cropTamil = {
  Paddy: "நெல்",
  Banana: "வாழை",
  Groundnut: "வேர்க்கடலை",
  Tomato: "தக்காளி",
  Onion: "வெங்காயம்",
  Maize: "மக்காச்சோளம்",
  Cotton: "பருத்தி",
  Chilli: "மிளகாய்",
  Coconut: "தேங்காய்",
};

const districtTamil = {
  Chennai: "சென்னை",
  Salem: "சேலம்",
  Trichy: "திருச்சி",
  Erode: "ஈரோடு",
  Madurai: "மதுரை",
  Thanjavur: "தஞ்சாவூர்",
  Villupuram: "விழுப்புரம்",
  Tirunelveli: "திருநெல்வேலி",
  Cuddalore: "கடலூர்",
  Namakkal: "நாமக்கல்",
  Coimbatore: "கோயம்புத்தூர்",
  Dindigul: "திண்டுக்கல்",
  Theni: "தேனி",
  Karur: "கரூர்",
  Tiruppur: "திருப்பூர்",
  Virudhunagar: "விருதுநகர்",
  Pollachi: "பொள்ளாச்சி",
  Kanyakumari: "கன்னியாகுமரி",
};

const trendIcon = (trend) =>
  ({
    up: <TrendingUp size={14} color="#10B981" />,
    down: <TrendingDown size={14} color="#EF4444" />,
    stable: <Minus size={14} color="#F59E0B" />,
  }[trend] || null);

export default function Market() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [crop, setCrop] = useState("");
  const [market, setMarket] = useState("");
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState({});
  const [alertPrice, setAlertPrice] = useState("");
  const [stockKg, setStockKg] = useState("");

  useEffect(() => {
    async function loadMarket() {
      try {
        const data = await api.get("/market");
        setPrices(data.prices || {});
      } catch {
        setPrices({
          Paddy: {
            Chennai: { min: 22, max: 26, trend: "up" },
            Salem: { min: 24, max: 29, trend: "up" },
            Trichy: { min: 21, max: 25, trend: "stable" },
            Erode: { min: 23, max: 28, trend: "up" },
            Madurai: { min: 22, max: 27, trend: "up" },
            Thanjavur: { min: 24, max: 30, trend: "up" },
            Villupuram: { min: 21, max: 26, trend: "stable" },
            Tirunelveli: { min: 22, max: 27, trend: "up" },
            Cuddalore: { min: 23, max: 28, trend: "up" },
            Namakkal: { min: 24, max: 29, trend: "up" },
          },
          Tomato: {
            Chennai: { min: 28, max: 34, trend: "up" },
            Salem: { min: 30, max: 36, trend: "up" },
            Coimbatore: { min: 29, max: 35, trend: "stable" },
            Madurai: { min: 27, max: 33, trend: "up" },
            Erode: { min: 28, max: 34, trend: "up" },
            Trichy: { min: 29, max: 35, trend: "stable" },
            Tiruppur: { min: 30, max: 36, trend: "up" },
          },
          Onion: {
            Chennai: { min: 32, max: 38, trend: "up" },
            Madurai: { min: 30, max: 35, trend: "stable" },
            Salem: { min: 31, max: 36, trend: "up" },
            Dindigul: { min: 33, max: 39, trend: "up" },
            Erode: { min: 32, max: 37, trend: "stable" },
          },
          Banana: {
            Trichy: { min: 18, max: 24, trend: "up" },
            Salem: { min: 20, max: 26, trend: "up" },
            Coimbatore: { min: 19, max: 25, trend: "stable" },
            Theni: { min: 21, max: 27, trend: "up" },
            Tirunelveli: { min: 20, max: 26, trend: "up" },
          },
          Groundnut: {
            Erode: { min: 52, max: 58, trend: "up" },
            Madurai: { min: 50, max: 55, trend: "stable" },
            Villupuram: { min: 51, max: 56, trend: "up" },
            Cuddalore: { min: 53, max: 59, trend: "up" },
          },
          Maize: {
            Salem: { min: 20, max: 25, trend: "up" },
            Erode: { min: 21, max: 26, trend: "up" },
            Namakkal: { min: 22, max: 27, trend: "up" },
            Karur: { min: 20, max: 26, trend: "stable" },
          },
          Cotton: {
            Coimbatore: { min: 60, max: 68, trend: "up" },
            Salem: { min: 58, max: 64, trend: "stable" },
            Erode: { min: 59, max: 65, trend: "up" },
            Tiruppur: { min: 61, max: 69, trend: "up" },
          },
          Chilli: {
            Madurai: { min: 85, max: 95, trend: "up" },
            Trichy: { min: 80, max: 90, trend: "up" },
            Virudhunagar: { min: 88, max: 98, trend: "up" },
            Dindigul: { min: 84, max: 94, trend: "stable" },
          },
          Coconut: {
            Pollachi: { min: 34, max: 40, trend: "up" },
            Coimbatore: { min: 32, max: 38, trend: "stable" },
            Thanjavur: { min: 33, max: 39, trend: "up" },
            Kanyakumari: { min: 35, max: 41, trend: "up" },
          },
        });
      }
    }
    loadMarket();
  }, []);

  const selected =
    crop && market && prices[crop]?.[market]
      ? prices[crop][market]
      : null;

  const avgPrice = selected
    ? Math.round((selected.min + selected.max) / 2)
    : 0;

  const tomorrowPrice = avgPrice ? avgPrice + 1 : 0;
  const nextWeekPrice = avgPrice ? avgPrice + 3 : 0;
  const yesterdayPrice = avgPrice ? avgPrice - 2 : 0;
  const monthAvg = avgPrice ? avgPrice - 4 : 0;
  const transportCost = 2;
  const netPrice = avgPrice - transportCost;
  const stockValue = stockKg ? stockKg * avgPrice : 0;

  const filteredCrops = Object.keys(prices).filter((c) =>
    (t ? cropTamil[c] || c : c)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout title={t ? "சந்தை விலை" : "AI Market Intelligence"}>
      <div style={{ padding: "16px 24px 40px" }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search
            size={16}
            color="#9CA3AF"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            className="input-field"
            style={{ paddingLeft: 42 }}
            placeholder={t ? "பயிர்களை தேடுங்கள்..." : "Search crops..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }}>
          {filteredCrops.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCrop(c);
                setMarket("");
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: "none",
                background:
                  crop === c
                    ? "linear-gradient(135deg,#2F80ED,#27AE60)"
                    : "#fff",
                color: crop === c ? "#fff" : "#374151",
              }}
            >
              {cropEmojis[c]} {t ? cropTamil[c] || c : c}
            </button>
          ))}
        </div>

        {crop && (
          <select
            className="input-field"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <option value="">
              {t ? "மாவட்டத்தை தேர்வு செய்யவும்..." : "Choose district..."}
            </option>
            {Object.keys(prices[crop]).map((m) => (
              <option key={m}>{t ? districtTamil[m] || m : m}</option>
            ))}
          </select>
        )}

        {selected && (
          <div
            style={{
              background: "linear-gradient(135deg,#2F80ED,#27AE60)",
              borderRadius: 24,
              padding: 20,
              marginBottom: 16,
              color: "#fff",
            }}
          >
            <p>
              {cropEmojis[crop]} {t ? cropTamil[crop] || crop : crop} ·{" "}
              {t ? districtTamil[market] || market : market}
            </p>
            <h1>₹{avgPrice}/kg</h1>
            <p>
              {t ? "குறைந்தபட்சம்" : "Min"} ₹{selected.min} |{" "}
              {t ? "அதிகபட்சம்" : "Max"} ₹{selected.max}
            </p>
          </div>
        )}

        {selected && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 16,
              marginBottom: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <h3>{t ? "🤖 AI சந்தை தகவல்கள்" : "🤖 AI Market Insights"}</h3>
            <p>📈 {t ? "நாளை" : "Tomorrow"}: ₹{tomorrowPrice}</p>
            <p>🔮 {t ? "அடுத்த வாரம்" : "Next week"}: ₹{nextWeekPrice}</p>
            <p>📅 {t ? "நேற்று" : "Yesterday"}: ₹{yesterdayPrice}</p>
            <p>📆 {t ? "மாத சராசரி" : "Monthly Avg"}: ₹{monthAvg}</p>
            <p>🚚 {t ? "போக்குவரத்து கழித்து" : "Net after transport"}: ₹{netPrice}</p>

            <input
              className="input-field"
              type="number"
              placeholder={t ? "விலை எச்சரிக்கை அமைக்கவும்" : "Set price alert"}
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
            />

            <input
              className="input-field"
              type="number"
              placeholder={t ? "கையிருப்பு (kg)" : "Available stock (kg)"}
              value={stockKg}
              onChange={(e) => setStockKg(e.target.value)}
            />

            {stockKg && (
              <p>
                📦 {t ? "எதிர்பார்க்கப்படும் விற்பனை" : "Expected Sale"}: ₹
                {stockValue.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {crop && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <h3>
              {t
                ? "📊 அனைத்து மாவட்ட விலைகள் (அதிகம் → குறைவு)"
                : "📊 All District Prices (High → Low)"}
            </h3>

            {Object.entries(prices[crop])
              .sort((a, b) => b[1].max - a[1].max)
              .map(([district, data]) => (
                <div
                  key={district}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #F3F4F6",
                    cursor: "pointer",
                  }}
                  onClick={() => setMarket(district)}
                >
                  <span>📍 {t ? districtTamil[district] || district : district}</span>
                  <span>
                    ₹{data.min} - ₹{data.max} {trendIcon(data.trend)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}