# Farm Assistant Backend

Express backend for the Farm Assistant frontend.

## Features

- Weather proxy endpoint (OpenWeather API key stays on server)
- Chatbot reply API
- Market prices API (JSON file persistence)
- Profile API (JSON file persistence)
- Jobs API

## Setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` and set:

- `OPENWEATHER_API_KEY`
- `PORT` (optional, defaults to `4000`)
- `CORS_ORIGIN` (optional, defaults to `http://localhost:5173`)

## Run

```bash
npm run dev
```

Server will run on `http://localhost:4000`.

## API Endpoints

- `GET /api/health`
- `GET /api/weather/current?lat=<lat>&lon=<lon>`
- `GET /api/chatbot/suggested`
- `POST /api/chatbot/reply` with `{ "text": "question", "lang": "en|ta" }`
- `GET /api/market`
- `PUT /api/market`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/jobs`
- `GET /api/content/:key` where key is:
  - `schemes`
  - `videos`
  - `help`
  - `farmingMessage`
  - `pests`
  - `naturalFarming`
  - `cropPlanner`
  - `seasonCrops`
- `PUT /api/content/videos` with `{ "categories": [], "items": [] }`
  - Auto-normalizes YouTube links to embed format
- `GET /api/profit/config`
- `GET /api/profit/history`
- `PUT /api/profit/history`
