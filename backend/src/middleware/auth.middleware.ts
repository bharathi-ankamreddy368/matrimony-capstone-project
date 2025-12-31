import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
    id: number;
    username: string;
    role: 'organizer' | 'attendee' | 'admin';
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ message: 'No token provided.' });

    try {
        const secret = process.env.JWT_SECRET || 'secretkey';
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ message: 'Invalid token.' });
    }
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).send({ message: 'Unauthorized' });
        if (req.user.role !== role) return res.status(403).send({ message: 'Forbidden' });
        next();
    };
};