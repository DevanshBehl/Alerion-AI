import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const { user, isAuthenticated, login, logout, token, signup, isLoading } = useAuthStore();
    return { user, isAuthenticated, login, logout, token, signup, isLoading };
};
