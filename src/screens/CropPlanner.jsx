import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../lib/api";

const districtProfiles = {
  Thanjavur: { weather: "Light Rain", best: "Paddy" },
  Coimbatore: { weather: "Sunny", best: "Cotton" },
  Madurai: { weather: "Hot", best: "Groundnut" },
};

const fallbackCrops = {
  kharif: [
  {
    name: "Paddy",
    soil: "Clay / Loamy",
    water: "High",
    days: "120–150",
    emoji: "🌾",
    yield: 25,
    price: 2400,
    guide:
      "Paddy is best in Kharif because rainfall is high and this crop needs standing water for better tillering and grain filling.",
    fertGuide:
      "DAP is best at root stage, Urea during tillering, Potash during grain filling.",
    pests: [
      "Day 30 - Stem borer: spray neem oil",
      "Day 60 - Leaf folder: use chlorantraniliprole",
      "Day 90 - Blast disease: spray tricyclazole",
    ],
    fert: [
      "Day 10 - Jeevamrutham",
      "Day 25 - DAP",
      "Day 45 - Urea",
      "Day 70 - Potash",
    ],
    calendar: [
      "Day 1 - Nursery preparation",
      "Day 25 - Transplanting",
      "Day 60 - Weed control",
      "Day 90 - Panicle stage",
      "Day 135 - Harvest",
    ],
    next: "Wheat / Pulses",
  },
  {
    name: "Maize",
    soil: "Loamy",
    water: "Medium",
    days: "90–110",
    emoji: "🌽",
    yield: 18,
    price: 2200,
    guide:
      "Maize suits moderate Kharif rainfall and gives quick harvest with strong market demand.",
    fertGuide:
      "DAP + Urea + Potash supports root growth, leaf development and cob filling.",
    pests: [
      "Day 20 - Fall armyworm: neem extract",
      "Day 45 - Stem borer: chlorpyrifos spray",
      "Day 70 - Leaf blight: fungicide spray",
    ],
    fert: [
      "Day 15 - DAP",
      "Day 35 - Urea",
      "Day 55 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 30 - Thinning",
      "Day 60 - Tasseling",
      "Day 90 - Cob filling",
      "Day 110 - Harvest",
    ],
    next: "Groundnut",
  },
  {
    name: "Cotton",
    soil: "Black Soil",
    water: "Medium",
    days: "150–170",
    emoji: "🧵",
    yield: 12,
    price: 6800,
    guide:
      "Cotton performs well in black soil during Kharif and gives excellent fiber quality.",
    fertGuide:
      "FYM at sowing, Urea during vegetative stage and Potash during boll formation.",
    pests: [
      "Day 45 - Bollworm: pheromone trap",
      "Day 75 - Aphids: neem oil spray",
      "Day 110 - Whitefly: imidacloprid spray",
    ],
    fert: [
      "Day 20 - FYM",
      "Day 50 - Urea",
      "Day 90 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 45 - Vegetative growth",
      "Day 90 - Flowering",
      "Day 130 - Boll formation",
      "Day 165 - Harvest",
    ],
    next: "Pulses",
  },
  {
    name: "Soybean",
    soil: "Loamy",
    water: "Medium",
    days: "95–110",
    emoji: "🫘",
    yield: 15,
    price: 4500,
    guide:
      "Soybean is a profitable oilseed crop in Kharif and improves soil nitrogen naturally.",
    fertGuide:
      "Rhizobium seed treatment + DAP improves nodulation and pod filling.",
    pests: [
      "Day 25 - Leaf spot: fungicide spray",
      "Day 45 - Stem fly: neem spray",
      "Day 70 - Pod borer: pheromone trap",
    ],
    fert: [
      "Day 10 - Rhizobium",
      "Day 30 - DAP",
      "Day 55 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 35 - Vegetative stage",
      "Day 60 - Flowering",
      "Day 85 - Pod filling",
      "Day 105 - Harvest",
    ],
    next: "Wheat",
  },
  {
    name: "Bajra",
    soil: "Sandy",
    water: "Low",
    days: "75–90",
    emoji: "🌾",
    yield: 14,
    price: 2100,
    guide:
      "Bajra is drought resistant and highly suitable for dry Kharif conditions.",
    fertGuide:
      "DAP during early stage and Urea during tillering improve grain filling.",
    pests: [
      "Day 20 - Shoot fly: neem spray",
      "Day 45 - Smut disease: fungicide spray",
    ],
    fert: [
      "Day 15 - DAP",
      "Day 35 - Urea",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 30 - Tillering",
      "Day 55 - Ear head stage",
      "Day 85 - Harvest",
    ],
    next: "Chickpea",
  },
  {
    name: "Sugarcane",
    soil: "Loamy",
    water: "High",
    days: "300–360",
    emoji: "🎋",
    yield: 40,
    price: 3500,
    guide:
      "Sugarcane is a long-duration highly profitable crop for Kharif with strong market value.",
    fertGuide:
      "FYM during planting, Urea during tillering and Potash for cane thickness.",
    pests: [
      "Day 60 - Early shoot borer: chlorantraniliprole",
      "Day 120 - Pyrilla: neem oil spray",
      "Day 200 - Red rot: fungicide drenching",
    ],
    fert: [
      "Day 30 - FYM",
      "Day 60 - Urea",
      "Day 120 - Potash",
    ],
    calendar: [
      "Day 1 - Set planting",
      "Day 60 - Tillering",
      "Day 150 - Grand growth",
      "Day 250 - Maturity",
      "Day 330 - Harvest",
    ],
    next: "Pulses",
  },
],
 rabi: [
  {
    name: "Wheat",
    soil: "Loamy",
    water: "Medium",
    days: "120–140",
    emoji: "🌾",
    yield: 20,
    price: 2600,
    guide:
      "Wheat is ideal in cool Rabi weather and gives stable market profit with proper irrigation.",
    fertGuide:
      "DAP during early stage, Urea during tillering, Potash for grain strength.",
    pests: [
      "Day 40 - Rust disease: spray propiconazole",
      "Day 65 - Aphids: neem oil spray",
      "Day 90 - Powdery mildew: sulphur spray",
    ],
    fert: [
      "Day 15 - DAP",
      "Day 40 - Urea",
      "Day 70 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 35 - Tillering",
      "Day 70 - Flowering",
      "Day 100 - Grain filling",
      "Day 120 - Harvest",
    ],
    next: "Vegetables",
  },
  {
    name: "Mustard",
    soil: "Sandy",
    water: "Low",
    days: "100–110",
    emoji: "🌼",
    yield: 10,
    price: 5200,
    guide:
      "Mustard is one of the best oilseed crops for cool Rabi climate and gives high oil value.",
    fertGuide:
      "DAP + Sulphur during early growth improves oil content and seed filling.",
    pests: [
      "Day 35 - Aphids: neem spray",
      "Day 60 - White rust: fungicide spray",
    ],
    fert: [
      "Day 20 - Sulphur",
      "Day 40 - DAP",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 30 - Vegetative stage",
      "Day 60 - Flowering",
      "Day 100 - Harvest",
    ],
    next: "Maize",
  },
  {
    name: "Chickpea",
    soil: "Black Soil",
    water: "Low",
    days: "100–110",
    emoji: "🌱",
    yield: 11,
    price: 5400,
    guide:
      "Chickpea is a highly profitable pulse crop in Rabi and improves soil fertility.",
    fertGuide:
      "DAP + biofertilizer improves root nodules and pod formation.",
    pests: [
      "Day 45 - Pod borer: pheromone trap",
      "Day 70 - Wilt disease: fungicide drench",
    ],
    fert: [
      "Day 15 - DAP",
      "Day 30 - Biofertilizer",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 35 - Vegetative stage",
      "Day 65 - Flowering",
      "Day 105 - Harvest",
    ],
    next: "Paddy",
  },
  {
    name: "Barley",
    soil: "Loamy",
    water: "Low",
    days: "110–120",
    emoji: "🌾",
    yield: 16,
    price: 2300,
    guide:
      "Barley is a low water cereal crop suitable for Rabi with good fodder value.",
    fertGuide:
      "DAP during early stage and Potash during grain formation.",
    pests: [
      "Day 30 - Rust: fungicide spray",
      "Day 70 - Aphids: neem oil",
    ],
    fert: [
      "Day 20 - DAP",
      "Day 50 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 40 - Tillering",
      "Day 75 - Ear formation",
      "Day 115 - Harvest",
    ],
    next: "Vegetables",
  },
],

summer: [
  {
    name: "Groundnut",
    soil: "Sandy Loam",
    water: "Medium",
    days: "100–110",
    emoji: "🥜",
    yield: 14,
    price: 6200,
    guide:
      "Groundnut performs best in summer due to high sunlight and strong pod development.",
    fertGuide:
      "Gypsum strengthens pods, neem cake protects roots and improves soil health.",
    pests: [
      "Day 30 - Leaf miner: neem cake",
      "Day 60 - Tikka disease: fungicide spray",
    ],
    fert: [
      "Day 10 - Gypsum",
      "Day 30 - Neem cake",
      "Day 50 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 30 - Vegetative stage",
      "Day 60 - Pegging",
      "Day 105 - Harvest",
    ],
    next: "Paddy",
  },
  {
    name: "Sesame",
    soil: "Sandy",
    water: "Low",
    days: "85–95",
    emoji: "🌱",
    yield: 6,
    price: 7600,
    guide:
      "Sesame is highly heat tolerant and ideal for summer with excellent oil demand.",
    fertGuide:
      "FYM + Potash improves seed filling and oil content.",
    pests: [
      "Day 30 - Leaf roller: neem spray",
      "Day 55 - Capsule borer: pheromone trap",
    ],
    fert: [
      "Day 15 - FYM",
      "Day 40 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 35 - Flowering",
      "Day 90 - Harvest",
    ],
    next: "Pulses",
  },
  {
    name: "Watermelon",
    soil: "Sandy",
    water: "Medium",
    days: "75–85",
    emoji: "🍉",
    yield: 30,
    price: 1800,
    guide:
      "Watermelon gives high summer market demand and excellent profit in sandy soils.",
    fertGuide:
      "Compost + Potash improves sweetness and fruit size.",
    pests: [
      "Day 35 - Fruit fly: pheromone trap",
      "Day 55 - Powdery mildew: sulphur spray",
    ],
    fert: [
      "Day 15 - Compost",
      "Day 35 - Potash",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 30 - Flowering",
      "Day 55 - Fruit set",
      "Day 80 - Harvest",
    ],
    next: "Groundnut",
  },
  {
    name: "Cucumber",
    soil: "Sandy",
    water: "Medium",
    days: "60–70",
    emoji: "🥒",
    yield: 22,
    price: 2000,
    guide:
      "Cucumber is a fast-growing summer vegetable crop with excellent market turnover.",
    fertGuide:
      "Compost + NPK improves fruit growth and continuous flowering.",
    pests: [
      "Day 25 - Fruit fly: neem spray",
      "Day 45 - Powdery mildew: fungicide spray",
    ],
    fert: [
      "Day 15 - Compost",
      "Day 30 - NPK",
    ],
    calendar: [
      "Day 1 - Sowing",
      "Day 20 - Vine spread",
      "Day 40 - Flowering",
      "Day 65 - Harvest",
    ],
    next: "Sesame",
  },
],
};

