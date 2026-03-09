/**
 * Alerion AI — JWT Authentication Middleware
 *
 * Verifies Bearer token from Authorization header.
 * Attaches decoded user data to req.user.
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'alerion-dev-secret-change-in-production';

export interface JwtPayload {
    userId: string;
    email: string;
}

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function generateToken(payload: JwtPayload): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
