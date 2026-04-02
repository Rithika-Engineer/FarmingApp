import { Router } from "express";
import { readData, writeData } from "../services/dataStore.js";

const router = Router();

const defaultConfig = {
  cropList: ["Paddy", "Maize", "Cotton", "Groundnut"],
  marketPrice: {
    Paddy: { min: 18, max: 24 },
    Maize: { min: 16, max: 22 },
    Cotton: { min: 55, max: 70 },
    Groundnut: { min: 45, max: 60 },
  },
};

router.get("/config", async (_req, res) => {
  const config = await readData("profit-config", defaultConfig);
  res.json(config);
});

router.get("/history", async (_req, res) => {
  const history = await readData("profit-history", {});
  res.json({ history });
});

router.put("/history", async (req, res) => {
  const { history } = req.body || {};
  if (!history || typeof history !== "object") {
    return res.status(400).json({ error: "history object is required" });
  }
  const saved = await writeData("profit-history", history);
  return res.json({ history: saved });
});

export default router;