const seasons = [
  { id: "kharif", label: "Kharif", emoji: "🌧️" },
  { id: "rabi", label: "Rabi", emoji: "❄️" },
  { id: "summer", label: "Summer", emoji: "☀️" },
];

export default function CropPlanner() {
  const [season, setSeason] = useState("kharif");
  const [district] = useState("Thanjavur");
  const [expanded, setExpanded] = useState(0);
  const [crops, setCrops] = useState(fallbackCrops);

  useEffect(() => {
    async function loadPlanner() {
      try {
        const data = await api.get("/content/cropPlanner");
        const apiCrops = data.crops || {};

        const safeData = Object.fromEntries(
          Object.entries(fallbackCrops).map(([key, fallbackArr]) => {
            const apiArr = apiCrops[key] || [];
            const merged = fallbackArr.map((fallbackCrop) => {
              const apiCrop =
                apiArr.find((a) => a.name === fallbackCrop.name) || {};

              return {
                ...fallbackCrop,
                ...apiCrop,
                guide: apiCrop.guide || fallbackCrop.guide,
                fertGuide: apiCrop.fertGuide || fallbackCrop.fertGuide,
                pests: apiCrop.pests || fallbackCrop.pests,
                fert: apiCrop.fert || fallbackCrop.fert,
                calendar: apiCrop.calendar || fallbackCrop.calendar,
              };
            });

            return [key, merged];
          })
        );

        setCrops(safeData);
      } catch {
        setCrops(fallbackCrops);
      }
    }
    loadPlanner();
  }, []);

  const list = crops[season] || [];
  const districtInfo = districtProfiles[district];
  const recommended = districtInfo?.best || list[0]?.name;

  return (
    <Layout title="Crop Planner">
      <div
        style={{
          padding: 16,
          background: "#F8FAFC",
          minHeight: "100vh",
        }}
      >
        {/* Top Recommendation Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #16A34A, #22C55E)",
            color: "white",
            padding: 20,
            borderRadius: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        >
          <p style={{ marginBottom: 8, fontSize: 15 }}>
            🌦 Current Weather: <b>{districtInfo?.weather}</b>
          </p>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            🤖 Best Recommendation: {recommended}
          </p>
        </div>

        {/* Season Tabs */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeason(s.id)}
              style={{
                padding: "12px 18px",
                borderRadius: 16,
                border: "none",
                fontWeight: "600",
                background:
                  season === s.id
                    ? "linear-gradient(135deg,#16A34A,#22C55E)"
                    : "white",
                color: season === s.id ? "white" : "#334155",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                whiteSpace: "nowrap",
              }}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        {/* Crop Cards */}
        {list.map((c, i) => {
          const open = expanded === i;
          const expected = Number(c.yield || 0) * Number(c.price || 0);

          return (
            <div
              key={c.name}
              style={{
                background: "white",
                borderRadius: 20,
                marginBottom: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpanded(open ? null : i)}
                style={{
                  width: "100%",
                  padding: 18,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                <span>
                  {c.emoji} {c.name}
                </span>
                {open ? <ChevronUp /> : <ChevronDown />}
              </button>

              {open && (
                <div style={{ padding: 18, borderTop: "1px solid #E2E8F0" }}>
                  <div
                    style={{
                      background: "#ECFCCB",
                      padding: 14,
                      borderRadius: 14,
                      marginBottom: 16,
                    }}
                  >
                    <p>🌱 Soil: {c.soil}</p>
                    <p>💧 Water: {c.water}</p>
                    <p>📅 Duration: {c.days} days</p>
                    <p
                      style={{
                        color: "#15803D",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      💰 Expected Profit: ₹{expected.toLocaleString()}
                    </p>
                  </div>

                  <Section title="🌾 Why This Crop?" text={c.guide} />
                  <Section title="🧪 Suitable Fertilizer Guide" text={c.fertGuide} />
                  <ListSection title="🐛 Pest Management" items={c.pests} />
                  <ListSection title="🧪 Fertilizer Schedule" items={c.fert} />
                  <ListSection title="📅 Crop Calendar" items={c.calendar} />
                  <Section title="🔁 Smart Rotation" text={c.next} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

function Section({ title, text }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ marginBottom: 8, color: "#166534" }}>{title}</h4>
      <p style={{ color: "#475569", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function ListSection({ title, items }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ marginBottom: 8, color: "#166534" }}>{title}</h4>
      {(items || []).map((item) => (
        <p key={item} style={{ color: "#475569", marginBottom: 4 }}>
          • {item}
        </p>
      ))}
    </div>
  );
}