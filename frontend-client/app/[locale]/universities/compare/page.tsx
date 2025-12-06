'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    ArrowLeft,
    X,
    MapPin,
    Calendar,
    Globe,
    Phone,
    Mail,
    Eye,
    Building2,
    GraduationCap,
    AlertCircle,
    Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    useCompareIds,
    useCompareHydrated,
    useCompareActions
} from '@/stores/use-compare-store';
import { Link } from '@/i18n/navigation';
import { UniversityDetail, UniversityTranslation } from '@/features/universities/types';
import { apiClient } from '@/lib/api-client';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CompareData {
    university: UniversityDetail;
    translation: UniversityTranslation;
    isLoading: boolean;
    error: string | null;
}

function getTranslation(
    university: UniversityDetail,
    locale: string
): UniversityTranslation {
    return (
        university.translations[locale] ||
        university.translations['ru'] ||
        university.translations['en'] ||
        Object.values(university.translations)[0] || {
            name: '',
            shortDescription: '',
            description: '',
            city: '',
            isComplete: false,
        }
    );
}

export default function ComparePage() {
    const t = useTranslations('universities');
    const locale = useLocale();

    const compareIds = useCompareIds();
    const isHydrated = useCompareHydrated();
    const { removeFromCompare, clearCompare } = useCompareActions();

    const [universities, setUniversities] = useState<Map<number, CompareData>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isHydrated) return;

        const fetchUniversities = async () => {
            if (compareIds.length === 0) {
                setIsLoading(false);
                setUniversities(new Map());
                return;
            }

            setIsLoading(true);
            const newData = new Map<number, CompareData>();

            await Promise.all(
                compareIds.map(async (id) => {
                    try {
                        const university = await apiClient.get<UniversityDetail>(`/universities/${id}`);
                        const translation = getTranslation(university, locale);

                        newData.set(id, {
                            university,
                            translation,
                            isLoading: false,
                            error: null,
                        });
                    } catch (error) {
                        newData.set(id, {
                            university: null as any,
                            translation: null as any,
                            isLoading: false,
                            error: 'Failed to load university',
                        });
                    }
                })
            );

            setUniversities(newData);
            setIsLoading(false);
        };

        fetchUniversities();
    }, [compareIds, locale, isHydrated]);

    const handleRemove = (id: number) => {
        removeFromCompare(id);
    };

    const validUniversities = Array.from(universities.entries())
        .filter(([, data]) => data.university && !data.error)
        .map(([id, data]) => ({ id, ...data }));

    const compareParams = [
        {
            key: 'city',
            label: t('location'),
            icon: MapPin,
            getValue: (data: CompareData) => data.translation.city || '—',
        },
        {
            key: 'foundedYear',
            label: t('foundedYear'),
            icon: Calendar,
            getValue: (data: CompareData) => data.university.foundedYear?.toString() || '—',
        },
        {
            key: 'viewCount',
            label: t('viewCount'),
            icon: Eye,
            getValue: (data: CompareData) => data.university.viewCount.toLocaleString(locale),
        },
        {
            key: 'phone',
            label: t('phone'),
            icon: Phone,
            getValue: (data: CompareData) => data.university.contactPhone || '—',
            isLink: (data: CompareData) => !!data.university.contactPhone,
            getHref: (data: CompareData) => `tel:${data.university.contactPhone}`,
        },
        {
            key: 'email',
            label: t('email'),
            icon: Mail,
            getValue: (data: CompareData) => data.university.contactEmail || '—',
            isLink: (data: CompareData) => !!data.university.contactEmail,
            getHref: (data: CompareData) => `mailto:${data.university.contactEmail}`,
        },
        {
            key: 'website',
            label: t('website'),
            icon: Globe,
            getValue: (data: CompareData) =>
                data.university.websiteUrl?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') || '—',
            isLink: (data: CompareData) => !!data.university.websiteUrl,
            getHref: (data: CompareData) => data.university.websiteUrl || '',
            isExternal: true,
        },
        {
            key: 'virtualTour',
            label: t('virtualTour'),
            icon: Building2,
            getValue: (data: CompareData) => data.university.virtualTourUrl ? t('available') : '—',
            highlight: (data: CompareData) => !!data.university.virtualTourUrl,
        },
        {
            key: 'verified',
            label: t('verifiedProfile'),
            icon: GraduationCap,
            getValue: (data: CompareData) =>
                data.university.progressPercent > 80 ? t('verified') : t('notVerified'),
            highlight: (data: CompareData) => data.university.progressPercent > 80,
        },
    ];

    if (!isHydrated || isLoading) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-96 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (compareIds.length === 0) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                        <Scale className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t('compareEmpty')}</h1>
                    <p className="text-muted-foreground mb-6">{t('compareEmptyDesc')}</p>
                    <Button asChild>
                        <Link href="/universities">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('backToList')}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (validUniversities.length < 2) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t('compareMinRequired')}</AlertTitle>
                    <AlertDescription>
                        {t('compareMinRequiredDesc')}
                    </AlertDescription>
                </Alert>
                <div className="text-center mt-6">
                    <Button asChild variant="outline">
                        <Link href="/universities">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('backToList')}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                        <Link href="/universities">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {t('compareTitle')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('compareSubtitle', { count: validUniversities.length })}
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={clearCompare}>
                    <X className="mr-2 h-4 w-4" />
                    {t('clearCompare')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {validUniversities.map(({ id, university, translation }) => (
                    <Card key={id} className="relative overflow-hidden group">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemove(id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <Image
                                src={university.photoUrl || PLACEHOLDER_IMAGE}
                                alt={translation.name}
                                fill
                                className="object-cover"
                            />
                            {university.progressPercent > 80 && (
                                <Badge className="absolute top-2 left-2 bg-green-500/90">
                                    ✓ {t('verified')}
                                </Badge>
                            )}
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base line-clamp-2">
                                <Link
                                    href={`/universities/${id}` as any}
                                    className="hover:text-primary transition-colors"
                                >
                                    {translation.name}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate">{translation.city}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        {t('compareParameters')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left p-4 font-medium text-muted-foreground min-w-[180px]">
                                    {t('parameter')}
                                </th>
                                {validUniversities.map(({ id, translation }) => (
                                    <th
                                        key={id}
                                        className="text-left p-4 font-medium min-w-[200px]"
                                    >
                                        <span className="line-clamp-2">{translation.name}</span>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {compareParams.map((param, index) => (
                                <tr
                                    key={param.key}
                                    className={cn(
                                        'border-b last:border-b-0 transition-colors hover:bg-muted/30',
                                        index % 2 === 0 && 'bg-muted/10'
                                    )}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <param.icon className="h-4 w-4 text-primary shrink-0" />
                                            {param.label}
                                        </div>
                                    </td>
                                    {validUniversities.map(({ id, university, translation }) => {
                                        const data = { university, translation, isLoading: false, error: null };
                                        const value = param.getValue(data);
                                        const isLink = param.isLink?.(data);
                                        const href = param.getHref?.(data);
                                        const isHighlighted = param.highlight?.(data);

                                        return (
                                            <td key={id} className="p-4">
                                                {isLink && href ? (
                                                    <a
                                                        href={href}
                                                        target={param.isExternal ? '_blank' : undefined}
                                                        rel={param.isExternal ? 'noopener noreferrer' : undefined}
                                                        className="text-sm text-primary hover:underline truncate block max-w-[200px]"
                                                    >
                                                        {value}
                                                    </a>
                                                ) : (
                                                    <span
                                                        className={cn(
                                                            'text-sm',
                                                            isHighlighted && 'text-green-600 font-medium',
                                                            value === '—' && 'text-muted-foreground'
                                                        )}
                                                    >
                                                            {value}
                                                        </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {validUniversities.map(({ id, translation }) => (
                    <Card key={id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{translation.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {translation.shortDescription ? (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {translation.shortDescription}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    {t('noDescription')}
                                </p>
                            )}
                            <Button variant="link" className="px-0 mt-4" asChild>
                                <Link href={`/universities/${id}` as any}>
                                    {t('details')} →
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
