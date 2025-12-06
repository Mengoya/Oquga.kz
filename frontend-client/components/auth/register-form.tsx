'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, RegisterFormValues } from '@/features/auth/types';
import { register } from '@/features/auth/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RegisterForm({ className }: { className?: string }) {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        setError(null);
        try {
            const { confirmPassword, ...registerData } = values;

            const data = await register(registerData);

            setAuth(data.user, data.access_token);

            router.push('/');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 409) {
                setError('Пользователь с таким email уже существует');
            } else {
                setError(
                    err.response?.data?.message ||
                        'Ошибка при регистрации. Попробуйте позже.',
                );
            }
        }
    };

    return (
        <div className={cn('grid gap-6', className)}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Иван"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName" // Изменено с secondName
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Фамилия</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Иванов"
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="student@example.com"
                                            type="email"
                                            autoComplete="email"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Подтвердите пароль</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive animate-in fade-in-50">
                            <AlertCircle className="h-4 w-4" />
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    <Button
                        className="w-full h-11 text-base shadow-md transition-all hover:translate-y-[-1px]"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {form.formState.isSubmitting
                            ? 'Регистрация...'
                            : 'Создать аккаунт'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
