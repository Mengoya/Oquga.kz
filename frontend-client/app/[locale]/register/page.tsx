import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { GraduationCap } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Регистрация',
    description: 'Создание аккаунта на платформе Oquga.kz',
};

export default function RegisterPage() {
    return (
        <div className="container relative min-h-[calc(100vh-64px)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary" />
                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <GraduationCap className="h-6 w-6" />
                    {SITE_CONFIG.name}
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Инвестиции в знания всегда приносят
                            наибольший доход.&rdquo;
                        </p>
                        <footer className="text-sm">Бенджамин Франклин</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Создание аккаунта
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Заполните данные для регистрации в системе
                        </p>
                    </div>

                    <RegisterForm />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Уже есть аккаунт?{' '}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
