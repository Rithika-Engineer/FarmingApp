import mongoose from "mongoose";
const profileSchema = new mongoose.Schema({
  farmerName: String,
  village: String,
  land: String,
  crop: String,
  phone: String,
});

export default mongoose.model("Profile", profileSchema);