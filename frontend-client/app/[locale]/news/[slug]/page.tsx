import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
    Calendar,
    Eye,
    Clock,
    Share2,
    ChevronRight,
    ArrowLeft,
    Tag,
    User,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';

interface NewsDetailPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

const NEWS_DATA: Record<
    string,
    {
        image: string;
        category: string;
        views: number;
        date: string;
        readTime: number;
        author: string;
        relatedSlugs: string[];
    }
> = {
    news1: {
        image: '/news-1.jpeg',
        category: 'education',
        views: 1240,
        date: '2025-12-04',
        readTime: 8,
        author: 'Редакция Oquga',
        relatedSlugs: ['news3', 'news4', 'news5'],
    },
    news2: {
        image: '/news-2.jpg',
        category: 'studentLife',
        views: 3500,
        date: '2025-12-03',
        readTime: 5,
        author: 'Айгерим Сатова',
        relatedSlugs: ['news7', 'news8'],
    },
    news3: {
        image: '/news-3.jpg',
        category: 'education',
        views: 890,
        date: '2025-12-02',
        readTime: 6,
        author: 'Технологический отдел',
        relatedSlugs: ['news8', 'news6'],
    },
    news4: {
        image: '/news-4.png',
        category: 'education',
        views: 4100,
        date: '2025-12-01',
        readTime: 4,
        author: 'Редакция Oquga',
        relatedSlugs: ['news1', 'news5'],
    },
    news5: {
        image: '/news-5.jpeg',
        category: 'studentLife',
        views: 2100,
        date: '2025-11-30',
        readTime: 10,
        author: 'Марат Касымов',
        relatedSlugs: ['news1', 'news4'],
    },
    news6: {
        image: '/news-6.webp',
        category: 'education',
        views: 1500,
        date: '2025-11-28',
        readTime: 5,
        author: 'Международный отдел',
        relatedSlugs: ['news7', 'news2'],
    },
    news7: {
        image: '/news-7.jpeg',
        category: 'education',
        views: 750,
        date: '2025-11-25',
        readTime: 7,
        author: 'Научный отдел',
        relatedSlugs: ['news6', 'news3'],
    },
    news8: {
        image: '/news-8.jpg',
        category: 'studentLife',
        views: 5300,
        date: '2025-11-22',
        readTime: 6,
        author: 'IT-редакция',
        relatedSlugs: ['news3', 'news2'],
    },
};

const VALID_SLUGS = Object.keys(NEWS_DATA);

export async function generateStaticParams() {
    return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
    const { locale, slug } = await params;

    if (!VALID_SLUGS.includes(slug)) {
        return { title: 'Not Found' };
    }

    const t = await getTranslations({ locale, namespace: 'latestNews' });
    const news = NEWS_DATA[slug];

    return {
        title: t(`items.${slug}.title`),
        description: t(`items.${slug}.excerpt`),
        openGraph: {
            title: t(`items.${slug}.title`),
            description: t(`items.${slug}.excerpt`),
            images: [news.image],
            type: 'article',
            publishedTime: news.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: t(`items.${slug}.title`),
            description: t(`items.${slug}.excerpt`),
            images: [news.image],
        },
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { locale, slug } = await params;

    if (!VALID_SLUGS.includes(slug)) {
        notFound();
    }

    setRequestLocale(locale);

    const t = await getTranslations('newsPage');
    const tNews = await getTranslations('latestNews');

    const news = NEWS_DATA[slug];
    const title = tNews(`items.${slug}.title`);
    const excerpt = tNews(`items.${slug}.excerpt`);

    // FIX: Using .raw() to bypass ICU message formatting for HTML content
    // This prevents "FORMATTING_ERROR: The intl string context variable..."
    const content = tNews.raw(`items.${slug}.content`);

    const relatedNews = news.relatedSlugs
        .filter((s) => NEWS_DATA[s])
        .map((s) => ({
            slug: s,
            ...NEWS_DATA[s],
        }));

    return (
        <div className="min-h-screen bg-muted/10">
            <nav className="container mx-auto px-4 md:px-6 py-4" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    <li>
                        <Link href="/" className="hover:text-foreground transition-colors">
                            {t('breadcrumb.home')}
                        </Link>
                    </li>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <li>
                        <Link href="/news" className="hover:text-foreground transition-colors">
                            {t('breadcrumb.news')}
                        </Link>
                    </li>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <li>
                        <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-[400px] inline-block align-bottom">
                            {title}
                        </span>
                    </li>
                </ol>
            </nav>

            <article className="container mx-auto px-4 md:px-6 pb-12">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className="bg-primary/90">
                                {tNews(`categories.${news.category}`)}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                                    <Clock className="h-4 w-4" />
                                    <span>{t('readTime', { minutes: news.readTime })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{news.views.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            {title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                            {excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{news.author}</p>
                                    <p className="text-xs text-muted-foreground">{t('author')}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                {t('share')}
                            </Button>
                        </div>
                    </header>

                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={news.image}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 896px) 100vw, 896px"
                        />
                    </div>

                    <div
                        className="prose prose-lg prose-neutral dark:prose-invert max-w-none mb-12"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    <Separator className="my-8" />

                    <div className="flex items-center justify-between">
                        <Button variant="outline" asChild>
                            <Link href="/news">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('backToNews')}
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{t('tags')}:</span>
                            <Badge variant="secondary">{tNews(`categories.${news.category}`)}</Badge>
                        </div>
                    </div>
                </div>

                {relatedNews.length > 0 && (
                    <section className="max-w-6xl mx-auto mt-16">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="h-8 w-1 bg-primary rounded-full" />
                            {t('relatedNews')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedNews.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/news/${related.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                                >
                                    <div className="relative aspect-video overflow-hidden border-b">
                                        <Image
                                            src={related.image}
                                            alt={tNews(`items.${related.slug}.title`)}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                            {tNews(`items.${related.slug}.title`)}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {new Date(related.date).toLocaleDateString(locale, {
                                                day: 'numeric',
                                                month: 'long',
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}