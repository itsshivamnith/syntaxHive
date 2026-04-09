import { Request, Response } from "express";
import Groq from "groq-sdk";

async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY in .env");

  // Groq SDK acts identically to OpenAI SDK
  const groq = new Groq({ apiKey });

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // insanely fast and capable
      messages: [{ role: "user", content: prompt }],
    });
    
    return response.choices[0]?.message?.content ?? "";
  } catch (err: any) {
    console.error(`[AI] Groq failed: ${err?.message}`);
    throw new Error("Groq API error: " + err.message);
  }
}

export const handleAiChat = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const text = await generateWithGroq(prompt);
    res.json({ text });
  } catch (err: any) {
    console.error("AI chat error:", err.message);
    res.status(500).json({ error: err.message || "Failed to generate AI response" });
  }
};