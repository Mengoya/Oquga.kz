import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number(),
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
    email: z.email({ message: 'Введите корректный email' }),
    password: z
        .string()
        .min(6, { message: 'Пароль должен быть не менее 6 символов' }),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(2, { message: 'Имя должно содержать минимум 2 символа' }),
        lastName: z
            .string()
            .trim()
            .min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
        email: z.email({ message: 'Введите корректный email' }),
        password: z
            .string()
            .min(8, { message: 'Пароль должен быть не менее 8 символов' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
    access_token: string;
    user: User;
}
