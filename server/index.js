import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateText } from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.MODEL || "gemini-1.5-flash";

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    const reply = await generateText({
      apiKey: GEMINI_API_KEY,
      modelName: MODEL,
      messages,
    });

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
