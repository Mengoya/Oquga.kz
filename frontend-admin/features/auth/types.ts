import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
    universityId: z.number().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export interface AuthResponse {
    access_token: string;
    user: User;
}
