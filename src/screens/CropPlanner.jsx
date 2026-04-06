import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { api } from "../lib/api";
const districtProfiles = {
  Chennai: { weather: "Hot", best: "Vegetables", price: 3200 },
  Kancheepuram: { weather: "Warm", best: "Paddy", price: 2500 },
  Tiruvallur: { weather: "Cloudy", best: "Groundnut", price: 6200 },
  Vellore: { weather: "Dry", best: "Millets", price: 4100 },
  Tiruvannamalai: { weather: "Sunny", best: "Groundnut", price: 6000 },
  Villupuram: { weather: "Warm", best: "Sugarcane", price: 3400 },
  Cuddalore: { weather: "Humid", best: "Paddy", price: 2450 },
  Salem: { weather: "Dry Heat", best: "Sesame", price: 7800 },
  Namakkal: { weather: "Warm", best: "Turmeric", price: 8700 },
  Erode: { weather: "Warm", best: "Turmeric", price: 9500 },
  Tiruppur: { weather: "Dry", best: "Cotton", price: 6800 },
  Coimbatore: { weather: "Sunny", best: "Banana", price: 3200 },
  Nilgiris: { weather: "Cool", best: "Tea", price: 12000 },
  Dindigul: { weather: "Warm", best: "Onion", price: 2200 },
  Madurai: { weather: "Hot", best: "Cotton", price: 6400 },
  Theni: { weather: "Pleasant", best: "Grapes", price: 9000 },
  Sivaganga: { weather: "Dry", best: "Millets", price: 4200 },
  Ramanathapuram: { weather: "Dry", best: "Groundnut", price: 6100 },
  Virudhunagar: { weather: "Hot", best: "Chilli", price: 8500 },
  Tirunelveli: { weather: "Warm", best: "Banana", price: 3300 },
  Thoothukudi: { weather: "Coastal", best: "Cotton", price: 6200 },
  Kanyakumari: { weather: "Humid", best: "Rubber", price: 9800 },
  Trichy: { weather: "Warm", best: "Paddy", price: 2500 },
  Karur: { weather: "Dry", best: "Sesame", price: 7600 },
  Perambalur: { weather: "Warm", best: "Maize", price: 2400 },
  Ariyalur: { weather: "Dry", best: "Groundnut", price: 6200 },
  Thanjavur: { weather: "Light Rain", best: "Paddy", price: 2400 },
  Tiruvarur: { weather: "Wet", best: "Paddy", price: 2450 },
  Nagapattinam: { weather: "Coastal", best: "Paddy", price: 2480 },
  Mayiladuthurai: { weather: "Humid", best: "Paddy", price: 2460 },
  Pudukkottai: { weather: "Dry", best: "Groundnut", price: 6150 },
  Dharmapuri: { weather: "Warm", best: "Mango", price: 7000 },
  Krishnagiri: { weather: "Warm", best: "Mango", price: 7200 },
  Ranipet: { weather: "Warm", best: "Paddy", price: 2500 },
  Tenkasi: { weather: "Pleasant", best: "Banana", price: 3350 },
};

