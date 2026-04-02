import { Router } from "express";

const router = Router();

const suggestedQuestions = [
  { en: "Best crop for summer?", ta: "கோடையில் சிறந்த பயிர்?" },
  { en: "How to control pests?", ta: "பூச்சிகளை கட்டுப்படுத்துவது எப்படி?" },
  { en: "Organic fertilizer tips", ta: "இயற்கை உர குறிப்புகள்" },
  { en: "Market prices today", ta: "இன்றைய சந்தை விலை" },
];

function getBotReply(text, tamil) {
  const lower = text.toLowerCase();
  if (lower.includes("crop") || lower.includes("பயிர்") || lower.includes("summer") || lower.includes("கோடை")) {
    return tamil
      ? "🌾 உங்கள் நிலம் வகை மற்றும் பருவகாலம் சொல்லுங்கள். கோடையில் நிலக்கடலை, சோளம் பொருத்தமானது."
      : "🌾 In summer, groundnut and sorghum work well. Tell me your land type for a personalized recommendation.";
  }
  if (lower.includes("fertilizer") || lower.includes("உரம்")) {
    return tamil
      ? "🧪 இயற்கை உரம் நல்லது. ஜீவாமிருதம், பஞ்சகவ்யம் மிகவும் பயனுள்ளது."
      : "🧪 Organic fertilizers like Jeevamrutham and Panchagavya are excellent. Compost also boosts yield significantly.";
  }
  if (lower.includes("pest") || lower.includes("பூச்சி")) {
    return tamil
      ? "🐛 வேம்பெண்ணெய் கரைசல் பயன்படுத்தவும். வாரம் ஒருமுறை தெளிக்கவும்."
      : "🐛 Use neem oil solution (5ml per liter). Spray once a week for best results. Avoid chemical spraying on rainy days.";
  }
  if (lower.includes("price") || lower.includes("விலை") || lower.includes("market") || lower.includes("சந்தை")) {
    return tamil
      ? "💰 சந்தை பகுதியில் மாவட்ட வாரியாக இன்றைய விலை காணலாம்."
      : "💰 Check the Market section for real-time district-wise prices for paddy, banana, groundnut, and more.";
  }
  if (lower.includes("profit") || lower.includes("லாபம்")) {
    return tamil
      ? "📊 லாப கணக்கீட்டில் மொத்த செலவு மற்றும் விற்பனை விலை உள்ளிட்டு லாபம் தெரிந்துகொள்ளுங்கள்."
      : "📊 Use the Profit Calculator to enter your total costs and selling price to calculate your earnings accurately.";
  }
  if (lower.includes("weather") || lower.includes("வானிலை")) {
    return tamil
      ? "🌤 வானிலை பகுதியில் இன்றைய வெப்பநிலை, ஈரப்பதம் மற்றும் மழை முன்னறிவிப்பு காணலாம்."
      : "🌤 Check the Weather section for today's temperature, humidity, and 7-day forecast for your location.";
  }
  return tamil
    ? "🤖 உங்கள் கேள்வி புரியவில்லை. சற்று தெளிவாக கேளுங்கள். பயிர், பூச்சி, உரம், விலை, வானிலை பற்றி கேட்கலாம்."
    : "🤖 I can help with crops, pests, fertilizers, market prices, and weather. Please ask a specific question!";
}

router.get("/suggested", (_req, res) => {
  res.json({ suggestedQuestions });
});

router.post("/reply", (req, res) => {
  const { text, lang = "en" } = req.body || {};

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  const reply = getBotReply(String(text), lang === "ta");
  return res.json({ reply });
});

export default router;
