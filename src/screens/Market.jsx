import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Search, TrendingUp, TrendingDown, Minus, Star } from "lucide-react";
import { api } from "../lib/api";

const cropEmojis = { Paddy: "🌾", Banana: "🍌", Groundnut: "🥜", Tomato: "🍅", Onion: "🧅" };

const trendIcon = (trend) => ({
  up: <TrendingUp size={14} color="#10B981" />,
  down: <TrendingDown size={14} color="#EF4444" />,
  stable: <Minus size={14} color="#F59E0B" />,
}[trend] || null);

export default function Market() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const navigate = useNavigate();

  const [crop, setCrop] = useState("");
  const [market, setMarket] = useState("");
  const [search, setSearch] = useState("");
  const [weekly, setWeekly] = useState([20, 22, 21, 23, 24, 25, 26]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    async function loadMarket() {
      try {
        const data = await api.get("/market");
        setPrices(data.prices || {});
        setWeekly(data.weekly || [20, 22, 21, 23, 24, 25, 26]);
      } catch {
        setPrices({});
      }
    }
    loadMarket();
  }, []);

  const selected = crop && market && prices[crop]?.[market] ? prices[crop][market] : null;

  const topDistrict = crop
    ? Object.entries(prices[crop]).reduce((best, [d, v]) => (!best || v.max > best.price ? { name: d, price: v.max } : best), null)
    : null;

  const filteredCrops = Object.keys(prices).filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title={t ? "சந்தை விலை" : "Market Prices"}>
      <div className="inner-screen-container" style={{ padding: "16px 24px 40px" }}>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "relative", marginBottom: 16,
          }}
        >
          <Search size={16} color="#9CA3AF" style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)"
          }} />
          <input
            className="input-field"
            style={{ paddingLeft: 42 }}
            placeholder={t ? "பயிர் தேடுங்கள்..." : "Search crops..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Crop Selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ marginBottom: 16 }}
        >
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
            {t ? "பயிர் தேர்வு" : "Select Crop"}
          </p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="scrollbar-hide">
            {filteredCrops.map(c => (
              <motion.button
                key={c}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setCrop(c); setMarket(""); }}
                style={{
                  flexShrink: 0,
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: crop === c ? "none" : "1.5px solid #E5E7EB",
                  background: crop === c ? "linear-gradient(135deg, #2F80ED, #27AE60)" : "#fff",
                  color: crop === c ? "#fff" : "#374151",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: crop === c ? "0 4px 12px rgba(47,128,237,0.35)" : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <span>{cropEmojis[c]}</span> {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* District Selector */}
        {crop && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 16 }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t ? "மாவட்டம் தேர்வு" : "Select District"}
            </p>
            <select
              className="input-field"
              value={market}
              onChange={e => setMarket(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">{t ? "மாவட்டம் தேர்வு செய்யுங்கள்" : "Choose district..."}</option>
              {Object.keys(prices[crop]).map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Price Card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "linear-gradient(135deg, #2F80ED, #27AE60)",
              borderRadius: 24, padding: "20px 20px",
              marginBottom: 16,
              boxShadow: "0 12px 40px rgba(47,128,237,0.35)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 }}>
              {cropEmojis[crop]} {crop} · {market}
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                ₹{Math.round((selected.min + selected.max) / 2)}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6 }}>/kg</span>
              <span style={{ marginLeft: 8, marginBottom: 6 }}>{trendIcon(selected.trend)}</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: t ? "குறைந்த" : "Min", val: selected.min, color: "#FDE68A" },
                { label: t ? "அதிக" : "Max", val: selected.max, color: "#A7F3D0" },
                { label: t ? "சராசரி" : "Avg", val: Math.round((selected.min + selected.max) / 2), color: "#BFDBFE" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.18)", borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginBottom: 4 }}>{label}</p>
                  <p style={{ color, fontSize: 16, fontWeight: 800 }}>₹{val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top District */}
        {topDistrict && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: "#fff", borderRadius: 20,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #F59E0B, #EF4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
            }}>
              <Star size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>
                {t ? "இன்று அதிக விலை மாவட்டம்" : "Best Price Today"}
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                🏆 {topDistrict.name} — ₹{topDistrict.price}/kg
              </p>
            </div>
          </motion.div>
        )}

        {/* Weekly Trend */}
        {market && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "#fff", borderRadius: 20,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t ? "வார போக்கு" : "Weekly Trend"}
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60 }}>
              {weekly.map((v, i) => {
                const maxV = Math.max(...weekly);
                const h = (v / maxV) * 52;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                      style={{
                        width: "100%", borderRadius: 6,
                        background: i === weekly.length - 1
                          ? "linear-gradient(180deg, #2F80ED, #27AE60)"
                          : "#E5E7EB",
                      }}
                    />
                    <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* All Prices Table */}
        {crop && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "#fff", borderRadius: 20,
              padding: "16px", marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.4 }}>
              {t ? "அனைத்து மாவட்ட விலை" : "All District Prices"}
            </p>
            {Object.entries(prices[crop]).map(([district, { min, max, trend }], i) => (
              <div key={district} style={{
                display: "flex", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < Object.keys(prices[crop]).length - 1 ? "1px solid #F3F4F6" : "none",
                cursor: "pointer",
              }}
                onClick={() => setMarket(district)}
              >
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#374151" }}>{district}</span>
                <span style={{ fontSize: 12, color: "#9CA3AF", marginRight: 8 }}>₹{min}–₹{max}</span>
                {trendIcon(trend)}
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </Layout>
  );
}