const fallbackCrops = {
  kharif: [
    {
      name: "Paddy", ta: "நெல்", soil: "Clay / Loamy", water: "High", days: 135,
      gains: "Adds organic matter", next: "Wheat / Pulses", tip: "Avoid water stress during tillering",
      emoji: "🌾", yield: 25, price: 2400,
      pests: "Stem borer risk after 30 days",
      fert: ["Day 10 Jeevamrutham", "Day 30 Neem cake"],
      calendar: ["Day 1 Sowing", "Day 135 Harvest"],
      previous: 36000,
    },
    {
      name: "Maize", ta: "சோளம்", soil: "Well drained", water: "Medium", days: 100,
      gains: "Improves soil tilth", next: "Potato", tip: "Weed control in first 30 days",
      emoji: "🌽", yield: 18, price: 2200,
      pests: "Fall armyworm",
      fert: ["Day 12 Compost tea"],
      calendar: ["Day 1 Sowing", "Day 100 Harvest"],
      previous: 28000,
    },
    {
      name: "Cotton", ta: "பருத்தி", soil: "Black soil", water: "Medium", days: 160,
      gains: "Improves organic residue", next: "Groundnut", tip: "Avoid waterlogging",
      emoji: "🌿", yield: 12, price: 7000,
      pests: "Whitefly",
      fert: ["Day 20 Vermicompost"],
      calendar: ["Day 1 Sowing", "Day 160 Harvest"],
      previous: 50000,
    },
    {
      name: "Groundnut", ta: "வேர்க்கடலை", soil: "Sandy", water: "Low", days: 110,
      gains: "Nitrogen fixation", next: "Paddy", tip: "Good drainage required",
      emoji: "🥜", yield: 14, price: 6500,
      pests: "Leaf miner",
      fert: ["Day 10 Panchagavya"],
      calendar: ["Day 1 Sowing", "Day 110 Harvest"],
      previous: 42000,
    },
  ],

  rabi: [
    {
      name: "Wheat", ta: "கோதுமை", soil: "Loam", water: "Medium", days: 125,
      gains: "Moderate residue", next: "Paddy", tip: "Avoid late sowing",
      emoji: "🌾", yield: 20, price: 2600,
      pests: "Aphid",
      fert: ["Day 15 Vermicompost"],
      calendar: ["Day 1 Sowing", "Day 125 Harvest"],
      previous: 30000,
    },
    {
      name: "Potato", ta: "உருளைக்கிழங்கு", soil: "Loamy", water: "Medium", days: 95,
      gains: "Soil loosening", next: "Onion",
      tip: "Avoid blight moisture",
      emoji: "🥔", yield: 30, price: 1600,
      pests: "Late blight",
      fert: ["Day 15 Compost"],
      calendar: ["Day 1 Sowing", "Day 95 Harvest"],
      previous: 38000,
    },
    {
      name: "Onion", ta: "வெங்காயம்", soil: "Loamy", water: "Medium", days: 110,
      gains: "Improves market value", next: "Garlic",
      tip: "Thrips monitoring",
      emoji: "🧅", yield: 25, price: 1800,
      pests: "Thrips",
      fert: ["Day 12 Neem cake"],
      calendar: ["Day 1 Nursery", "Day 110 Harvest"],
      previous: 35000,
    },
  ],

  summer: [
    {
      name: "Watermelon", ta: "தர்பூஸ்", soil: "Sandy loam", water: "Medium", days: 85,
      gains: "Covers soil", next: "Cowpea", tip: "Needs high sunlight",
      emoji: "🍉", yield: 3000, price: 18,
      pests: "Fruit fly",
      fert: ["Day 10 Panchagavya"],
      calendar: ["Day 1 Sowing", "Day 85 Harvest"],
      previous: 42000,
    },
    {
      name: "Tomato", ta: "தக்காளி", soil: "Loamy", water: "Medium", days: 90,
      gains: "High profit", next: "Chilli", tip: "Needs support sticks",
      emoji: "🍅", yield: 2200, price: 22,
      pests: "Whitefly",
      fert: ["Day 12 Neem cake"],
      calendar: ["Day 1 Nursery", "Day 90 Harvest"],
      previous: 46000,
    },
    {
      name: "Chilli", ta: "மிளகாய்", soil: "Red soil", water: "Low", days: 100,
      gains: "Good export value", next: "Brinjal",
      tip: "Thrips monitoring",
      emoji: "🌶️", yield: 1500, price: 35,
      pests: "Thrips",
      fert: ["Day 15 Panchagavya"],
      calendar: ["Day 1 Transplant", "Day 100 Harvest"],
      previous: 48000,
    },
    {
      name: "Okra", ta: "வெண்டை", soil: "Sandy", water: "Medium", days: 65,
      gains: "Quick harvest", next: "Pumpkin",
      tip: "Weekly picking",
      emoji: "🥒", yield: 1200, price: 28,
      pests: "Jassids",
      fert: ["Day 10 Compost tea"],
      calendar: ["Day 1 Sowing", "Day 65 Harvest"],
      previous: 30000,
    },
  ],
};

