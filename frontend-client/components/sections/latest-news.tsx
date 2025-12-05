import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Calendar, Eye, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { useTranslations, useLocale } from 'next-intl';

interface NewsItem {
    id: string;
    title: string;
    image: string;
    publishedAt: Date;
    views: number;
    categoryKey: string;
}

const NEWS_DATA: NewsItem[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `news-${i}`,
    title: [
        'Гранты 2025: Полный список изменений в правилах поступления',
        'Открытие нового кампуса Satbayev University',
        'Рейтинг лучших IT-факультетов Казахстана',
        'Как подготовиться к ЕНТ за 3 месяца',
        'Международная конференция по науке прошла в Астане',
        'Стипендии для магистрантов увеличат на 25%',
        'Новые программы обмена с университетами Южной Кореи',
        'Hackathon 2025: Студенты создали AI для трафика',
    ][i % 8],
    image: PLACEHOLDER_IMAGE,
    publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 5),
    views: Math.floor(Math.random() * 5000) + 120,
    categoryKey: i % 2 === 0 ? 'education' : 'student_life',
}));

export function LatestNews() {
    const t = useTranslations('News');
    const locale = useLocale();

    return (
        <section className="py-12 md:py-16 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            {t('title')}
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="hidden md:flex group border-border hover:border-primary hover:text-primary"
                    >
                        {t('all_news')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NEWS_DATA.map((news) => (
                        <NewsCard key={news.id} news={news} locale={locale} />
                    ))}
                </div>
                <div className="mt-8 md:hidden">
                    <Button variant="outline" className="w-full border-border">
                        {t('all_news')}
                    </Button>
                </div>
            </div>
        </section>
    );
}

function NewsCard({ news, locale }: { news: NewsItem; locale: string }) {
    const t = useTranslations('News');

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };
    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <Link href={`/news/${news.id}`} className="group flex flex-col h-full">
            <article className="flex flex-col h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden border-b border-border/50">
                    <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase text-white bg-primary/90 rounded-md backdrop-blur-sm shadow-sm">
                        {t(news.categoryKey)}
                    </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(news.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatTime(news.publishedAt)}</span>
                        </div>
                    </div>
                    <h3 className="text-base font-bold leading-snug line-clamp-3 mb-4 group-hover:text-primary transition-colors flex-grow">
                        {news.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-muted-foreground text-xs">
                        <div
                            className="flex items-center gap-1.5"
                            title={t('views')}
                        >
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">
                                {news.views.toLocaleString()}
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
