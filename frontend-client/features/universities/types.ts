export interface UniversityTranslation {
    name: string;
    shortDescription: string;
    description: string;
    city: string;
    isComplete: boolean;
}

export interface UniversityResponse {
    id: number;
    slug: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    viewCount: number;
    translations: Record<string, UniversityTranslation>;
    progressPercent: number;
    createdAt: string;
    updatedAt: string;
}

export interface UniversityListMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UniversityListResponse {
    data: UniversityResponse[];
    meta: UniversityListMeta;
}

export interface UniversityListParams {
    search?: string;
    page?: number;
    limit?: number;
    city?: string;
}

export type UniversityDetail = UniversityResponse;
