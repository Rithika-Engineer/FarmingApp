import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import {
  Search,
  Phone,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";
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
    qualificationEn: [
      "Diploma / B.Sc Agriculture",
      "2+ years field experience",
      "Leadership skill",
    ],
    qualificationTa: [
      "டிப்ளமோ / B.Sc வேளாண்மை",
      "2+ வருட அனுபவம்",
      "தலைமை திறன்",
    ],
    documents: ["Aadhaar", "Resume", "Experience Certificate"],
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
    qualificationEn: ["Driving skill", "LMV / Tractor License"],
    qualificationTa: ["ஓட்டுநர் திறன்", "டிராக்டர் உரிமம்"],
    documents: ["Aadhaar", "Driving License"],
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
    qualificationEn: ["Basic farming knowledge", "Physical fitness"],
    qualificationTa: ["அடிப்படை விவசாய அறிவு", "உடல் தகுதி"],
    documents: ["Aadhaar"],
  },
  {
    titleEn: "Organic Farm Expert",
    titleTa: "இயற்கை விவசாய நிபுணர்",
    location: "Coimbatore, TN",
    company: "Natural Roots",
    type: "Full Time",
    salary: "₹25,000/mo",
    emoji: "🌿",
    phone: "9123456789",
    qualificationEn: ["Organic farming knowledge", "Soil health expertise"],
    qualificationTa: ["இயற்கை விவசாய அறிவு", "மண் ஆரோக்கிய அனுபவம்"],
    documents: ["Aadhaar", "Certificate"],
  },
  {
    titleEn: "Irrigation Technician",
    titleTa: "நீர்ப்பாசன தொழில்நுட்ப நிபுணர்",
    location: "Salem, TN",
    company: "WaterTech",
    type: "Contract",
    salary: "₹16,000/mo",
    emoji: "💧",
    phone: "9001234567",
    qualificationEn: ["Motor repair", "Drip irrigation setup"],
    qualificationTa: ["மோட்டார் சரிசெய்தல்", "டிரிப் அமைப்பு"],
    documents: ["Aadhaar", "ITI certificate"],
  },
  {
    titleEn: "Poultry Farm Manager",
    titleTa: "கோழி பண்ணை மேலாளர்",
    location: "Namakkal, TN",
    company: "Fresh Eggs Farm",
    type: "Full Time",
    salary: "₹22,000/mo",
    emoji: "🐔",
    phone: "9345678901",
    qualificationEn: ["Livestock management", "Feed knowledge"],
    qualificationTa: ["கால்நடை பராமரிப்பு", "உணவு அறிவு"],
    documents: ["Aadhaar", "Resume"],
  },
  {
    titleEn: "Dairy Farm Worker",
    titleTa: "பால் பண்ணை தொழிலாளர்",
    location: "Erode, TN",
    company: "Aavin Partner Farm",
    type: "Seasonal",
    salary: "₹650/day",
    emoji: "🥛",
    phone: "9445566778",
    qualificationEn: ["Cow handling", "Milking skill"],
    qualificationTa: ["மாடு பராமரிப்பு", "பால் பறிக்கும் திறன்"],
    documents: ["Aadhaar"],
  },
  {
    titleEn: "Seed Quality Inspector",
    titleTa: "விதை தர ஆய்வாளர்",
    location: "Villupuram, TN",
    company: "Agri Seeds",
    type: "Full Time",
    salary: "₹20,000/mo",
    emoji: "🌱",
    phone: "9556677889",
    qualificationEn: ["Seed testing knowledge", "B.Sc Agriculture"],
    qualificationTa: ["விதை பரிசோதனை அறிவு", "B.Sc வேளாண்மை"],
    documents: ["Aadhaar", "Degree Certificate"],
  },
];

export default function Jobs() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState(fallbackJobs);
  const [openJob, setOpenJob] = useState(null);

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

  const filtered = jobs.filter(
    (j) =>
      (t ? j.titleTa : j.titleEn)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title={t ? "விவசாய வேலைவாய்ப்பு" : "Farm Jobs"}>
      <div style={{ padding: "16px 16px 0" }}>
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
            placeholder={t ? "வேலை அல்லது இடம் தேட..." : "Search jobs..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((job, i) => {
            const isOpen = openJob === i;

            return (
              <motion.div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: 16,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                }}
              >
                <div
                  onClick={() => setOpenJob(isOpen ? null : i)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 14,
                        background:
                          "linear-gradient(135deg,#EBF4FF,#EDFBF1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {job.emoji}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700 }}>
                        {t ? job.titleTa : job.titleEn}
                      </p>
                      <p style={{ fontSize: 12 }}>🏢 {job.company}</p>
                      <p style={{ fontSize: 12 }}>
                        📍 {job.location} • {job.salary}
                      </p>
                    </div>

                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ marginTop: 14 }}>
                        <h4>
                          🎓 {t ? "தகுதிகள்" : "Qualifications Required"}
                        </h4>

                        {(t
                          ? job.qualificationTa
                          : job.qualificationEn
                        ).map((q, idx) => (
                          <p key={idx}>✅ {q}</p>
                        ))}

                        <h4 style={{ marginTop: 10 }}>
                          📄 {t ? "தேவையான ஆவணங்கள்" : "Documents"}
                        </h4>
                        {job.documents.map((doc, idx) => (
                          <p key={idx}>
                            <FileCheck size={14} /> {doc}
                          </p>
                        ))}

                        <a
                          href={`tel:${job.phone}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 12,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background:
                              "linear-gradient(135deg,#2F80ED,#27AE60)",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          <Phone size={14} />
                          {t ? "தொலைபேசி செய்யுங்கள்" : "Call to Apply"}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}