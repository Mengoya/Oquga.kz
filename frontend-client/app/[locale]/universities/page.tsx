'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Loader2,
    School,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UniversityCard } from '@/components/cards/university-card';
import { PLACEHOLDER_IMAGE, CITIES_KEYS } from '@/lib/constants';
import { University } from '@/types';
import { useTranslations } from 'next-intl';

const ALL_UNIVERSITIES: University[] = Array.from({ length: 100 }).map(
    (_, i) => ({
        id: `uni-${i}`,
        name:
            [
                'Назарбаев Университет',
                'Казахский Национальный Университет им. Аль-Фараби',
                'Евразийский Национальный Университет',
                'Satbayev University',
                'Университет КИМЭП',
                'Казахстанско-Британский Технический Университет',
                'Международный IT Университет',
                'Университет имени Сулеймана Демиреля',
            ][i % 8] + ` (${i + 1})`,
        city: CITIES_KEYS[
            Math.floor(Math.random() * (CITIES_KEYS.length - 1)) + 1
        ],
        foundedYear: 1930 + Math.floor(Math.random() * 90),
        views: Math.floor(Math.random() * 50000) + 1000,
        image: PLACEHOLDER_IMAGE,
        description: 'Ведущее высшее учебное заведение...',
    }),
);

const ITEMS_PER_PAGE = 9;

export default function UniversitiesPage() {
    const t = useTranslations('Universities');
    const tCities = useTranslations('Cities');

    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCityKey, setSelectedCityKey] = useState('all');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCityKey]);

    const loadUniversities = useCallback(async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));

        let filtered = ALL_UNIVERSITIES.filter((uni) =>
            uni.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

        if (selectedCityKey !== 'all') {
            filtered = filtered.filter((uni) => uni.city === selectedCityKey);
        }

        const total = filtered.length;
        const calculatedTotalPages = Math.ceil(total / ITEMS_PER_PAGE);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentData = filtered.slice(startIndex, endIndex).map((uni) => ({
            ...uni,
            city: tCities(uni.city),
        }));

        setUniversities(currentData);
        setTotalPages(calculatedTotalPages);
        setTotalItems(total);
        setIsLoading(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, debouncedSearch, selectedCityKey, tCities]);

    useEffect(() => {
        loadUniversities();
    }, [loadUniversities]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-screen flex flex-col">
            <div className="flex flex-col gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('subtitle', { count: totalItems })}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('search_placeholder')}
                            className="pl-9 bg-background border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-[200px]">
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={selectedCityKey}
                            onChange={(e) => setSelectedCityKey(e.target.value)}
                        >
                            {CITIES_KEYS.map((cityKey) => (
                                <option key={cityKey} value={cityKey}>
                                    {tCities(cityKey)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : universities.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {universities.map((uni) => (
                            <UniversityCard key={uni.id} uni={uni} />
                        ))}
                    </div>
                    <div className="mt-auto py-4 border-t flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground min-h-[300px]">
                    <School className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">{t('not_found')}</p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCityKey('all');
                        }}
                        className="mt-2"
                    >
                        {t('reset')}
                    </Button>
                </div>
            )}
        </div>
    );
}
