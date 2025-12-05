import { z } from 'zod';

export const UpdateProfileSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
});

export type UpdateProfileValues = z.infer<typeof UpdateProfileSchema>;
