import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import openai from "../config/openaiConfig";
import { supabaseAdmin } from "../config/supabaseAdmin";

const router = express.Router();

router.post(
  "/save",
  verifyJWT,
  async (req:express.Request, res:express.Response)=>{
    const {id,title,content}=req.body;
    try{
      await supabaseAdmin.from('Simplifications').insert([{id, title, content}])
    } catch (error) {
      console.error("Save error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the text." });
    }
  }
)

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

        res.json({simplified:"12345d"+ simplified});
      // const response = await openai.chat.completions.create({
      //   model: "gpt-4-turbo",
      //   messages: [
      //     {
      //       role: "developer",
      //       content: `You are a helpful assistant that simplifies complex legal text into concise bullet points, avoiding jargon and unnecessary adjective,using basic language, and shortening the text as much as possible without losing any important information. You generate a title for the document (the name of the company in question, if there is one). If there is no meaningful information, please only return the error message 'No meaningful information found.' Please stream the output in two sections like this: the bullet points, TITLE:, and then the title.`,
      //     },
      //     { role: "user", content: simplified },
      //   ],
      //   stream: true,
      //   temperature: 0.7,
      // });
      // res.setHeader("Content-Type", "application/json");
      // res.setHeader("Cache-Control", "no-cache");
      // res.setHeader("Connection", "keep-alive");

      // for await (const chunk of response) {
      //   if (chunk.choices[0].delta.content) {
      //     res.write(chunk.choices[0]?.delta?.content);
      //   }
      // }
      // res.end();
    } catch (error) {
      console.error("Simplification error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while simplifying the text." });
    }
  }
);

export default router;
