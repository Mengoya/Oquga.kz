import { apiClient } from '@/lib/api-client';
import {
    CreateUniversityValues,
    University,
    UniversityApiResponse,
    UniversityDetailResponse,
    UniversityListApiResponse,
    UpdateUniversityValues,
} from './types';

export async function fetchUniversities({
                                            search,
                                            page = 1,
                                            limit = 10,
                                        }: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<{ data: University[]; meta: UniversityListApiResponse['meta'] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));

    const response = await apiClient.get<UniversityListApiResponse>(
        `/universities?${params.toString()}`,
    );

    const data: University[] = response.data.map(mapApiResponseToUniversity);

    return {
        data,
        meta: response.meta,
    };
}

export async function fetchUniversityDetail(id: string): Promise<UniversityDetailResponse> {
    return apiClient.get<UniversityDetailResponse>(`/universities/${id}/detail`);
}

export async function createUniversity(
    data: CreateUniversityValues,
): Promise<{ success: boolean; id: string }> {
    const translations: Record<
        string,
        { name: string; city?: string; description?: string }
    > = {};

    if (data.translations.ru?.name) {
        translations.ru = {
            name: data.translations.ru.name,
            city: data.translations.ru.city || undefined,
            description: data.translations.ru.description || undefined,
        };
    }
    if (data.translations.kk?.name) {
        translations.kk = {
            name: data.translations.kk.name,
            city: data.translations.kk.city || undefined,
            description: data.translations.kk.description || undefined,
        };
    }
    if (data.translations.en?.name) {
        translations.en = {
            name: data.translations.en.name,
            city: data.translations.en.city || undefined,
            description: data.translations.en.description || undefined,
        };
    }

    const primaryName =
        data.translations.ru?.name ||
        data.translations.kk?.name ||
        data.translations.en?.name ||
        '';

    const requestBody = {
        slug: generateSlug(primaryName),
        translations,
    };

    const response = await apiClient.post<UniversityApiResponse>(
        '/universities',
        requestBody,
    );

    return { success: true, id: String(response.id) };
}

export async function updateUniversity(
    id: string,
    data: UpdateUniversityValues,
): Promise<UniversityDetailResponse> {
    return apiClient.put<UniversityDetailResponse>(`/universities/${id}`, data);
}

function mapApiResponseToUniversity(api: UniversityApiResponse): University {
    const translation =
        api.translations.ru || api.translations.kk || api.translations.en;

    const translationsStatus: Record<string, { isComplete: boolean }> = {};
    for (const [lang, t] of Object.entries(api.translations)) {
        translationsStatus[lang] = { isComplete: t.isComplete };
    }

    return {
        id: String(api.id),
        name: translation?.name || '',
        city: translation?.city || '',
        programsCount: 0,
        studentsCount: 0,
        rating: 0,
        status: 'active',
        progressPercent: api.progressPercent,
        translations: translationsStatus,
        updatedAt: api.updatedAt,
    };
}

function generateSlug(name: string): string {
    const translitMap: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
        з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
        п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
        ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
        я: 'ya', ә: 'a', і: 'i', ң: 'n', ғ: 'g', ү: 'u', ұ: 'u', қ: 'k',
        ө: 'o', һ: 'h',
    };

    return name
        .toLowerCase()
        .split('')
        .map((char) => translitMap[char] || char)
        .join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
}
