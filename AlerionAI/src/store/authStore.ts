import { create } from 'zustand';
import type { AuthUser } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

interface SignupData {
    name: string;
    email: string;
    company: string;
    role: string;
    password: string;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    rehydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return false;
            }

            localStorage.setItem('alerion_token', data.token);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
            });
            return true;
        } catch {
            return false;
        }
    },

    signup: async (signupData) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || 'Signup failed.' };
            }

            localStorage.setItem('alerion_token', data.token);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
            });
            return { success: true };
        } catch {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    logout: () => {
        localStorage.removeItem('alerion_token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    rehydrate: async () => {
        const token = localStorage.getItem('alerion_token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                localStorage.removeItem('alerion_token');
                return;
            }

            const data = await res.json();
            set({
                user: data.user,
                token,
                isAuthenticated: true,
            });
        } catch {
            localStorage.removeItem('alerion_token');
        }
    },
}));

// Rehydrate on app load
useAuthStore.getState().rehydrate();
