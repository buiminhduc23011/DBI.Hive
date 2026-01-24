import { create } from 'zustand';
import api from '../services/api';

export interface User {
    id: string;
    email: string;
    username?: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
    theme: string;
    language: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (emailOrUsername: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, username?: string) => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (emailOrUsername, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/auth/login', { emailOrUsername, password });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false,
            });
            throw error;
        }
    },

    register: async (email, password, fullName, username) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/auth/register', { email, password, fullName, username });
            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false,
            });
            throw error;
        }
    },

    updateProfile: async (updates) => {
        try {
            const response = await api.put('/auth/profile', updates);
            set({ user: response.data });
        } catch (error: any) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            set({ accessToken, isAuthenticated: true });
            // Fetch user profile from backend
            try {
                const response = await api.get('/auth/me');
                set({ user: response.data });
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        }
    },
}));
