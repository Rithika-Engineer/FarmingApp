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
    id: "pmkisan",
    emoji: "🌾",
    color: "#E0F2FE",
    nameEn: "PM-Kisan",
    nameTa: "பிஎம் கிசான்",
    descEn: "₹6,000 per year direct income support to all farmer families",
    descTa: "ஆண்டுக்கு ₹6,000 நேரடி உதவி",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    subsidy: "₹6,000 / year",
    categoryEn: "Income Support",
    categoryTa: "வருமான உதவி",
    benefitEn: "Direct bank transfer support",
    benefitTa: "நேரடி வங்கி உதவி",
    applyModeEn: "Online / CSC",
    applyModeTa: "ஆன்லைன் / CSC",
    applicableForEn: ["All farmer families", "Small farmers"],
    applicableForTa: ["அனைத்து விவசாயிகள்", "சிறு விவசாயிகள்"],
    documentsEn: [...commonDocsEn],
    documentsTa: [...commonDocsTa],
    link: "https://pmkisan.gov.in",
  },
  {
    id: "pmfby",
    emoji: "🛡️",
    color: "#FEF3C7",
    nameEn: "PMFBY",
    nameTa: "பிஎம் பயிர் காப்பீடு",
    descEn: "Low premium crop insurance for protection against natural calamities",
    descTa: "குறைந்த கட்டண பயிர் காப்பீடு",
    startDate: "01 Jun 2026",
    endDate: "31 Jul 2026",
    subsidy: "2% Premium",
    categoryEn: "Insurance",
    categoryTa: "காப்பீடு",
    benefitEn: "Crop loss protection",
    benefitTa: "பயிர் இழப்பு பாதுகாப்பு",
    applyModeEn: "Bank / Online",
    applyModeTa: "வங்கி / ஆன்லைன்",
    applicableForEn: ["All crop farmers"],
    applicableForTa: ["அனைத்து பயிர் விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Crop Details"],
    documentsTa: [...commonDocsTa, "பயிர் விவரம்"],
    link: "https://pmfby.gov.in",
  },
  {
    id: "soil",
    emoji: "🌱",
    color: "#D1FAE5",
    nameEn: "Soil Health Card",
    nameTa: "மண் ஆரோக்கிய அட்டை",
    descEn: "Free soil testing and personalized fertilizer recommendations",
    descTa: "இலவச மண் பரிசோதனை",
    startDate: "Always Open",
    endDate: "No Last Date",
    subsidy: "Free",
    categoryEn: "Soil Health",
    categoryTa: "மண் ஆரோக்கியம்",
    benefitEn: "Better fertilizer planning",
    benefitTa: "சரியான உர திட்டம்",
    applyModeEn: "Offline / Agri Office",
    applyModeTa: "ஆஃப்லைன் / வேளாண்மை அலுவலகம்",
    applicableForEn: ["All farmers"],
    applicableForTa: ["அனைத்து விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Soil Sample"],
    documentsTa: [...commonDocsTa, "மண் மாதிரி"],
    link: "https://soilhealth.dac.gov.in",
  },
   {
    id: "pmksy",
    emoji: "💧",
    color: "#DBEAFE",
    nameEn: "PMKSY",
    nameTa: "நீர் பாசன திட்டம்",
    descEn: "Subsidy for drip and sprinkler irrigation systems",
    descTa: "டிரிப் மற்றும் ஸ்பிரிங்களர் பாசன மானியம்",
    startDate: "01 Apr 2026",
    endDate: "31 Mar 2027",
    subsidy: "Up to 55%",
    categoryEn: "Irrigation",
    categoryTa: "நீர் பாசனம்",
    benefitEn: "Water saving irrigation support",
    benefitTa: "நீர் சேமிப்பு பாசன உதவி",
    applyModeEn: "Online / Agri Office",
    applyModeTa: "ஆன்லைன் / வேளாண்மை அலுவலகம்",
    applicableForEn: ["All irrigated farmers"],
    applicableForTa: ["அனைத்து பாசன விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Water source proof"],
    documentsTa: [...commonDocsTa, "நீர் ஆதார சான்று"],
    link: "https://pmksy.gov.in",
  },
  {
    id: "kcc",
    emoji: "💳",
    color: "#FCE7F3",
    nameEn: "Kisan Credit Card",
    nameTa: "கிசான் கடன் அட்டை",
    descEn: "Low interest agricultural loan support",
    descTa: "குறைந்த வட்டி விவசாய கடன்",
    startDate: "Always Open",
    endDate: "No Last Date",
    subsidy: "4% Interest",
    categoryEn: "Farm Loan",
    categoryTa: "விவசாய கடன்",
    benefitEn: "Easy crop loan access",
    benefitTa: "எளிய பயிர் கடன் வசதி",
    applyModeEn: "Bank",
    applyModeTa: "வங்கி",
    applicableForEn: ["All farmers", "Tenant farmers"],
    applicableForTa: ["அனைத்து விவசாயிகள்", "குத்தகை விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Land cultivation proof"],
    documentsTa: [...commonDocsTa, "நில சாகுபடி சான்று"],
    link: "https://www.myscheme.gov.in",
  },
  {
    id: "organic",
    emoji: "🌿",
    color: "#DCFCE7",
    nameEn: "Organic Farming Support",
    nameTa: "இயற்கை விவசாய மானியம்",
    descEn: "Support for organic inputs and certification",
    descTa: "இயற்கை உள்ளீடுகள் மற்றும் சான்றிதழ் உதவி",
    startDate: "01 Jul 2026",
    endDate: "31 Dec 2026",
    subsidy: "₹20,000 / acre",
    categoryEn: "Organic Farming",
    categoryTa: "இயற்கை விவசாயம்",
    benefitEn: "Organic farming encouragement",
    benefitTa: "இயற்கை விவசாய ஊக்கம்",
    applyModeEn: "Agri Office",
    applyModeTa: "வேளாண்மை அலுவலகம்",
    applicableForEn: ["Organic farmers"],
    applicableForTa: ["இயற்கை விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Farm input bills"],
    documentsTa: [...commonDocsTa, "உள்ளீடு ரசீது"],
    link: "https://pgsindia-ncof.gov.in",
  },
  {
    id: "solar",
    emoji: "☀️",
    color: "#FEF9C3",
    nameEn: "PM Kusum Solar Pump",
    nameTa: "சோலார் பம்ப் மானியம்",
    descEn: "Subsidy for solar irrigation pumps",
    descTa: "சோலார் பாசன பம்ப் மானியம்",
    startDate: "01 May 2026",
    endDate: "31 Aug 2026",
    subsidy: "Up to 60%",
    categoryEn: "Solar",
    categoryTa: "சோலார்",
    benefitEn: "Free solar irrigation support",
    benefitTa: "சோலார் பாசன உதவி",
    applyModeEn: "Online",
    applyModeTa: "ஆன்லைன்",
    applicableForEn: ["Pump set farmers"],
    applicableForTa: ["பம்ப் செட் விவசாயிகள்"],
    documentsEn: [...commonDocsEn, "Pump EB connection"],
    documentsTa: [...commonDocsTa, "மின் இணைப்பு சான்று"],
    link: "https://pmkusum.mnre.gov.in",
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

        if (Array.isArray(data)) {
          const merged = fallbackSchemes.map((fallback) => {
            const apiScheme = data.find((d) => d.id === fallback.id);
            return {
              ...fallback,
              ...apiScheme,
            };
          });

          setSchemes(merged);
        } else {
          setSchemes(fallbackSchemes);
        }
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
            <div
              key={s.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpenId(isOpen ? "" : s.id)}
                style={{
                  width: "100%",
                  padding: 16,
                  border: "none",
                  background: "none",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {s.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{t ? s.nameTa : s.nameEn}</p>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>
                    {t ? s.descTa : s.descEn}
                  </p>
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
                    <h4>👨‍🌾 {t ? "யார் விண்ணப்பிக்கலாம்" : "Who Can Apply"}</h4>
                    {((t ? s.applicableForTa : s.applicableForEn) || []).map((a, idx) => (
                      <p key={idx}>✅ {a}</p>
                    ))}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <h4>📄 {t ? "தேவையான ஆவணங்கள்" : "Required Documents"}</h4>
                    {((t ? s.documentsTa : s.documentsEn) || []).map((doc, idx) => (
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