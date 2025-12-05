import { z } from 'zod';

export const UniversityStatusSchema = z.enum(['active', 'archived', 'pending']);

export const UniversitySchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    programsCount: z.number(),
    studentsCount: z.number(),
    rating: z.number().min(0).max(5),
    status: UniversityStatusSchema,
    updatedAt: z.string(),
});

export type University = z.infer<typeof UniversitySchema>;

export type UniversityFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

const TranslationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().optional(),
    description: z.string().optional(),
});

export const CreateUniversitySchema = z.object({
    translations: z
        .object({
            ru: TranslationSchema.optional(),
            kk: TranslationSchema.optional(),
            en: TranslationSchema.optional(),
        })
        .refine((data) => data.ru?.name || data.kk?.name || data.en?.name, {
            message: 'At least one translation with name is required',
        }),
});

export type CreateUniversityValues = z.infer<typeof CreateUniversitySchema>;

export interface UniversityApiTranslation {
    name: string;
    description: string | null;
    city: string | null;
}

export interface UniversityApiResponse {
    id: number;
    slug: string;
    websiteUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    translations: Record<string, UniversityApiTranslation>;
    createdAt: string;
    updatedAt: string;
}

export interface UniversityListApiResponse {
    data: UniversityApiResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
