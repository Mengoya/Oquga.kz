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
    updatedAt: z.iso.datetime(),
});

export type University = z.infer<typeof UniversitySchema>;

export type UniversityFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

export const CreateUniversitySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().min(2, 'City is required'),
});

export type CreateUniversityValues = z.infer<typeof CreateUniversitySchema>;
