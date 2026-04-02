import { Router } from "express";
import { readData, writeData } from "../services/dataStore.js";

const router = Router();

const defaults = {
  schemes: [
    { id: "pm", emoji: "🌾", nameEn: "PM-Kisan", nameTa: "PM-Kisan", descEn: "₹6,000 per year direct income support to all farmer families", descTa: "அனைத்து விவசாய குடும்பங்களுக்கும் ஆண்டுக்கு ₹6,000 நேரடி வருமான உதவி", link: "https://pmkisan.gov.in", tag: "Income", color: "#EBF4FF", tagColor: "#2F80ED" },
    { id: "pmfby", emoji: "🛡️", nameEn: "PMFBY", nameTa: "PMFBY (பயிர் காப்பீடு)", descEn: "Low premium crop insurance for protection against natural calamities", descTa: "இயற்கை பேரிடர்களிலிருந்து பாதுகாப்பு – குறைந்த பிரீமியம் பயிர் காப்பீடு", link: "https://pmfby.gov.in", tag: "Insurance", color: "#FEF9C3", tagColor: "#92400E" },
    { id: "soil", emoji: "🌱", nameEn: "Soil Health Card", nameTa: "மண் ஆரோக்கிய அட்டை", descEn: "Free soil testing and personalized fertilizer recommendations", descTa: "இலவச மண் பரிசோதனை மற்றும் தனிப்பயன் உர பரிந்துரை", link: "https://soilhealth.dac.gov.in", tag: "Free", color: "#D1FAE5", tagColor: "#065F46" },
    { id: "pmksy", emoji: "💧", nameEn: "PMKSY", nameTa: "நுண் நீர்ப்பாசனம் (PMKSY)", descEn: "Subsidies on drip and sprinkler irrigation systems", descTa: "டிரிப் & ஸ்பிரிங்க்லர் நீர்ப்பாசன மானியம்", link: "https://pmksy.gov.in", tag: "Subsidy", color: "#EBF4FF", tagColor: "#1D4ED8" },
    { id: "pkvy", emoji: "🌿", nameEn: "PKVY (Organic)", nameTa: "இயற்கை விவசாயம் (PKVY)", descEn: "Financial support for transitioning to organic farming", descTa: "இயற்கை விவசாயத்திற்கு மாறுவதற்கு நிதி உதவி", link: "https://pgsindia-ncof.gov.in", tag: "Organic", color: "#D1FAE5", tagColor: "#065F46" },
    { id: "kcc", emoji: "🏦", nameEn: "Kisan Credit Card", nameTa: "கிசான் கிரெடிட் கார்டு", descEn: "Low-interest crop loans up to ₹3 lakh for eligible farmers", descTa: "தகுதியான விவசாயிகளுக்கு ₹3 லட்சம் வரை குறைந்த வட்டி கடன்", link: "https://www.myscheme.gov.in", tag: "Loan", color: "#FEE2E2", tagColor: "#DC2626" }
  ],
  videos: {
    categories: ["All", "Farming", "Fertilizer", "Irrigation", "Pest Control"],
    items: [
      { titleEn: "Intro to Natural Farming", titleTa: "இயற்கை விவசாயம் அறிமுகம்", link: "https://www.youtube.com/embed/G0B-m7vV4fA", duration: "12:34", views: "2.4M", category: "Farming", emoji: "🌿" },
      { titleEn: "Organic Fertilizer Guide", titleTa: "உரம் தயாரிப்பு", link: "https://www.youtube.com/embed/q6ioP1L1QZI", duration: "08:22", views: "1.1M", category: "Fertilizer", emoji: "🧪" },
      { titleEn: "Water Saving Methods", titleTa: "நீர் சேமிப்பு முறைகள்", link: "https://www.youtube.com/embed/VI5jz7wKZ2o", duration: "15:10", views: "850K", category: "Irrigation", emoji: "💧" }
    ]
  },
  help: {
    contacts: [
      { icon: "📞", titleEn: "Farmer Helpline", titleTa: "விவசாயி ஹெல்ப்லைன்", number: "1800-180-1551", tel: "18001801551", descEn: "Free call • 24/7 • All crops & schemes", descTa: "இலவச அழைப்பு • 24/7 • அனைத்து சேவைகளும்", color: "#EBF4FF", btnColor: "#2F80ED" },
      { icon: "🏛️", titleEn: "District Agriculture Office", titleTa: "மாவட்ட விவசாய அலுவலகம்", number: "1967", tel: "1967", descEn: "Contact local agriculture officers near you", descTa: "உங்கள் பகுதி விவசாய அதிகாரிகளை தொடர்பு கொள்ளுங்கள்", color: "#EDFBF1", btnColor: "#27AE60" },
      { icon: "🌾", titleEn: "KISAN Call Centre", titleTa: "கிசான் அழைப்பு மையம்", number: "1551", tel: "1551", descEn: "Crop advice & market info in Tamil", descTa: "தமிழில் பயிர் ஆலோசனை மற்றும் சந்தை தகவல்", color: "#FEF9C3", btnColor: "#92400E" }
    ],
    menuOptions: [
      { num: "1", en: "Weather Info", ta: "வானிலை தகவல்" },
      { num: "2", en: "Natural Farming Guide", ta: "இயற்கை வேளாண்மை ஆலோசனை" },
      { num: "3", en: "Market Prices", ta: "சந்தை விலை" },
      { num: "4", en: "Government Schemes", ta: "அரசு திட்டங்கள்" }
    ]
  },
  farmingMessage: {
    quotes: [
      { en: "Farming is the backbone of civilization.", ta: "விவசாயம் நாகரிகத்தின் முதுகெலும்பு." },
      { en: "Natural food is the best medicine.", ta: "இயற்கை உணவே சிறந்த மருந்து." },
      { en: "A farmer's hands shape the future of food.", ta: "விவசாயியின் கைகளே உலக உணவின் எதிர்காலம்." }
    ]
  },
  pests: [
    { nameEn: "Stem Borer", nameTa: "தண்டு துளைப்பான்", emoji: "🐛", symptoms: "Dead heart in young plants, white ear in mature plants", symptomsTa: "இளம் தாவரங்களில் இறந்த மையம், முதிர்ந்தவற்றில் வெள்ளை கதிர்", treatment: "Apply Carbofuran 3G or use light traps", treatmentTa: "கார்போஃபுரான் 3G தெளி அல்லது ஒளி பொறி வைக்கவும்", severity: "high", crop: "Paddy" },
    { nameEn: "Aphids", nameTa: "அட்டைப் பூச்சி", emoji: "🪲", symptoms: "Curling of leaves, sticky honeydew, sooty mold", symptomsTa: "இலைகள் சுருண்டல், பிசுக்கு, கறுப்பு அச்சு", treatment: "Spray neem oil (5ml/L) or release ladybird beetles", treatmentTa: "வேம்பெண்ணெய் 5ml/L தெளி அல்லது முட்டைக்கோஸ் வண்டுகளை விடவும்", severity: "medium", crop: "Vegetables" },
    { nameEn: "Fall Armyworm", nameTa: "வீழ்ச்சி படையெடுப்பு புழு", emoji: "🐌", symptoms: "Irregular windowing of leaves, frass presence", symptomsTa: "இலைகளில் ஒழுங்கற்ற துளைகள், மலம் காணப்படும்", treatment: "Apply Spinetoram or Spinosad. Use pheromone traps", treatmentTa: "ஸ்பின்டோரம் அல்லது ஸ்பினோசாட் தெளி. ஃபெரோமோன் பொறி வையுங்கள்", severity: "high", crop: "Maize" },
    { nameEn: "Whitefly", nameTa: "வெள்ளை ஈ", emoji: "🦟", symptoms: "Yellowing of leaves, sticky substance under leaf", symptomsTa: "இலை மஞ்சளாவது, இலை அடியில் பிசுக்கு", treatment: "Yellow sticky traps + neem extract spray", treatmentTa: "மஞ்சள் ஒட்டும் பொறி + வேம்பெண்ணெய் தெளி", severity: "medium", crop: "Cotton" },
    { nameEn: "Leaf Rust", nameTa: "இலை துரு", emoji: "🍂", symptoms: "Orange pustules on leaves, premature defoliation", symptomsTa: "இலைகளில் ஆரஞ்சு நிற கொப்புளங்கள், இலை உதிர்வு", treatment: "Spray Propiconazole 25EC at 0.1%", treatmentTa: "புரோபிகோனசோல் 25EC 0.1% தெளி", severity: "medium", crop: "Wheat" }
  ],
  naturalFarming: {
    paddy: { emoji: "🌾", fert: { en: "Jeevamrutham", ta: "ஜீவாமிருதம்" }, prep: { en: ["Cow dung 10 kg", "Cow urine 10 L", "Add jaggery", "Ferment 24 hours"], ta: ["மாட்டு சாணம் 10 கிலோ", "மாட்டு சிறுநீர் 10 லிட்டர்", "கருப்பட்டி சேர்க்கவும்", "24 மணி நேரம் ஊறவிடவும்"] }, apply: { en: "Spray once every 15 days", ta: "15 நாட்களுக்கு ஒருமுறை தெளிக்கவும்" }, safety: { en: "Wear gloves while spraying", ta: "கையுறை அணிந்து தெளிக்கவும்" }, benefit: { en: "Improves soil fertility and water retention", ta: "மண் வளம் மற்றும் நீர் தக்க வைப்பு உயரும்" } },
    banana: { emoji: "🍌", fert: { en: "Panchagavya", ta: "பஞ்சகவ்யம்" }, prep: { en: ["Add milk, curd, ghee", "Ferment for 7 days"], ta: ["பால், தயிர், நெய் சேர்க்கவும்", "7 நாட்கள் ஊறவிடவும்"] }, apply: { en: "Every 20 days", ta: "20 நாட்களுக்கு ஒருமுறை" }, safety: { en: "Store in shade; avoid direct sunlight", ta: "நிழலில் சேமித்து வைக்கவும்" }, benefit: { en: "Improves fruit size & quality", ta: "பழ அளவும் தரமும் உயரும்" } }
  },
  cropPlanner: {
    crops: {
      kharif: [
        { name: "Paddy", ta: "நெல்", soil: "Clay / Loamy", water: "High", days: "120–150", gains: "Adds organic matter", next: "Wheat / Pulses", tip: "Avoid water stress during tillering", emoji: "🌾" },
        { name: "Maize", ta: "சோளம்", soil: "Well drained", water: "Medium", days: "90–110", gains: "Improves soil tilth", next: "Potato / Pulses", tip: "Ensure weed control in first 30 days", emoji: "🌽" }
      ],
      rabi: [{ name: "Wheat", ta: "கோதுமை", soil: "Loam", water: "Medium", days: "120–140", gains: "Moderate residue", next: "Paddy / Maize", tip: "Avoid late sowing", emoji: "🌾" }],
      summer: [{ name: "Watermelon", ta: "தர்பூஸ்", soil: "Sandy loam", water: "Medium", days: "80–95", gains: "Covers soil surface", next: "Pulses", tip: "Needs high sunlight", emoji: "🍉" }]
    },
    seasons: [
      { id: "kharif", emoji: "🌧️", labelEn: "Kharif", subEn: "Jun – Oct", labelTa: "காரிப்", subTa: "ஜூன்–அக்" },
      { id: "rabi", emoji: "❄️", labelEn: "Rabi", subEn: "Nov – Feb", labelTa: "ரபி", subTa: "நவ்–பிப்" },
      { id: "summer", emoji: "☀️", labelEn: "Summer", subEn: "Mar – May", labelTa: "கோடை", subTa: "மார்–மே" }
    ]
  },
  seasonCrops: {
    cropNameTa: { Paddy: "நெல்", Maize: "சோளம்", Groundnut: "நிலக்கடலை", Cotton: "பருத்தி", Soybean: "சோயாபீன்", Chilli: "மிளகாய்", Wheat: "கோதுமை", Mustard: "கடுகு", Onion: "வெங்காயம்", Peas: "பட்டாணி", Watermelon: "தர்பூசணி", Sesame: "எள்", "Green gram": "பச்சைப்பயறு", Cowpea: "தட்டைப் பயறு" },
    cropData: {
      Paddy: { soil: "Clay / Loamy", water: "High", days: "120–150", next: "Pulses / Sesame", emoji: "🌾", speakEn: "Paddy requires high water. Ensure proper irrigation.", speakTa: "நெல் பயிருக்கு அதிக நீர் தேவைப்படுகிறது." },
      Maize: { soil: "Well drained", water: "Medium", days: "90–110", next: "Green gram", emoji: "🌽", speakEn: "Maize is a high income crop. Ensure weed control.", speakTa: "சோளம் நல்ல வருமானம் தரும் பயிர்." },
      Groundnut: { soil: "Sandy loam", water: "Low", days: "100–120", next: "Rice / Maize", emoji: "🥜", speakEn: "Groundnut fixes nitrogen. Great for rotation.", speakTa: "நிலக்கடலை நைட்ரஜன் நிர்ணயிக்கும். சுழற்சிக்கு சிறந்தது." }
    },
    seasonMeta: {
      kharif: { emoji: "🌧️", labelEn: "Kharif", labelTa: "காரிப்", crops: ["Paddy", "Maize", "Groundnut", "Cotton", "Soybean", "Chilli"] },
      rabi: { emoji: "❄️", labelEn: "Rabi", labelTa: "ரபி", crops: ["Wheat", "Mustard", "Onion", "Peas"] },
      summer: { emoji: "☀️", labelEn: "Summer", labelTa: "கோடை", crops: ["Watermelon", "Sesame", "Green gram", "Cowpea"] }
    }
  }
};

