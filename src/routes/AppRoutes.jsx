import { Routes, Route } from "react-router-dom";
import Welcome from "../screens/Welcome";
import Language from "../screens/Language";
import Profile from "../screens/Profile";
import Home from "../screens/Home";
import Weather from "../screens/Weather";
import SmartWeather from "../screens/SmartWeather";
import Market from "../screens/Market";
import Chatbot from "../screens/Chatbot";
import VoiceChat from "../screens/VoiceChat";
import CropPlanner from "../screens/CropPlanner";
import SeasonCrops from "../screens/SeasonCrops";
import PestControl from "../screens/PestControl";
import Videos from "../screens/Videos";
import Schemes from "../screens/Schemes";
import Profit from "../screens/Profit";
import Jobs from "../screens/Jobs";
import NaturalFarming from "../screens/NaturalFarming";
import Help from "../screens/Help";
import FarmingMessage from "../screens/FarmingMessage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/language" element={<Language />} />
      <Route path="/profile" element={<Profile />} />
      
      <Route path="/home" element={<Home />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/smartweather" element={<SmartWeather />} />
      <Route path="/market" element={<Market />} />
      <Route path="/chat" element={<Chatbot />} />
      <Route path="/assistant" element={<VoiceChat />} />
      
      <Route path="/cropplanner" element={<CropPlanner />} />
      <Route path="/season" element={<SeasonCrops />} />
      <Route path="/pesticide" element={<PestControl />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/profit" element={<Profit />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/natural" element={<NaturalFarming />} />
      <Route path="/help" element={<Help />} />
      <Route path="/message" element={<FarmingMessage />} />
    </Routes>
  );
}
