import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, { message: 'Имя должно содержать минимум 2 символа' }),
    lastName: z
        .string()
        .trim()
        .min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
});

export type ProfileUpdateValues = z.infer<typeof ProfileUpdateSchema>;

export const PasswordChangeSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: 'Введите текущий пароль' }),
        newPassword: z
            .string()
            .min(8, { message: 'Пароль должен быть не менее 8 символов' }),
        confirmNewPassword: z
            .string()
            .min(1, { message: 'Подтвердите пароль' }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmNewPassword'],
    });

export type PasswordChangeValues = z.infer<typeof PasswordChangeSchema>;
