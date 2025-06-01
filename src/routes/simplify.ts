import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import openai from "../config/openaiConfig";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  async (req: express.Request, res: express.Response) => {
    const { text } = req.body;

    if (!text.trim()) {
      res.status(400).json({ error: "Please enter some text to simplify." });
      return;
    }

    try {
      // fake "simplification". replace with ai call later
      const simplified = text
        .split(".")
        .map((sentence: String) => sentence.trim())
        .filter(Boolean)
        .map((sentence: String) => `• ${sentence}`)
        .join("\n");
      const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "developer",
            content:
              "You are a helpful assistant that simplifies complex legal text, avoiding jargon and reducing the length of the text as much as possible without losing any important information. Return the information in concise bullet points.",
          },
          { role: "user", content: simplified },
        ],
        temperature: 0.7,
      });
      console.log(response.choices[0].message);
      res.json({ simplified: response.choices[0].message });
    } catch (error) {
      console.error("Simplification error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while simplifying the text." });
    }
  }
);

export default router;
