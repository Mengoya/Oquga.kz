import { apiClient } from '@/lib/api-client';
import { PasswordChangeValues, ProfileUpdateValues } from './types';
import { User } from '@/stores/use-auth-store';

export async function updateProfile(data: ProfileUpdateValues): Promise<User> {
    return apiClient.put<User>('/users/profile', data);
}

export async function changePassword(
    data: PasswordChangeValues,
): Promise<void> {
    return apiClient.put('/users/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });
}
