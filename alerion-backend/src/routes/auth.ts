/**
 * Alerion AI — Auth Routes
 *
 * POST /api/auth/signup  → Create account, return JWT
 * POST /api/auth/login   → Validate credentials, return JWT
 * GET  /api/auth/me      → Get current user from JWT (protected)
 */

import { Router, type Request, type Response } from 'express';
import { User } from '../models/User.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

// ─── Sign Up ────────────────────────────────────────────────
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, company, role, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email?.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ error: 'An account with this email already exists.' });
            return;
        }

        // Create user
        const user = await User.create({ name, email, company, role, password });

        // Generate JWT
        const token = generateToken({ userId: user._id.toString(), email: user.email });

        res.status(201).json({
            token,
            user: user.toJSON(),
        });
    } catch (err: any) {
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e: any) => e.message);
            res.status(400).json({ error: messages.join('. ') });
            return;
        }
        console.error('[Auth] Signup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ─── Login ──────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }

        // Find user and explicitly select password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        // Generate JWT
        const token = generateToken({ userId: user._id.toString(), email: user.email });

        res.json({
            token,
            user: user.toJSON(),
        });
    } catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ─── Get Current User ───────────────────────────────────────
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        res.json({ user: user.toJSON() });
    } catch (err) {
        console.error('[Auth] Get user error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
