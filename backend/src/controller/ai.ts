import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

export const handleAiChat = async (req: Request, res: Response) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
};
