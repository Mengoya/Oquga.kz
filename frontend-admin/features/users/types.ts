import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'manager', 'viewer']);

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: UserRoleSchema,
    universityId: z.string().nullable(),
    universityName: z.string().optional(),
    status: z.enum(['active', 'blocked']),
    lastLogin: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
});

export type User = z.infer<typeof UserSchema>;

export type UserFilters = {
    search?: string;
    role?: string;
    universityId?: string;
    page?: number;
    limit?: number;
};

export const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'manager', 'viewer']),
    universityId: z.string().nullable(),
});

export type CreateUserValues = z.infer<typeof CreateUserSchema>;
