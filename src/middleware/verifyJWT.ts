import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid header' });
  
  const token = authHeader?.split(' ')[1];

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}