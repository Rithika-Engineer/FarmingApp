import { Router } from "express";
import { readData } from "../services/dataStore.js";

const router = Router();

const defaultJobs = [
  {
    titleEn: "Farm Supervisor",
    titleTa: "பண்ணை கண்காணிப்பாளர்",
    location: "Thanjavur, TN",
    company: "Green Farms Ltd",
    type: "Full Time",
    salary: "₹18,000/mo",
    emoji: "🧑‍🌾",
    phone: "9812345678"
  },
  {
    titleEn: "Tractor Driver",
    titleTa: "டிராக்டர் ஓட்டுநர்",
    location: "Madurai, TN",
    company: "Agri Works",
    type: "Contract",
    salary: "₹700/day",
    emoji: "🚜",
    phone: "9876543210"
  },
  {
    titleEn: "Field Worker",
    titleTa: "வயல் தொழிலாளர்",
    location: "Trichy, TN",
    company: "Tamil Agro",
    type: "Seasonal",
    salary: "₹550/day",
    emoji: "🌾",
    phone: "9988776655"
  }
];

router.get("/", async (_req, res) => {
  const jobs = await readData("jobs", defaultJobs);
  res.json({ jobs });
});

export default router;
