import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import Layout from "../components/Layout";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { api } from "../lib/api";

const commonDocsEn = [
  "Aadhaar Card",
  "Farmer ID / Uzhavan ID",
  "Bank Passbook",
  "Patta / Chitta",
  "Land Ownership Proof",
  "Passport Size Photo",
  "Mobile linked with Aadhaar",
];

const commonDocsTa = [
  "ஆதார் அட்டை",
  "உழவன் அட்டை",
  "வங்கி பாஸ்புக்",
  "பட்டா / சிட்டா",
  "நில உரிமை சான்று",
  "பாஸ்போர்ட் அளவு புகைப்படம்",
  "ஆதாருடன் இணைந்த மொபைல் எண்",
];

const fallbackSchemes = [
  {
    id: "pm",
    emoji: "🌾",
    nameEn: "PM-Kisan",
    nameTa: "பிஎம் கிசான்",
    descEn: "₹6,000 yearly direct farmer income support",
    descTa: "ஆண்டுக்கு ₹6,000 நேரடி வருமான உதவி",
    benefitEn: "Direct DBT support",
    benefitTa: "நேரடி DBT உதவி",
    categoryEn: "Income Support",
    categoryTa: "வருமான உதவி",
    subsidy: "₹6,000",
    applyModeEn: "Online",
    applyModeTa: "ஆன்லைன்",
    link: "https://pmkisan.gov.in",
    color: "#EBF4FF",
    documentsEn: [...commonDocsEn, "DBT enabled bank account"],
    documentsTa: [...commonDocsTa, "DBT வங்கி கணக்கு"],
    startDate: "01 Apr 2026",
    endDate: "30 Jun 2026",
    applicableForEn: ["Small farmers", "Marginal farmers"],
    applicableForTa: ["சிறு விவசாயிகள்", "சிறிய நில விவசாயிகள்"],
  },
  {
    id: "pmfby",
    emoji: "🛡️",
    nameEn: "PMFBY Crop Insurance",
    nameTa: "பயிர் காப்பீடு",
    descEn: "Insurance against crop loss and natural disasters",
    descTa: "பயிர் இழப்பு மற்றும் இயற்கை பேரிடர் காப்பீடு",
    benefitEn: "Crop loss protection",
    benefitTa: "பயிர் இழப்பு பாதுகாப்பு",
    categoryEn: "Insurance",
    categoryTa: "காப்பீடு",
    subsidy: "2% Premium",
    applyModeEn: "Online / Bank",
    applyModeTa: "ஆன்லைன் / வங்கி",
    link: "https://pmfby.gov.in",
    color: "#FEF9C3",
    documentsEn: [...commonDocsEn, "Crop sowing proof"],
    documentsTa: [...commonDocsTa, "விதைப்பு சான்று"],
    startDate: "15 May 2026",
    endDate: "31 Jul 2026",
    applicableForEn: ["All crop farmers"],
    applicableForTa: ["அனைத்து விவசாயிகள்"],
  },
  {
    id: "soil",
    emoji: "🌱",
    nameEn: "Soil Health Card",
    nameTa: "மண் ஆரோக்கிய அட்டை",
    descEn: "Free soil testing and fertilizer recommendation",
    descTa: "இலவச மண் பரிசோதனை",
    benefitEn: "Better fertilizer usage",
    benefitTa: "சரியான உர பயன்பாடு",
    categoryEn: "Soil",
    categoryTa: "மண்",
    subsidy: "Free",
    applyModeEn: "Offline",
    applyModeTa: "ஆஃப்லைன்",
    link: "https://soilhealth.dac.gov.in",
    color: "#D1FAE5",
    documentsEn: [...commonDocsEn, "Soil sample"],
    documentsTa: [...commonDocsTa, "மண் மாதிரி"],
    startDate: "Always Open",
    endDate: "No End",
    applicableForEn: ["All farmers"],
    applicableForTa: ["அனைத்து விவசாயிகள்"],
  },
  {
    id: "pmksy",
    emoji: "💧",
    nameEn: "PMKSY Irrigation",
    nameTa: "நீர்ப்பாசன மானியம்",
    descEn: "Drip and sprinkler irrigation subsidy",
    descTa: "டிரிப் மற்றும் ஸ்பிரிங்க்ளர் மானியம்",
    benefitEn: "Water saving",
    benefitTa: "நீர் சேமிப்பு",
    categoryEn: "Irrigation",
    categoryTa: "நீர்ப்பாசனம்",
    subsidy: "55%",
    applyModeEn: "Online",
    applyModeTa: "ஆன்லைன்",
    link: "https://pmksy.gov.in",
    color: "#DBEAFE",
    documentsEn: [...commonDocsEn, "Water source proof"],
    documentsTa: [...commonDocsTa, "நீர் ஆதார சான்று"],
    startDate: "01 Jun 2026",
    endDate: "31 Dec 2026",
    applicableForEn: ["Irrigation farmers"],
    applicableForTa: ["நீர்ப்பாசன விவசாயிகள்"],
  },
  {
    id: "kcc",
    emoji: "🏦",
    nameEn: "Kisan Credit Card",
    nameTa: "கிசான் கடன் அட்டை",
    descEn: "Low-interest agriculture loans",
    descTa: "குறைந்த வட்டி விவசாய கடன்",
    benefitEn: "Easy crop loan",
    benefitTa: "எளிய கடன்",
    categoryEn: "Loan",
    categoryTa: "கடன்",
    subsidy: "Low Interest",
    applyModeEn: "Bank",
    applyModeTa: "வங்கி",
    link: "https://www.myscheme.gov.in",
    color: "#FEE2E2",
    documentsEn: [...commonDocsEn, "Income certificate"],
    documentsTa: [...commonDocsTa, "வருமான சான்று"],
    startDate: "Always Open",
    endDate: "No End",
    applicableForEn: ["All eligible farmers"],
    applicableForTa: ["தகுதியான விவசாயிகள்"],
  },
  {
    id: "mech",
    emoji: "🚜",
    nameEn: "Farm Mechanization",
    nameTa: "விவசாய இயந்திர மானியம்",
    descEn: "Subsidy for tractors and machinery",
    descTa: "டிராக்டர் மற்றும் கருவி மானியம்",
    benefitEn: "Reduce labor cost",
    benefitTa: "தொழிலாளர் செலவு குறைவு",
    categoryEn: "Machinery",
    categoryTa: "இயந்திரம்",
    subsidy: "40%",
    applyModeEn: "Online",
    applyModeTa: "ஆன்லைன்",
    link: "https://agrimachinery.nic.in",
    color: "#FCE7F3",
    documentsEn: [...commonDocsEn, "Machinery quotation"],
    documentsTa: [...commonDocsTa, "கருவி விலைப்பட்டியல்"],
    startDate: "01 Jul 2026",
    endDate: "31 Dec 2026",
    applicableForEn: ["Farm owners"],
    applicableForTa: ["விவசாய நில உரிமையாளர்கள்"],
  },
  {
    id: "solar",
    emoji: "☀️",
    nameEn: "Solar Pump Subsidy",
    nameTa: "சோலார் மோட்டார் மானியம்",
    descEn: "Subsidy for solar irrigation pump installation",
    descTa: "சோலார் பம்ப் அமைப்புக்கு மானியம்",
    benefitEn: "Electricity cost saving",
    benefitTa: "மின்சார செலவு சேமிப்பு",
    categoryEn: "Energy",
    categoryTa: "ஆற்றல்",
    subsidy: "60%",
    applyModeEn: "Online",
    applyModeTa: "ஆன்லைன்",
    link: "https://mnre.gov.in",
    color: "#FEF3C7",
    documentsEn: [...commonDocsEn, "Electricity connection proof"],
    documentsTa: [...commonDocsTa, "மின்சார இணைப்பு சான்று"],
    startDate: "01 Jun 2026",
    endDate: "31 Dec 2026",
    applicableForEn: ["Pump owners", "Irrigation farmers"],
    applicableForTa: ["பம்ப் உரிமையாளர்கள்", "நீர்ப்பாசன விவசாயிகள்"],
  },
];

