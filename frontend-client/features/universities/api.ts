import { apiClient } from '@/lib/api-client';
import {
    UniversityDetail,
    UniversityListParams,
    UniversityListResponse,
} from './types';
import { getInternalApiUrl } from '@/lib/config';

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
        const baseUrl = getInternalApiUrl();
        const apiUrl = `${baseUrl}/api/v1/universities/${id}`;

        console.log(`[SSR] Fetching university from: ${apiUrl}`);
        console.log(`[SSR] INTERNAL_API_URL env: ${process.env.INTERNAL_API_URL}`);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                cache: 'no-store',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

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
        } catch (error: unknown) {
            console.error('[SSR] Fetch error details:', error);

            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timeout');
            }

            throw error;
        }
    }

    return apiClient.get<UniversityDetail>(`/universities/${id}`);
}
