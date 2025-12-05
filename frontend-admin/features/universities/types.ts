import { z } from 'zod';

export const UniversityStatusSchema = z.enum(['active', 'archived', 'pending']);

export const UniversitySchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    photoUrl: z.string().nullable(),
    shortDescription: z.string().nullable(),
    programsCount: z.number(),
    studentsCount: z.number(),
    rating: z.number().min(0).max(5),
    status: UniversityStatusSchema,
    progressPercent: z.number(),
    viewCount: z.number(),
    translations: z.record(z.object({
        isComplete: z.boolean()
    })).optional(),
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
    shortDescription: z.string().optional(),
    description: z.string().optional(),
});

export const CreateUniversitySchema = z.object({
    photoUrl: z.string().min(1, 'Photo URL is required'),
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

const UpdateTranslationSchema = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    goal: z.string().optional(),
    address: z.string().optional(),
    historyText: z.string().optional(),
});

export const UpdateUniversitySchema = z.object({
    photoUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    foundedYear: z.number().optional().nullable(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional().or(z.literal('')),
    translations: z.object({
        ru: UpdateTranslationSchema.optional(),
        kk: UpdateTranslationSchema.optional(),
        en: UpdateTranslationSchema.optional(),
    }),
});

export type UpdateUniversityValues = z.infer<typeof UpdateUniversitySchema>;

export interface UniversityApiTranslation {
    name: string;
    shortDescription: string | null;
    description: string | null;
    city: string | null;
    isComplete: boolean;
}

export interface UniversityDetailTranslation {
    name: string;
    shortDescription: string | null;
    description: string | null;
    goal: string | null;
    address: string | null;
    city: string | null;
    historyText: string | null;
    isComplete: boolean;
}

export interface SectionProgress {
    name: string;
    percent: number;
    maxPercent: number;
    filledFields: number;
    totalFields: number;
}

export interface ProgressDto {
    totalPercent: number;
    basicInfo: SectionProgress;
    description: SectionProgress;
    leadership: SectionProgress;
    achievements: SectionProgress;
    faculties: SectionProgress;
    admissionRules: SectionProgress;
    tuition: SectionProgress;
    international: SectionProgress;
}

export interface UniversityApiResponse {
    id: number;
    slug: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    viewCount: number;
    translations: Record<string, UniversityApiTranslation>;
    progressPercent: number;
    createdAt: string;
    updatedAt: string;
}

export interface UniversityDetailResponse {
    id: number;
    slug: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    viewCount: number;
    translations: Record<string, UniversityDetailTranslation>;
    progress: ProgressDto;
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
