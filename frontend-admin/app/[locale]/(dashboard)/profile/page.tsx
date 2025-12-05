import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProfileForm } from '@/features/profile/components/profile-form';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ProfilePage' });
    return {
        title: t('title'),
    };
}

export default async function ProfilePage() {
    const t = await getTranslations('ProfilePage');

    return (
        <main className="container mx-auto max-w-3xl p-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>

                <div className="h-px w-full bg-border" />

                <div className="grid gap-8">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="font-semibold leading-none tracking-tight">
                                {t('personalInfo')}
                            </h3>
                        </div>
                        <div className="p-6 pt-0">
                            <ProfileForm />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
