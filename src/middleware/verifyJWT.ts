import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyJWT=(req: Request, res: Response, next: NextFunction):void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid header' });
    return;
  }
  
  const token = authHeader?.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if(!secret){
      throw new Error('JWT secret is not defined');
    }
    const payload = jwt.verify(token, secret);
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}



export default verifyJWT;