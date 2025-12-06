'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    Search,
    Loader2,
    School,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversityCard } from '@/components/cards/university-card';
import { CITY_KEYS, CITY_VALUES, CityKey } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useUniversities } from '@/features/universities/hooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {CompareFloatBar} from "@/components/universities/compare-float-bar";

const ITEMS_PER_PAGE = 9;
const SEARCH_DEBOUNCE_MS = 500;

function UniversityCardSkeleton() {
    return (
        <div className="h-full flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="p-5 flex flex-col flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-16 w-full mt-2" />
                <Skeleton className="h-9 w-full mt-auto" />
            </div>
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    t,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading: boolean;
    t: (key: string) => string;
}) {
    const pages = useMemo(() => {
        const result: (number | 'ellipsis')[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                result.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                result.push('ellipsis');
            }
        }

        return result;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="mt-auto py-4 border-t flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                aria-label={t('prevPage')}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page, index) =>
                page === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="text-muted-foreground px-1"
                    >
                        ...
                    </span>
                ) : (
                    <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        className={cn(
                            'w-9',
                            page === currentPage && 'pointer-events-none',
                        )}
                    >
                        {page}
                    </Button>
                ),
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                aria-label={t('nextPage')}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

export default function UniversitiesPage() {
    const t = useTranslations('universities');
    const tCities = useTranslations('cities');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCity, setSelectedCity] = useState<CityKey>('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCity]);

    const searchParam = useMemo(() => {
        const parts: string[] = [];
        if (debouncedSearch.trim()) {
            parts.push(debouncedSearch.trim());
        }
        if (selectedCity !== 'all') {
            parts.push(CITY_VALUES[selectedCity]);
        }
        return parts.join(' ');
    }, [debouncedSearch, selectedCity]);

    const { data, isLoading, isFetching, isError, error, refetch } =
        useUniversities({
            search: searchParam,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        });

    const universities = data?.data ?? [];
    const meta = data?.meta;
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.totalPages ?? 1;

    const handlePageChange = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        [totalPages],
    );

    const handleResetFilters = useCallback(() => {
        setSearchQuery('');
        setDebouncedSearch('');
        setSelectedCity('all');
        setCurrentPage(1);
    }, []);

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen flex flex-col">
            <div className="flex flex-col gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('subtitle')}{' '}
                        {!isLoading && (
                            <span>
                                {t('found', {
                                    count: totalItems.toLocaleString(locale),
                                })}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('searchPlaceholder')}
                            className="pl-9 bg-background border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label={tCommon('search')}
                        />
                        {isFetching && !isLoading && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>

                    <div className="w-full md:w-[200px]">
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                            value={selectedCity}
                            onChange={(e) =>
                                setSelectedCity(e.target.value as CityKey)
                            }
                            aria-label={tCities('all')}
                        >
                            {CITY_KEYS.map((cityKey) => (
                                <option key={cityKey} value={cityKey}>
                                    {tCities(cityKey)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{tCommon('error')}</AlertTitle>
                    <AlertDescription className="flex flex-col gap-3">
                        <span>{error?.message || t('loadError')}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="w-fit"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {tCommon('retry')}
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <UniversityCardSkeleton key={index} />
                    ))}
                </div>
            ) : universities.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {universities.map((university) => (
                            <UniversityCard
                                key={university.id}
                                university={university}
                                locale={locale}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isLoading={isFetching}
                        t={t}
                    />
                </>
            ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground min-h-[300px]">
                    <School className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">{t('notFound')}</p>
                    <p className="text-sm text-center max-w-md mt-1">
                        {t('notFoundDesc')}
                    </p>
                    <Button
                        variant="link"
                        onClick={handleResetFilters}
                        className="mt-2"
                    >
                        {t('resetFilters')}
                    </Button>
                </div>
            )}

            <CompareFloatBar />
        </div>
    );
}
