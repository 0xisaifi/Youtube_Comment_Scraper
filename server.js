import express from "express";
import fetch from "node-fetch"; // Node 18+ has built-in fetch, optional
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // allow all origins

const YT_API_KEY = process.env.YT_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Existing endpoint for scraping YouTube comments
app.post("/scrape-comments", async (req, res) => {
  const { videoIds, commentCount } = req.body;
  try {
    const results = [];
    for (let videoId of videoIds) {
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${commentCount}&key=${YT_API_KEY}`;
      const ytResponse = await fetch(url);
      const data = await ytResponse.json();
      const comments =
        data.items?.map(
          (item) => item.snippet.topLevelComment.snippet.textDisplay
        ) || [];
      results.push({ videoId, comments });
    }
    res.json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// New endpoint for AI chat
app.post("/ask-ai", async (req, res) => {
  const { message, history } = req.body;

  try {
    // Create multi-turn chat if history exists
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history || [],
    });

    const response = await chat.sendMessage({ message });

    res.json({ text: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Error fetching AI response" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
