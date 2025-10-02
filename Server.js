import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Infinity Agent is alive on Render!");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
