import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
    role: z.enum(['admin', 'manager']),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export interface AuthResponse {
    accessToken: string;
    user: User;
}
