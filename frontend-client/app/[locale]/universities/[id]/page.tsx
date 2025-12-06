import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
    MapPin,
    Calendar,
    Globe,
    Phone,
    Mail,
    Eye,
    ChevronLeft,
    CheckCircle2,
    ExternalLink,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getUniversityById } from '@/features/universities/api';
import {
    UniversityDetail,
    UniversityTranslation,
} from '@/features/universities/types';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

function getUniversityTranslation(
    uni: UniversityDetail,
    locale: string,
): UniversityTranslation {
    return (
        uni.translations[locale] ||
        uni.translations['ru'] ||
        uni.translations['en'] ||
        Object.values(uni.translations)[0] || {
            name: '',
            shortDescription: '',
            description: '',
            city: '',
            isComplete: false,
        }
    );
}

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id, locale } = await params;

    try {
        const uni = await getUniversityById(id);
        const translation = getUniversityTranslation(uni, locale);
        const t = await getTranslations({ locale, namespace: 'universities' });

        return {
            title: translation.name || t('university'),
            description:
                translation.shortDescription ||
                `${t('aboutUniversity')} - ${translation.name}`,
            openGraph: {
                title: translation.name,
                description: translation.shortDescription,
                images: [uni.photoUrl || PLACEHOLDER_IMAGE],
            },
        };
    } catch {
        const t = await getTranslations({ locale, namespace: 'universities' });
        return {
            title: t('notFound'),
        };
    }
}

export default async function UniversityDetailPage({ params }: PageProps) {
    const { id, locale } = await params;

    setRequestLocale(locale);

    const t = await getTranslations('universities');
    const tCommon = await getTranslations('common');

    let uni: UniversityDetail;
    let translation: UniversityTranslation;

    try {
        uni = await getUniversityById(id);
        translation = getUniversityTranslation(uni, locale);
    } catch (error) {
        console.error('Error loading university:', error);
        notFound();
    }

    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    return (
        <div className="min-h-screen bg-muted/10 pb-20 animate-in fade-in duration-500">
            <div className="container mx-auto px-4 md:px-6 py-6">
                <Link href="/universities">
                    <Button
                        variant="ghost"
                        className="pl-0 gap-2 text-muted-foreground hover:text-primary"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {t('backToList')}
                    </Button>
                </Link>
            </div>

            <div className="container mx-auto px-4 md:px-6 mb-8">
                <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm group">
                    <div className="relative h-[250px] md:h-[400px] w-full bg-muted">
                        <Image
                            src={uni.photoUrl || PLACEHOLDER_IMAGE}
                            alt={translation.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-4 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-md bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-white/30">
                                            {t('university')}
                                        </span>
                                        {uni.progressPercent > 80 && (
                                            <span className="inline-flex items-center rounded-md bg-green-500/90 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                {t('verifiedProfile')}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center rounded-md bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-white">
                                            <Eye className="mr-1 h-3 w-3" />
                                            {tCommon('views', {
                                                count: uni.viewCount.toLocaleString(
                                                    locale,
                                                ),
                                            })}
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-shadow-lg leading-tight">
                                        {translation.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-200 font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            {translation.city}
                                        </div>
                                        {uni.foundedYear && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                {tCommon('founded', {
                                                    year: uni.foundedYear,
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {uni.websiteUrl && (
                                    <Button
                                        className="bg-white text-black hover:bg-white/90 shadow-lg border-0 shrink-0"
                                        size="lg"
                                        asChild
                                    >
                                        <a
                                            href={uni.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('officialSite')}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-4">
                                {t('aboutUniversity')}
                            </h2>
                            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                                {translation.description ? (
                                    <div
                                        dangerouslySetInnerHTML={createMarkup(
                                            translation.description,
                                        )}
                                    />
                                ) : (
                                    <p className="text-muted-foreground italic bg-muted/30 p-4 rounded-lg">
                                        {t('noDescription')}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-card rounded-2xl p-6 border shadow-sm sticky top-24">
                            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                                {t('contacts')}
                            </h3>
                            <div className="space-y-5">
                                {uni.contactPhone && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Phone className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                                                {t('phone')}
                                            </p>
                                            <a
                                                href={`tel:${uni.contactPhone}`}
                                                className="text-base font-medium hover:text-primary transition-colors"
                                            >
                                                {uni.contactPhone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {uni.contactEmail && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Mail className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${uni.contactEmail}`}
                                                className="text-base font-medium hover:text-primary transition-colors truncate block"
                                            >
                                                {uni.contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {uni.websiteUrl && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Globe className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                                                {t('website')}
                                            </p>
                                            <a
                                                href={uni.websiteUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-base font-medium hover:text-primary transition-colors truncate block"
                                            >
                                                {uni.websiteUrl
                                                    .replace(
                                                        /^https?:\/\/(www\.)?/,
                                                        '',
                                                    )
                                                    .replace(/\/$/, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t space-y-3">
                                <Button
                                    className="w-full font-semibold text-base py-6 shadow-lg shadow-primary/20"
                                    size="lg"
                                >
                                    {t('applyDocuments')}
                                </Button>
                                <p className="text-[11px] text-center text-muted-foreground">
                                    {t('applyNote')}
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
