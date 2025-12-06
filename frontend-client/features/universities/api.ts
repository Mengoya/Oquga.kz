import { UniversityDetail } from './types';
import { API_BASE_URL } from '@/lib/config';

export async function getUniversityById(id: string): Promise<UniversityDetail> {
    const isServer = typeof window === 'undefined';

    if (isServer) {
        const baseUrl = API_BASE_URL?.startsWith('http')
            ? API_BASE_URL
            : 'http://localhost:8080';

        const res = await fetch(`${baseUrl}/api/v1/universities/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('University not found');
            }
            throw new Error(
                `Failed to fetch university: ${res.status} ${res.statusText}`,
            );
        }

        return res.json();
    } else {
        const { apiClient } = await import('@/lib/api-client');
        return apiClient.get<UniversityDetail>(`/universities/${id}`);
    }
}
