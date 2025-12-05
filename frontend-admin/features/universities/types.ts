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
    updatedAt: z.string().datetime(),
});

export type University = z.infer<typeof UniversitySchema>;

export type UniversityFilters = {
    search?: string;
    page?: number;
    limit?: number;
};
