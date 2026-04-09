import { Router, Request, Response } from "express";

const router = Router();

// Judge0 language ID mapping
const LANGUAGE_IDS: Record<string, number> = {
  python:     71,
  javascript: 63,
  typescript: 74,
  cpp:        54,
  c:          50,
  java:       62,
  go:         60,
  rust:       73,
  ruby:       72,
};

router.post("/execute", async (req: Request, res: Response) => {
  const { language, sourceCode, input } = req.body;

  if (!language || !sourceCode) {
    return res.status(400).json({ error: "language and sourceCode are required" });
  }

  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    // Submit code to Judge0 and wait for result
    const submitRes = await fetch("https://ce.judge0.com/submissions?wait=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: input ?? "",
      }),
    });

    const data = await submitRes.json();

    // Normalize to a consistent shape for the frontend
    res.json({
      stdout: data.stdout ?? "",
      stderr: data.stderr ?? "",
      error:  data.compile_output ?? data.stderr ?? "",
    });

  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ error: "Failed to reach execution service" });
  }
});

export default router;