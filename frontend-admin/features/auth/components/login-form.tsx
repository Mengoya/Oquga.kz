'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormValues } from '../types';
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
import { useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useTranslations } from 'next-intl';
import { Loader2, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginForm({ className }: { className?: string }) {
    const t = useTranslations('Auth');
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setError(null);
        try {
            const data = await apiClient.post<{
                accessToken: string;
                user: any;
            }>('/auth/login', values);

            setAuth(data.user, data.accessToken);
            router.push('/');
        } catch (err) {
            setError(t('errors.invalidCredentials'));
        }
    };

    return (
        <div className={cn('grid gap-6', className)}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('emailLabel')}</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="pl-9 h-11"
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>{t('passwordLabel')}</FormLabel>
                                    <a
                                        href="#"
                                        className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Забыли пароль?
                                    </a>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            autoComplete="current-password"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                            className="pl-9 h-11"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive animate-in fade-in-50 slide-in-from-top-1">
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    <Button
                        className="w-full h-11 text-base shadow-lg transition-all hover:scale-[1.01]"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t('submit')}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
