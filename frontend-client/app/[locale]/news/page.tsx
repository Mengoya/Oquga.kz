import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight, Clock, Filter } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';

interface NewsPageProps {
    params: Promise<{ locale: string }>;
}

const NEWS_DATA = [
    {
        slug: 'news1',
        image: '/news-1.jpeg',
        category: 'education',
        views: 1240,
        date: '2025-12-04',
        featured: true,
    },
    {
        slug: 'news2',
        image: '/news-2.jpg',
        category: 'studentLife',
        views: 3500,
        date: '2025-12-03',
        featured: true,
    },
    {
        slug: 'news3',
        image: '/news-3.jpg',
        category: 'education',
        views: 890,
        date: '2025-12-02',
        featured: false,
    },
    {
        slug: 'news4',
        image: '/news-4.png',
        category: 'education',
        views: 4100,
        date: '2025-12-01',
        featured: true,
    },
    {
        slug: 'news5',
        image: '/news-5.jpeg',
        category: 'studentLife',
        views: 2100,
        date: '2025-11-30',
        featured: false,
    },
    {
        slug: 'news6',
        image: '/news-6.webp',
        category: 'education',
        views: 1500,
        date: '2025-11-28',
        featured: false,
    },
    {
        slug: 'news7',
        image: '/news-7.jpeg',
        category: 'education',
        views: 750,
        date: '2025-11-25',
        featured: false,
    },
    {
        slug: 'news8',
        image: '/news-8.jpg',
        category: 'studentLife',
        views: 5300,
        date: '2025-11-22',
        featured: true,
    },
] as const;

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'newsPage' });

    return {
        title: t('meta.title'),
        description: t('meta.description'),
    };
}

export default async function NewsPage({ params }: NewsPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('newsPage');
    const tNews = await getTranslations('latestNews');

    const featuredNews = NEWS_DATA.filter((n) => n.featured).slice(0, 2);
    const regularNews = NEWS_DATA.filter((n) => !featuredNews.includes(n));

    return (
        <div className="min-h-screen bg-muted/10">
            <div className="bg-background border-b py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                {featuredNews.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="h-8 w-1 bg-primary rounded-full" />
                            {t('featured')}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {featuredNews.map((news) => (
                                <Link
                                    key={news.slug}
                                    href={`/news/${news.slug}`}
                                    className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <Image
                                            src={news.image}
                                            alt={tNews(`items.${news.slug}.title`)}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <Badge className="absolute top-4 left-4 bg-primary/90">
                                            {tNews(`categories.${news.category}`)}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(news.date).toLocaleDateString(locale, {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{news.views.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {tNews(`items.${news.slug}.title`)}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="h-8 w-1 bg-primary rounded-full" />
                        {t('allNews')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularNews.map((news) => (
                            <Link
                                key={news.slug}
                                href={`/news/${news.slug}`}
                                className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative aspect-video overflow-hidden border-b">
                                    <Image
                                        src={news.image}
                                        alt={tNews(`items.${news.slug}.title`)}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <Badge className="absolute top-3 left-3 bg-primary/90 text-[10px]">
                                        {tNews(`categories.${news.category}`)}
                                    </Badge>
                                </div>
                                <div className="flex flex-col flex-1 p-5">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>
                                                {new Date(news.date).toLocaleDateString(locale, {
                                                    day: 'numeric',
                                                    month: 'long',
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{news.views.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-base font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors flex-grow">
                                        {tNews(`items.${news.slug}.title`)}
                                    </h3>
                                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                        <span className="text-primary font-medium text-sm flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            {t('readMore')} <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
