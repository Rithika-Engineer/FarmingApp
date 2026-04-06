import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const router = Router();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Suggested questions
const suggestedQuestions = [
  { en: "Best crop for summer?", ta: "கோடையில் சிறந்த பயிர்?" },
  { en: "How to control pests?", ta: "பூச்சிகளை கட்டுப்படுத்துவது எப்படி?" },
  { en: "Organic fertilizer tips", ta: "இயற்கை உர குறிப்புகள்" },
  { en: "Market prices today", ta: "இன்றைய சந்தை விலை" },
];

// ✅ Load only once
let pestData = {};
let cropData = {};
let marketData = {};

try {
  pestData = JSON.parse(
    fs.readFileSync(path.resolve("src/data/content-pests.json"), "utf-8")
  );

  cropData = JSON.parse(
    fs.readFileSync(path.resolve("src/data/content-cropPlanner.json"), "utf-8")
  );

  marketData = JSON.parse(
    fs.readFileSync(path.resolve("src/data/market.json"), "utf-8")
  );
} catch (err) {
  console.error("❌ Dataset load failed:", err.message);
}

// ✅ choose relevant smaller data
function getRelevantDataset(question) {
  const q = question.toLowerCase();

  if (
    q.includes("pest") ||
    q.includes("disease") ||
    q.includes("leaf") ||
    q.includes("spot")
  ) {
    return pestData;
  }

  if (
    q.includes("crop") ||
    q.includes("season") ||
    q.includes("summer")
  ) {
    return cropData;
  }

  if (
    q.includes("price") ||
    q.includes("market") ||
    q.includes("sell")
  ) {
    return marketData;
  }

  return { note: "General farming advice" };
}

// ✅ suggested
router.get("/suggested", (_req, res) => {
  res.json({ suggestedQuestions });
});

// ✅ dynamic reply
router.post("/reply", async (req, res) => {
  try {
    const { text, lang = "en" } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        reply: "Please ask a farming question.",
      });
    }

    const relevantData = getRelevantDataset(text);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an expert AI Farming Assistant.

Rules:
- Answer exact user question
- Give practical farming advice
- No generic repeated answers
- If crop issue -> crop solution
- If pest issue -> pest treatment
- If market -> selling advice
- Keep response short and useful

Relevant farming data:
${JSON.stringify(relevantData).slice(0, 3000)}

Language: ${lang === "ta" ? "Tamil" : "English"}

User Question:
${text}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini error:", error.message);

    // ✅ better fallback instead of same server error
    return res.status(200).json({
      reply:
        "I can help with crops, pests, fertilizers, and market prices. Please ask your farming doubt in detail.",
    });
  }
});

export default router;