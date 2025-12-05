import { apiClient } from '@/lib/api-client';
import { AuthResponse, User } from './types';

export async function login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', { email, password });
}

export async function logout(): Promise<void> {
    return apiClient.post('/auth/logout');
}

export async function refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
}

export async function getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
}
