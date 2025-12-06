import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { GraduationCap } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
    title: 'Вход в систему',
    description: 'Авторизация на платформе Oquga.kz',
};

export default function LoginPage() {
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
                            &ldquo;Образование — это самое мощное оружие,
                            которое вы можете использовать, чтобы изменить
                            мир.&rdquo;
                        </p>
                        <footer className="text-sm">Нельсон Мандела</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Вход в аккаунт
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Введите email и пароль для входа в систему
                        </p>
                    </div>

                    <LoginForm />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Нет аккаунта?{' '}
                        <Link
                            href="/register"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
