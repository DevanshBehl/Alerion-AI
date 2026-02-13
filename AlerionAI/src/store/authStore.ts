import { create } from 'zustand';
import type { AuthUser } from '../types';
import { MOCK_USER } from '../utils/constants';

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: async (email, password) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email === MOCK_USER.email && password === MOCK_USER.password) {
            const mockToken = `jwt-mock-${Date.now()}-${Math.random().toString(36).substr(2)}`;

            set({
                user: {
                    id: MOCK_USER.id,
                    name: MOCK_USER.name,
                    email: MOCK_USER.email,
                    role: MOCK_USER.role as 'admin' | 'viewer',
                },
                token: mockToken,
                isAuthenticated: true,
            });
            return true;
        }

        return false;
    },

    logout: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },
}));
