'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    MapPin,
    Calendar,
    Eye,
    CheckCircle2,
    Share2,
    Heart,
    ExternalLink,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';

interface UniversityHeroProps {
    name: string;
    city: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    foundedYear: number | null;
    viewCount: number;
    progressPercent: number;
    locale: string;
    translations: {
        university: string;
        verifiedProfile: string;
        views: string;
        founded: string;
        officialSite: string;
        backToList: string;
        share: string;
        addToFavorites: string;
        removedFromFavorites: string;
        addedToFavorites: string;
        linkCopied: string;
        breadcrumbHome: string;
        breadcrumbUniversities: string;
    };
}

export function UniversityHero({
                                   name,
                                   city,
                                   photoUrl,
                                   websiteUrl,
                                   foundedYear,
                                   viewCount,
                                   progressPercent,
                                   locale,
                                   translations: t,
                               }: UniversityHeroProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: name,
            text: `${name} - ${city}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t.linkCopied);
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                await navigator.clipboard.writeText(window.location.href);
                toast.success(t.linkCopied);
            }
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(
            isFavorite ? t.removedFromFavorites : t.addedToFavorites,
        );
    };

    return (
        <>
            <div
                className={cn(
                    'fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b transition-all duration-300 transform',
                    isScrolled
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-full opacity-0',
                )}
            >
                <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-muted overflow-hidden shrink-0">
                            <Image
                                src={photoUrl || PLACEHOLDER_IMAGE}
                                alt={name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[200px] md:max-w-[400px]">
                            {name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleShare}
                            aria-label={t.share}
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        {websiteUrl && (
                            <Button
                                size="sm"
                                asChild
                                className="hidden sm:flex"
                            >
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t.officialSite}
                                    <ExternalLink className="ml-1.5 h-3 w-3" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <nav
                className="container mx-auto px-4 md:px-6 py-4"
                aria-label="Breadcrumb"
            >
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    <li>
                        <Link
                            href="/"
                            className="hover:text-foreground transition-colors"
                        >
                            {t.breadcrumbHome}
                        </Link>
                    </li>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <li>
                        <Link
                            href="/universities"
                            className="hover:text-foreground transition-colors"
                        >
                            {t.breadcrumbUniversities}
                        </Link>
                    </li>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <li>
                        <span
                            className="text-foreground font-medium truncate max-w-[150px] md:max-w-[300px] inline-block align-bottom"
                            aria-current="page"
                        >
                            {name}
                        </span>
                    </li>
                </ol>
            </nav>

            <div className="container mx-auto px-4 md:px-6 mb-8">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border bg-card shadow-lg group">
                    <div className="relative h-[280px] sm:h-[350px] md:h-[420px] lg:h-[480px] w-full bg-muted">
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
                        )}

                        <Image
                            src={photoUrl || PLACEHOLDER_IMAGE}
                            alt={name}
                            fill
                            className={cn(
                                'object-cover transition-all duration-700',
                                imageLoaded
                                    ? 'opacity-100 scale-100'
                                    : 'opacity-0 scale-105',
                                'group-hover:scale-105',
                            )}
                            priority
                            sizes="100vw"
                            onLoad={() => setImageLoaded(true)}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border-white/20 hover:bg-white/30 text-white"
                                onClick={handleShare}
                                aria-label={t.share}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className={cn(
                                    'h-10 w-10 rounded-full backdrop-blur-md border-white/20 transition-all',
                                    isFavorite
                                        ? 'bg-red-500/90 hover:bg-red-500 text-white'
                                        : 'bg-white/20 hover:bg-white/30 text-white',
                                )}
                                onClick={handleFavorite}
                                aria-label={t.addToFavorites}
                                aria-pressed={isFavorite}
                            >
                                <Heart
                                    className={cn(
                                        'h-4 w-4 transition-transform',
                                        isFavorite && 'fill-current scale-110',
                                    )}
                                />
                            </Button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 lg:p-10 text-white">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-6">
                                <div className="space-y-3 sm:space-y-4 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                                        >
                                            {t.university}
                                        </Badge>

                                        {progressPercent > 80 && (
                                            <Badge className="bg-green-500/90 text-white border-0 gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {t.verifiedProfile}
                                            </Badge>
                                        )}

                                        <Badge
                                            variant="secondary"
                                            className="bg-black/40 backdrop-blur-md text-white border-0 gap-1"
                                        >
                                            <Eye className="h-3 w-3" />
                                            {t.views.replace(
                                                '{count}',
                                                viewCount.toLocaleString(locale),
                                            )}
                                        </Badge>
                                    </div>

                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight drop-shadow-lg">
                                        {name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-200">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            <span className="font-medium">
                                                {city}
                                            </span>
                                        </div>
                                        {foundedYear && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                                <span className="font-medium">
                                                    {t.founded.replace(
                                                        '{year}',
                                                        String(foundedYear),
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {websiteUrl && (
                                    <Button
                                        className="hidden lg:flex bg-white text-black hover:bg-white/90 shadow-xl border-0 shrink-0 h-12 px-6 text-base font-semibold"
                                        size="lg"
                                        asChild
                                    >
                                        <a
                                            href={websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t.officialSite}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
