import express from 'express';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.post('/', verifyJWT, async (req, res) => {
  const { text } = req.body;

  // Replace this with your text simplification logic or call to OpenAI
  const simplified = `Simplified: ${text}`;

  res.json({ simplified });
});

export default router;