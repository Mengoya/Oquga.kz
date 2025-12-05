import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    universityId: number | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    logout: () => void;
}

const cookieStorage = {
    getItem: (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },
    setItem: (name: string, value: string): void => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    },
    removeItem: (name: string): void => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; path=/; max-age=0`;
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            setAuth: (user, accessToken) =>
                set({ user, accessToken, isAuthenticated: true }),
            setAccessToken: (accessToken) =>
                set({ accessToken }),
            logout: () =>
                set({ user: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => cookieStorage),
        }
    )
);
