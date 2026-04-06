import { Router } from "express";
import Profile from "../model/Profile.model.js";

const router = Router();

const defaultProfile = {
  farmerName: "",
  village: "",
  land: "",
  crop: "",
  phone: "",
};

/**
 * ✅ GET profile
 */
router.get("/", async (_req, res) => {
  try {
    let profile = await Profile.findOne().sort({ updatedAt: -1 });

    if (!profile) {
      profile = await Profile.create(defaultProfile);
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ GET profile error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * ✅ UPDATE profile
 */
router.put("/", async (req, res) => {
  try {
    const {
      farmerName = "",
      village = "",
      land = "",
      crop = "",
      phone = "",
    } = req.body || {};

    const payload = {
      farmerName,
      village,
      land,
      crop,
      phone,
    };

    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, payload, {
        new: true,
        runValidators: true,
      });
    } else {
      profile = await Profile.create(payload);
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ UPDATE profile error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;