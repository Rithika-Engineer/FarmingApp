import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Search, MapPin, Phone, Briefcase, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../lib/api";

const fallbackJobs = [
  {
    titleEn: "Farm Supervisor",
    titleTa: "பண்ணை கண்காணிப்பாளர்",
    location: "Thanjavur, TN",
    company: "Green Farms Ltd",
    type: "Full Time",
    salary: "₹18,000/mo",
    emoji: "🧑‍🌾",
    phone: "9812345678",
  },
  {
    titleEn: "Tractor Driver",
    titleTa: "டிராக்டர் ஓட்டுநர்",
    location: "Madurai, TN",
    company: "Agri Works",
    type: "Contract",
    salary: "₹700/day",
    emoji: "🚜",
    phone: "9876543210",
  },
  {
    titleEn: "Field Worker",
    titleTa: "வயல் தொழிலாளர்",
    location: "Trichy, TN",
    company: "Tamil Agro",
    type: "Seasonal",
    salary: "₹550/day",
    emoji: "🌾",
    phone: "9988776655",
  },
  {
    titleEn: "Organic Farm Expert",
    titleTa: "இயற்கை விவசாய வல்லுநர்",
    location: "Coimbatore, TN",
    company: "Natural Roots",
    type: "Full Time",
    salary: "₹25,000/mo",
    emoji: "🌿",
    phone: "9123456789",
  },
  {
    titleEn: "Irrigation Technician",
    titleTa: "நீர்ப்பாசன தொழில்நுட்பவியலாளர்",
    location: "Salem, TN",
    company: "WaterTech India",
    type: "Contract",
    salary: "₹15,000/mo",
    emoji: "💧",
    phone: "9001234567",
  },
];

const typeColors = {
  "Full Time": { bg: "#D1FAE5", color: "#065F46" },
  "Contract": { bg: "#DBEAFE", color: "#1D4ED8" },
  "Seasonal": { bg: "#FEF9C3", color: "#92400E" },
};

export default function Jobs() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState(fallbackJobs);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await api.get("/jobs");
        setJobs(data.jobs || fallbackJobs);
      } catch {
        setJobs(fallbackJobs);
      }
    }
    loadJobs();
  }, []);

  const filtered = jobs.filter(j =>
    (t ? j.titleTa : j.titleEn).toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title={t ? "விவசாய வேலைவாய்ப்பு" : "Farm Jobs"}>
      <div style={{ padding: "16px 16px 0" }}>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: "relative", marginBottom: 16 }}>
          <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="input-field"
            style={{ paddingLeft: 42 }}
            placeholder={t ? "வேலை அல்லது இடம் தேட..." : "Search jobs or location..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}
        >
          {[
            { val: "50+", label: t ? "வேலைகள்" : "Jobs" },
            { val: "20+", label: t ? "நிறுவனங்கள்" : "Companies" },
            { val: "TN", label: t ? "மாநிலம்" : "State" },
          ].map(({ val, label }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: "#2F80ED" }}>{val}</p>
              <p style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Job Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((job, i) => {
            const tc = typeColors[job.type] || { bg: "#F3F4F6", color: "#374151" };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: "#fff", borderRadius: 18,
                  padding: "16px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: "linear-gradient(135deg, #EBF4FF, #EDFBF1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {job.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                        {t ? job.titleTa : job.titleEn}
                      </p>
                      <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: tc.bg, color: tc.color }}>
                        {job.type}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>🏢 {job.company}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={11} /> {job.location}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#27AE60" }}>{job.salary}</span>
                    </div>
                  </div>
                </div>
                <motion.a
                  whileTap={{ scale: 0.97 }}
                  href={`tel:${job.phone}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    marginTop: 12, padding: "10px 14px",
                    borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #2F80ED, #27AE60)",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(47,128,237,0.25)",
                  }}
                >
                  <Phone size={13} /> {t ? "தொலைபேசி செய்யுங்கள்" : "Call to Apply"}
                </motion.a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}
