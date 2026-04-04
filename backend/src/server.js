import app from "./app.js";
import { config } from "./config.js";


const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
app.listen(config.port, () => {
  console.log(`Farm Assistant backend running on http://localhost:${config.port}`);
});


