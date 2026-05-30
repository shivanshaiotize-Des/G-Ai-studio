import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json({ limit: "50mb" }));

// Path to mock cloud database persistence
const DB_PATH = path.join(process.cwd(), "db_cloud_sync.json");

// Read initial db
function readDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Cloud DB read error:", err);
  }
  return { posts: [] };
}

// Write to db (cloud backup emulation)
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Cloud DB write error:", err);
  }
}

// Lazy Initialize Gemini SDK to prevent startup crashes when GEMINI_API_KEY is not defined yet
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set or configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route: Real-time Cloud Database READ / SYNC BACKUP
app.get("/api/posts", (req, res) => {
  const db = readDatabase();
  res.json({ posts: db.posts || [] });
});

// API Route: Real-time Cloud Database SAVE BACKUP
app.post("/api/posts", (req, res) => {
  const { posts } = req.body;
  const db = { posts: posts || [] };
  writeDatabase(db);
  res.json({ success: true, timestamp: new Date().toLocaleString() });
});

// API Route: Server-Side Gemini post formatting optimizer
app.post("/api/generate-caption", async (req, res) => {
  const { prompt, platform } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Draft prompt text is required to generate formatted captions." });
  }

  try {
    const ai = getGeminiClient();
    const systemInstructions = `You are a professional social media manager and high-converting marketing copywriting expert. Your task is to transform raw draft posts into highly engaging captions tailored exactly for the specific social platform: "${platform}".
    Follow these instructions carefully:
    - If platform is "twitter", rewrite the post so it is ultra-punchy, fits under 240 characters, uses 1-2 impactful tags, and incorporates clean spacings for legibility.
    - If platform is "linkedin", output in a professional leadership tonality. Separate sections with double line breaks, use bullet lists for scannability, end with a strategic call-to-action (CTA), and include 3 relevant hashtags.
    - If platform is "instagram", write in an immersive, friendly tone using abundant appropriate emojis, vertical spacers to keep layout clean, and a dense block of 5-8 relevant hashtags.
    - If platform is "facebook", maintain a conversational, engaging, community-focused tone with an interactive question or Call-To-Action.
    - If platform is "tiktok", make it raw, fast-paced, trending, with punchy action lines and abundant popular platform tags.
    - Output ONLY the finished social post text itself without any meta introductions, leading phrases (e.g. "Sure, here is..."), or quotes framing the caption.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.7,
      },
    });

    const optimized = response.text ? response.text.trim() : prompt;
    res.json({ optimizedText: optimized });
  } catch (err: any) {
    console.error("Gemini Generation Error:", err.message);
    res.status(500).json({ 
      error: "Could not optimize text with Gemini.", 
      details: err.message,
      explanation: "Please configure your GEMINI_API_KEY in Settings > Secrets to enable live Gemini AI. Falling back to local template optimizer."
    });
  }
});

// Vite middleware setup or Static file streaming depending on environment
async function setupViteMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Fullstack Server running on http://localhost:${PORT}`);
  });
}

setupViteMiddleware();
