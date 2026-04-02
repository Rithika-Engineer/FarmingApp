import { Router } from "express";
import { readData, writeData } from "../services/dataStore.js";

const router = Router();

const defaultProfile = {
  farmerName: "",
  village: "",
  land: "",
  crop: "",
  phone: "",
};

router.get("/", async (_req, res) => {
  const profile = await readData("profile", defaultProfile);
  res.json(profile);
});

router.put("/", async (req, res) => {
  const { farmerName = "", village = "", land = "", crop = "", phone = "" } = req.body || {};
  const payload = { farmerName, village, land, crop, phone };
  const saved = await writeData("profile", payload);
  res.json(saved);
});

export default router;
