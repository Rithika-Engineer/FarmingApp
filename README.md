# 🌾 Farm Assistant

React + Vite + TailwindCSS frontend with an Express backend for Indian farmers.

## 📁 Structure

```
Farm-Assistant-master/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                 ← Images
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── Sidebar.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── screens/                ← 19 screens
│   │   ├── Welcome.jsx
│   │   ├── Home.jsx
│   │   ├── Weather.jsx
│   │   ├── SmartWeather.jsx
│   │   ├── Market.jsx
│   │   ├── Chatbot.jsx
│   │   ├── VoiceChat.jsx
│   │   ├── CropPlanner.jsx
│   │   ├── SeasonCrops.jsx
│   │   ├── PestControl.jsx
│   │   ├── NaturalFarming.jsx
│   │   ├── Schemes.jsx
│   │   ├── Profit.jsx
│   │   ├── Jobs.jsx
│   │   ├── Videos.jsx
│   │   ├── Help.jsx
│   │   ├── FarmingMessage.jsx
│   │   ├── Language.jsx
│   │   └── Profile.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── LanguageContext.jsx
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Setup

### 1) Frontend

```bash
npm install
npm run dev             # starts on http://localhost:5173
```

### 2) Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev             # starts on http://localhost:4000
```

Set `OPENWEATHER_API_KEY` inside `backend/.env`.

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router DOM v7 | Routing |

## 🔗 Backend API

The backend is now inside this repo at `backend/`.
See `backend/README.md` for full endpoint list and configuration.
