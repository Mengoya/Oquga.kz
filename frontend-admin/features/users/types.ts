import { z } from 'zod';

export const UniversityAdminSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    isActive: z.boolean(),
    universityId: z.number().nullable(),
    universityName: z.string().nullable(),
    createdAt: z.string(),
});

export type UniversityAdmin = z.infer<typeof UniversityAdminSchema>;

export interface UniversityAdminListResponse {
    data: UniversityAdmin[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const CreateUniversityAdminSchema = z.object({
    firstName: z.string().min(2, 'Минимум 2 символа'),
    lastName: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    universityId: z.number().min(1, 'Выберите университет'),
});

export type CreateUniversityAdminValues = z.infer<typeof CreateUniversityAdminSchema>;

export type UniversityAdminFilters = {
    search?: string;
    page?: number;
    limit?: number;
};