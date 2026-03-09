/**
 * Alerion AI — MongoDB Connection
 *
 * Connects to MongoDB using Mongoose with retry logic.
 * Used exclusively for user authentication data.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alerion';

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`[MongoDB]   ✅ Connected → ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
    } catch (err) {
        console.error('[MongoDB]   ❌ Connection failed:', err);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        console.error('[MongoDB]   Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB]   Disconnected');
    });
}

export async function disconnectDB(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log('[MongoDB]   Disconnected gracefully');
    } catch (err) {
        console.error('[MongoDB]   Error disconnecting:', err);
    }
}