export default function Schemes() {
  const { lang } = useLanguage();
  const t = lang === "ta";
  const [openId, setOpenId] = useState("");
  const [schemes, setSchemes] = useState(fallbackSchemes);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await api.get("/content/schemes");
        setSchemes(Array.isArray(data) ? data : fallbackSchemes);
      } catch {
        setSchemes(fallbackSchemes);
      }
    }
    loadSchemes();
  }, []);

  return (
    <Layout title={t ? "விவசாய திட்டங்கள்" : "Farmer Schemes"}>
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        {schemes.map((s) => {
          const isOpen = openId === s.id;

          return (
            <div key={s.id} style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", overflow: "hidden" }}>
              <button
                onClick={() => setOpenId(isOpen ? "" : s.id)}
                style={{ width: "100%", padding: 16, border: "none", background: "none", display: "flex", gap: 12, alignItems: "center", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {s.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{t ? s.nameTa : s.nameEn}</p>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>{t ? s.descTa : s.descEn}</p>
                </div>

                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  <p><b>📅 {t ? "தேதி" : "Dates"}:</b> {s.startDate} → {s.endDate}</p>
                  <p><b>💰 {t ? "மானியம்" : "Subsidy"}:</b> {s.subsidy}</p>
                  <p><b>🎯 {t ? "வகை" : "Category"}:</b> {t ? s.categoryTa : s.categoryEn}</p>
                  <p><b>✨ {t ? "நன்மை" : "Benefit"}:</b> {t ? s.benefitTa : s.benefitEn}</p>
                  <p><b>🖥 {t ? "விண்ணப்ப முறை" : "Apply Mode"}:</b> {t ? s.applyModeTa : s.applyModeEn}</p>

                  <div style={{ marginTop: 14 }}>
                    <h4 style={{ fontWeight: 800 }}>
                      👨‍🌾 {t ? "யார் விண்ணப்பிக்கலாம்" : "Who Can Apply"}
                    </h4>
                    {(t ? s.applicableForTa : s.applicableForEn).map((a, idx) => (
                      <p key={idx}>✅ {a}</p>
                    ))}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <h4 style={{ fontWeight: 800 }}>
                      📄 {t ? "தேவையான ஆவணங்கள்" : "Required Documents"}
                    </h4>
                    {(t ? s.documentsTa : s.documentsEn).map((doc, idx) => (
                      <p key={idx}>📎 {doc}</p>
                    ))}
                  </div>

                  <a
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#2563EB,#16A34A)",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 700,
                      marginTop: 14,
                    }}
                  >
                    <ExternalLink size={16} />
                    {t ? "அதிகாரப்பூர்வ இணையதளம்" : "Visit Official Website"}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}