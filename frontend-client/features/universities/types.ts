export interface UniversityTranslation {
    name: string;
    shortDescription: string;
    description: string;
    city: string;
    isComplete: boolean;
}

export interface UniversityDetail {
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
