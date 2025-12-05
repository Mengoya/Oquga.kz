import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { GraduationCap } from 'lucide-react';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });
    return {
        title: t('title'),
    };
}

export default async function LoginPage() {
    const t = await getTranslations('Auth');

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="absolute right-4 top-4 z-50 md:right-8 md:top-8">
                <LanguageSwitcher />
            </div>

            <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white dark:border-r lg:flex">
                <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    DataNub Admin
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <blockquote className="space-y-2 border-l-2 border-primary/50 pl-6">
                        <p className="text-lg leading-relaxed text-zinc-300">
                            &ldquo;Единая экосистема для анализа и управления
                            данными высших учебных заведений. Эффективность,
                            прозрачность и инновации в образовании.&rdquo;
                        </p>
                    </blockquote>
                    <div className="mt-6 flex gap-4 text-sm text-zinc-500">
                        <span>© 2025 DataNub RK</span>
                    </div>
                </div>
            </div>

            <div className="flex h-full items-center justify-center bg-background p-8 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 lg:hidden">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
