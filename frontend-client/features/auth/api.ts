import { apiClient } from '@/lib/api-client';
import { AuthResponse, RegisterFormValues } from './types';

export async function login(
    email: string,
    password: string,
): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', { email, password });
}

export async function register(
    data: Omit<RegisterFormValues, 'confirmPassword'>,
): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
}

export async function logout(): Promise<void> {
    return apiClient.post('/auth/logout');
}

export async function refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
}
