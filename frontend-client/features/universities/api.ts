import { apiClient } from '@/lib/api-client';
import {
    UniversityDetail,
    UniversityListParams,
    UniversityListResponse,
} from './types';
import { INTERNAL_API_URL } from '@/lib/config';

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
        let baseUrl = INTERNAL_API_URL;

        if (!baseUrl || baseUrl === 'undefined') {
            baseUrl = 'http://localhost:8080';
        }

        baseUrl = baseUrl.replace(/\/+$/, '');

        const apiUrl = `${baseUrl}/api/v1/universities/${id}`;

        console.log(`[SSR] Fetching university from: ${apiUrl}`);

        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`[SSR] Failed to fetch university: ${res.status} ${res.statusText}`);

            if (res.status === 404) {
                throw new Error('University not found');
            }
            throw new Error(
                `Failed to fetch university: ${res.status} ${res.statusText}`,
            );
        }

        return res.json();
    }

    return apiClient.get<UniversityDetail>(`/universities/${id}`);
}
