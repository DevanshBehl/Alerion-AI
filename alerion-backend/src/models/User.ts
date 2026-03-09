/**
 * Alerion AI — User Model
 *
 * Schema matches the frontend signup form fields exactly.
 * Password is hashed with bcrypt before save.
 */

import mongoose, { Schema, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    company: string;
    role: 'engineer' | 'manager' | 'executive';
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['engineer', 'manager', 'executive'],
                message: 'Role must be engineer, manager, or executive',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Exclude from queries by default
        },
    },
    {
        timestamps: true,
    }
);

// ─── Hash password before saving ────────────────────────────
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method to compare passwords ───────────────────
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// ─── Transform JSON output (strip password, rename _id) ─────
userSchema.set('toJSON', {
    transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    },
});

export const User = mongoose.model<IUser>('User', userSchema);
