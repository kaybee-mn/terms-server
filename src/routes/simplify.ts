import express from 'express';
import verifyJWT from '../middleware/verifyJWT';
const router = express.Router();

router.post('/', verifyJWT, async (req:express.Request, res:express.Response) => {
  const { text } = req.body;

  if (!text.trim()) {
      res.status(400).json({error:"Please enter some text to simplify."});
      return;
    }
  
    try {
      // fake "simplification". replace with ai call later
      const simplified = text
        .split('.')
        .map((sentence:String) => sentence.trim())
        .filter(Boolean)
        .map((sentence:String) => `• ${sentence}`)
        .join('\n');
      console.log("Simplified text:", simplified);
      // const response = await openai.createChatCompletion({
      //   model: 'gpt-4.1', 
      //   input: [
      //     { role: 'developer', content: 'You are a helpful assistant that simplifies complex legal text, avoiding jargon and simplifying the text as much as possible without losing any important information.' },
      //     { role: 'user', content: text }
      //   ],
      //   temperature: 0.7,
      // store:true;
    //}
    //   });
    //response.then((result) => console.log(result.choices[0].message));
      res.json({simplified:simplified});
    } catch (error) {
      console.error("Simplification error:", error);
      res.status(500).json({error:"An error occurred while simplifying the text."}) ;
    }
});

export default router;