const severityConfig = {
  high: { label: "High Risk", labelTa: "அதிக ஆபத்து", bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
  medium: { label: "Medium", labelTa: "நடுத்தர", bg: "#FEF9C3", color: "#92400E", dot: "#F59E0B" },
  low: { label: "Low", labelTa: "குறைவு", bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
};

function normalizeYoutubeLink(url) {
  if (!url || typeof url !== "string") return "";
  if (url.includes("youtube.com/embed/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
}

router.get("/:key", async (req, res) => {
  const { key } = req.params;
  if (!Object.hasOwn(defaults, key)) {
    return res.status(404).json({ error: "Unknown content key" });
  }

  const data = await readData(`content-${key}`, defaults[key]);
  if (key === "pests") {
    return res.json({ pests: data, severityConfig });
  }
  return res.json(data);
});

router.put("/videos", async (req, res) => {
  const { categories, items } = req.body || {};

  if (!Array.isArray(categories) || !Array.isArray(items)) {
    return res.status(400).json({ error: "categories and items arrays are required" });
  }

  const normalizedItems = items.map((item) => ({
    ...item,
    link: normalizeYoutubeLink(item?.link),
  }));

  const payload = { categories, items: normalizedItems };
  const saved = await writeData("content-videos", payload);

  return res.json(saved);
});

export default router;