const seasons = [
  { id: "kharif", label: "Kharif", emoji: "🌧️" },
  { id: "rabi", label: "Rabi", emoji: "❄️" },
  { id: "summer", label: "Summer", emoji: "☀️" },
];

export default function CropPlanner() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [season, setSeason] = useState("");
  const [district, setDistrict] = useState("Thanjavur");
  const [expanded, setExpanded] = useState(null);
  const [crops, setCrops] = useState(fallbackCrops);
  const [aiPick, setAiPick] = useState("");

  useEffect(() => {
    async function loadPlanner() {
      try {
        const data = await api.get("/content/cropPlanner");
        setCrops(data.crops || fallbackCrops);
      } catch {
        setCrops(fallbackCrops);
      }
    }
    loadPlanner();
  }, []);

  const list = crops[season] || [];
  const districtInfo = districtProfiles[district];

  const recommended = useMemo(() => {
    if (!season) return null;
    return districtInfo?.best || list[0]?.name;
  }, [season, district, list, districtInfo]);

  return (
    <Layout title={t ? "பயிர் திட்டமிடல்" : "Crop Planner"}>
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 700 }}>📍 {t ? "மாவட்டம்" : "District"}</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12 }}>
            {Object.keys(districtProfiles).map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
          {seasons.map((s) => (
            <button key={s.id} onClick={() => { setSeason(s.id); setExpanded(null); }} style={{ padding: 12, borderRadius: 14, border: "1px solid #ddd", background: season === s.id ? "#dff7e8" : "#fff" }}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {season && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <p>🌦 {t ? "தற்போதைய வானிலை" : "Current Weather"}: <b>{districtInfo.weather}</b></p>
            <p>🤖 {t ? "சிறந்த பரிந்துரை" : "Best Recommendation"}: <b>{recommended}</b></p>
            <button onClick={() => setAiPick(recommended)} style={{ marginTop: 10, padding: 10, borderRadius: 12 }}>
              <Sparkles size={16} /> {t ? "AI சிறந்த பயிர்" : "AI Best Crop"}
            </button>
            {aiPick && <p style={{ marginTop: 10 }}>✅ {aiPick}</p>}
          </div>
        )}

        {list.map((c, i) => {
          const open = expanded === i;
          const expected = c.yield * c.price;
          const improvement = Math.round(((expected - c.previous) / c.previous) * 100);
          return (
            <div key={c.name} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, overflow: "hidden", border: "1px solid #eee" }}>
              <button onClick={() => setExpanded(open ? null : i)} style={{ width: "100%", padding: 14, display: "flex", justifyContent: "space-between", background: "none", border: "none" }}>
                <span>{c.emoji} {t ? c.ta : c.name}</span>
                {open ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: 16, display: "grid", gap: 10 }}>
                      <p>🌱 Soil: {c.soil}</p>
                      <p>💧 Water: {c.water}</p>
                      <p>📆 Duration: {c.days} days</p>
                      <p>🐛 Pest Risk: {c.pests}</p>
                      <p>💰 Expected Profit: ₹{expected.toLocaleString()}</p>
                      <p>📊 Previous Season: ₹{c.previous.toLocaleString()} ({improvement >= 0 ? "⬆" : "⬇"} {improvement}%)</p>

                      <div>
                        <b>🧪 Fertilizer Schedule</b>
                        {c.fert.map((f) => <div key={f}>• {f}</div>)}
                      </div>

                      <div>
                        <b>📅 Crop Calendar</b>
                        {c.calendar.map((step) => <div key={step}>• {step}</div>)}
                      </div>

                      <div>
                        <b>🔁 Smart Rotation</b>
                        <div>• {c.next}</div>
                        <div>• Pulses</div>
                        <div>• Sesame</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
