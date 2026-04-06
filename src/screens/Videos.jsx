import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { PlayCircle, Clock, Eye, ExternalLink } from "lucide-react";
import { api } from "../lib/api";

const fallbackVideos = [
  {
    titleEn: "Intro to Natural Farming",
    titleTa: "இயற்கை விவசாயம் அறிமுகம்",
    link: "https://www.youtube.com/watch?v=SZgyIwy84ew",
    duration: "12:34",
    views: "2.4M",
    category: "Farming",
    emoji: "🌿",
  },
  {
    titleEn: "Organic Fertilizer Guide",
    titleTa: "உரம் தயாரிப்பு",
    link: "https://www.youtube.com/watch?v=GwX3ViZpvLM",
    duration: "08:22",
    views: "1.1M",
    category: "Fertilizer",
    emoji: "🧪",
  },
  {
    titleEn: "Water Saving Methods",
    titleTa: "நீர் சேமிப்பு முறைகள்",
    link: "https://www.youtube.com/watch?v=hXvkuNS-oj8",
    duration: "15:10",
    views: "850K",
    category: "Irrigation",
    emoji: "💧",
  },
];

const fallbackCategories = [
  "All",
  "Farming",
  "Fertilizer",
  "Irrigation",
  "Pest Control",
];

export default function Videos() {
  const { lang } = useLanguage();
  const t = lang === "ta";

  const [videos, setVideos] = useState(fallbackVideos);
  const [categories, setCategories] = useState(fallbackCategories);
  const [selectedCategory, setSelectedCategory] = useState("All");

  function getVideoId(url) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.replace("/", "");
      }

      if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("v");
      }

      if (url.includes("/embed/")) {
        return url.split("/embed/")[1].split("?")[0];
      }

      return "";
    } catch {
      return "";
    }
  }

  function toEmbedUrl(url) {
    const id = getVideoId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      : "";
  }

  useEffect(() => {
    async function loadVideos() {
      try {
        const data = await api.get("/content/videos");
        setVideos(data.items || fallbackVideos);
        setCategories(data.categories || fallbackCategories);
      } catch {
        setVideos(fallbackVideos);
        setCategories(fallbackCategories);
      }
    }
    loadVideos();
  }, []);

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  return (
    <Layout title={t ? "கற்றல் வீடியோக்கள்" : "Learning Videos"}>
      <div style={{ padding: "16px 16px 20px" }}>
        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border: "none",
                whiteSpace: "nowrap",
                background:
                  selectedCategory === cat
                    ? "linear-gradient(135deg,#2F80ED,#27AE60)"
                    : "#fff",
                color: selectedCategory === cat ? "#fff" : "#111",
                fontWeight: 600,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Videos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {filteredVideos.map((v, i) => {
            const embedUrl = toEmbedUrl(v.link);

            return (
              <motion.div
                key={`${v.titleEn}-${i}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                {/* Video */}
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    background: "#F3F4F6",
                  }}
                >
                  <iframe
                    src={embedUrl}
                    title={v.titleEn}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />

                  {/* Click to open YouTube */}
                  <a
                    href={v.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: 20,
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <ExternalLink size={14} />
                    {t ? "திறக்க" : "Open"}
                  </a>
                </div>

                {/* Details */}
                <div style={{ padding: 16 }}>
                  <p style={{ fontWeight: 700, marginBottom: 8 }}>
                    {v.emoji} {t ? v.titleTa : v.titleEn}
                  </p>

                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6B7280" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> {v.duration}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Eye size={12} /> {v.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}