import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface AuthPayload {
  id: number;
  username: string;
  role: 'organizer' | 'attendee' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.header('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    console.log('[AuthMiddleware] Missing token');
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'capstone_secret_key';
    const payload = jwt.verify(token, secret) as AuthPayload;
    console.log('[AuthMiddleware] Token verified for user:', payload.username);
    req.user = payload;
    next();
  } catch (err: any) {
    console.error('[AuthMiddleware] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role: 'organizer' | 'attendee' | 'admin') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };
};
