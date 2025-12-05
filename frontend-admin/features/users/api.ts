import { apiClient } from '@/lib/api-client';
import {
    CreateUniversityAdminValues,
    UniversityAdminListResponse,
} from './types';

export async function fetchUniversityAdmins({
                                                search,
                                                page = 1,
                                                limit = 10,
                                            }: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<UniversityAdminListResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));

    return apiClient.get<UniversityAdminListResponse>(
        `/admin/university-admins?${params.toString()}`
    );
}

export async function createUniversityAdmin(
    data: CreateUniversityAdminValues
): Promise<{ success: boolean }> {
    await apiClient.post('/admin/university-admins', data);
    return { success: true };
}
