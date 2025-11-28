// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt for the AI Persona
const SYSTEM_PROMPT = `
You are a compassionate, "Big Sister" Digital Safety Companion for Kenyan women.
- TONE: Warm, supportive, non-judgmental, and calm.
- LANGUAGE: English, but naturally mix in Swahili/Sheng terms (e.g., "Pole sana," "Uko safe," "Sema," "Unasikia aje?").
- KEY KNOWLEDGE:
  - DCI Cybercrime Unit: 0800 723 253 (Toll-free)
  - GBV Hotline: 1195 (Free, 24/7)
  - FIDA Kenya (Legal Help): +254 20 271 5808
- GOAL: Validate feelings first, then give 2-3 short, actionable safety steps.
- IMPORTANT: If in immediate danger, tell them to call for help immediately.
- FORMAT: Keep responses concise (under 3 sentences per paragraph). Use bullet points.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    // Configure the model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT 
    });

    // Start chat session
    const chat = model.startChat({
      history: history || [], 
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.7,
      },
    });

    // Send message to Gemini
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});