import express from 'express';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT, async (req:express.Request, res:express.Response) => {
  const { text } = req.body;

  if (!text.trim()) {
      return res.status(400).json({error:"Please enter some text to simplify."});
    }
  
    try {
      // fake "simplification". replace with ai call later
      const simplified = text
        .split('.')
        .map(sentence => sentence.trim())
        .filter(Boolean)
        .map(sentence => `• ${sentence}`)
        .join('\n');
  
      return res.json({simplified:simplified});
    } catch (error) {
      console.error("Simplification error:", error);
      return res.status(500).json({error:"An error occurred while simplifying the text."}) ;
    }

});

export default router;