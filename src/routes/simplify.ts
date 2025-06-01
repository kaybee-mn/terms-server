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
        model: "gpt-4-turbo",
        messages: [
          {
            role: "developer",
            content:
              "You are a helpful assistant that simplifies complex legal text, avoiding jargon and reducing the length of the text as much as possible without losing any important information. Return the information in concise bullet points. You will also extract a title for the information, with the name of the company primarily referred to in the text or, if there is no primary company, the main subject of the text. If there is no meaningful information, please only return the error message 'No meaningful information found.'",
          },
          { role: "user", content: simplified },
        ],
        stream: true,
        temperature: 0.7,
      });
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      for await (const chunk of response) {
        if (chunk.choices[0].delta.content) {
          res.write(chunk.choices[0].delta.content);
        }
      }
      res.end();
    } catch (error) {
      console.error("Simplification error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while simplifying the text." });
    }
  }
);

export default router;
