import Image from 'next/image';
import {
    GraduationCap,
    FileQuestion,
    ArrowRight,
    Calendar,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LatestNews } from '@/components/sections/latest-news';
import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('home');

    return (
        <div className="flex flex-col w-full">
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
                    <Link
                        href="/universities"
                        className="group lg:col-span-3 relative flex flex-col h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1"
                    >
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <GraduationCap className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                            {t('catalogTitle')}
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed flex-grow">
                            {t('catalogDesc')}
                        </p>
                        <div className="mt-6 flex items-center text-primary font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            {t('goToCatalog')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>

                    {/*
                        FIX: Changed section to Link to make the whole card clickable.
                        Linked to /news/news1 as it matches the context of "Grants 2025".
                    */}
                    <Link
                        href="/news/news1"
                        className="lg:col-span-6 relative group h-[400px] lg:h-full overflow-hidden rounded-2xl border shadow-sm block"
                    >
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                            <Image
                                src={"/kcc.jpg"}
                                alt="Students at university campus"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col items-start gap-4">
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                                {t('newsTag')}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-gray-200 transition-colors">
                                {t('newsTitle')}
                            </h1>
                            <p className="text-gray-200 text-lg md:text-xl line-clamp-2 max-w-2xl">
                                {t('newsDesc')}
                            </p>

                            {/*
                                FIX: Using asChild with a span to prevent nesting <button> inside <a>.
                                Styles remain consistent with the original design.
                            */}
                            <Button
                                size="lg"
                                className="mt-2 bg-white text-black hover:bg-gray-200 border-none pointer-events-none"
                                asChild
                            >
                                <span>{t('readNews')}</span>
                            </Button>
                        </div>
                    </Link>

                    <Link
                        href="/admissions"
                        className="group lg:col-span-3 relative flex flex-col h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1"
                    >
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileQuestion className="h-7 w-7" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">
                            {t('howToApply')}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            {t('howToApplyDesc')}
                        </p>
                        <ul className="space-y-4 flex-grow">
                            <li className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-foreground">
                                        {t('testDates')}
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-foreground">
                                        {t('submissionDates')}
                                    </span>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-6 flex items-center text-primary font-medium opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            {t('learnMore')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </Link>
                </div>
            </div>

            <LatestNews />
        </div>
    );
}