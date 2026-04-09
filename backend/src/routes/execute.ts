import { Router, Request, Response } from "express";

const router = Router();

// Piston language/version mapping
const PISTON_LANGS: Record<string, string> = {
  python: "3.10.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  cpp: "10.2.0",
  c: "10.2.0",
  java: "15.0.2",
  go: "1.16.2",
  rust: "1.68.2",
  ruby: "3.0.1",
};

router.post("/execute", async (req: Request, res: Response) => {
  const { language, sourceCode, input } = req.body;

  if (!language || !sourceCode) {
    return res.status(400).json({ error: "language and sourceCode are required" });
  }

  const version = PISTON_LANGS[language];
  if (!version) {
    return res.status(400).json({ error: `Unsupported language: ${language}` });
  }

  try {
    const submitRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        version: version,
        files: [
          {
            content: sourceCode,
          },
        ],
        stdin: input ?? "",
      }),
    });

    const data = await submitRes.json();

    if (!submitRes.ok) {
      return res.status(500).json({ error: data.message || "Execution failed" });
    }

    res.json({
      stdout: data.run?.stdout ?? "",
      stderr: data.run?.stderr ?? "",
      error: data.compile?.stderr ?? data.run?.stderr ?? "",
    });
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ error: "Failed to reach execution service" });
  }
});

export default router;