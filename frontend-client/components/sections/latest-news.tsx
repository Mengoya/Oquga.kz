'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/navigation';

const NEWS_CONFIG = [
    {
        key: 'news1',
        image: '/news-1.jpeg',
        category: 'education',
        views: 1240,
        timeOffsetHours: 2,
    },
    {
        key: 'news2',
        image: '/news-2.jpg',
        category: 'studentLife',
        views: 3500,
        timeOffsetHours: 5,
    },
    {
        key: 'news3',
        image: '/news-3.jpg',
        category: 'education',
        views: 890,
        timeOffsetHours: 24,
    },
    {
        key: 'news4',
        image: '/news-4.png',
        category: 'education',
        views: 4100,
        timeOffsetHours: 28,
    },
    {
        key: 'news5',
        image: '/news-5.jpeg',
        category: 'studentLife',
        views: 2100,
        timeOffsetHours: 48,
    },
    {
        key: 'news6',
        image: '/news-6.webp',
        category: 'education',
        views: 1500,
        timeOffsetHours: 52,
    },
    {
        key: 'news7',
        image: '/news-7.jpeg',
        category: 'education',
        views: 750,
        timeOffsetHours: 72,
    },
    {
        key: 'news8',
        image: '/news-8.jpg',
        category: 'studentLife',
        views: 5300,
        timeOffsetHours: 96,
    },
] as const;

export function LatestNews() {
    const t = useTranslations('latestNews');

    return (
        <section className="py-12 md:py-16 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('sectionTitle')}
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {t('sectionSubtitle')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="hidden md:flex group border-border hover:border-primary hover:text-primary"
                        asChild
                    >
                        <Link href="/news">
                            {t('allNews')}{' '}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NEWS_CONFIG.map((item) => (
                        <NewsCard key={item.key} config={item} />
                    ))}
                </div>
                <div className="mt-8 md:hidden">
                    <Button
                        variant="outline"
                        className="w-full border-border"
                        asChild
                    >
                        <Link href="/news">{t('allNews')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function NewsCard({ config }: { config: (typeof NEWS_CONFIG)[number] }) {
    const t = useTranslations('latestNews');
    const format = useFormatter();

    const publishedAt = new Date(
        Date.now() - config.timeOffsetHours * 1000 * 60 * 60,
    );

    return (
        <Link
            href={`/news/${config.key}`}
            className="group flex flex-col h-full"
        >
            <article className="flex flex-col h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden border-b border-border/50">
                    <Image
                        src={config.image}
                        alt={t(`items.${config.key}.title`)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase text-white bg-primary/90 rounded-md backdrop-blur-sm shadow-sm">
                        {t(`categories.${config.category}`)}
                    </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span suppressHydrationWarning>
                                {format.dateTime(publishedAt, {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span suppressHydrationWarning>
                                {format.dateTime(publishedAt, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-base font-bold leading-snug line-clamp-3 mb-4 group-hover:text-primary transition-colors flex-grow">
                        {t(`items.${config.key}.title`)}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-muted-foreground text-xs">
                        <div
                            className="flex items-center gap-1.5"
                            title={t('views')}
                        >
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">
                                {config.views.toLocaleString()}
                            </span>
                        </div>
                        <span className="text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                            {t('read')} <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}