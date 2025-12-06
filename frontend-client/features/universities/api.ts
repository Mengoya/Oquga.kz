import { apiClient } from '@/lib/api-client';
import {
    UniversityDetail,
    UniversityListParams,
    UniversityListResponse,
} from './types';
import { API_BASE_URL } from '@/lib/config';

export async function getUniversities(
    params: UniversityListParams = {},
): Promise<UniversityListResponse> {
    const { search = '', page = 1, limit = 9 } = params;

    const searchParams = new URLSearchParams();

    if (search.trim()) {
        searchParams.append('search', search.trim());
    }
    searchParams.append('page', String(page));
    searchParams.append('limit', String(limit));

    const queryString = searchParams.toString();
    const url = `/universities${queryString ? `?${queryString}` : ''}`;

    return apiClient.get<UniversityListResponse>(url);
}

export async function getUniversityById(id: string): Promise<UniversityDetail> {
    const isServer = typeof window === 'undefined';

    if (isServer) {
        let baseUrl = API_BASE_URL;

        if (!baseUrl || baseUrl === 'undefined') {
            baseUrl = 'http://localhost:8080';
        }

        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        const apiUrl = baseUrl.includes('/api/v1')
            ? `${baseUrl}/universities/${id}`
            : `${baseUrl}/api/v1/universities/${id}`;

        const res = await fetch(apiUrl, {
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
        return apiClient.get<UniversityDetail>(`/universities/${id}`);
    }
}