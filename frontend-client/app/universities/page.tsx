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
import { PLACEHOLDER_IMAGE, CITIES } from '@/lib/constants';
import { University } from '@/types';
import { cn } from '@/lib/utils';

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
        city: CITIES[Math.floor(Math.random() * (CITIES.length - 1)) + 1],
        foundedYear: 1930 + Math.floor(Math.random() * 90),
        views: Math.floor(Math.random() * 50000) + 1000,
        image: PLACEHOLDER_IMAGE,
        description:
            'Ведущее высшее учебное заведение, предлагающее широкий спектр образовательных программ.',
    }),
);

const ITEMS_PER_PAGE = 9;

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('Все города');
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
    }, [selectedCity]);

    const loadUniversities = useCallback(async () => {
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        let filtered = ALL_UNIVERSITIES.filter((uni) =>
            uni.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

        if (selectedCity !== 'Все города') {
            filtered = filtered.filter((uni) => uni.city === selectedCity);
        }

        const total = filtered.length;
        const calculatedTotalPages = Math.ceil(total / ITEMS_PER_PAGE);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentData = filtered.slice(startIndex, endIndex);

        setUniversities(currentData);
        setTotalPages(calculatedTotalPages);
        setTotalItems(total);
        setIsLoading(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, debouncedSearch, selectedCity]);

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
                        Каталог университетов
                    </h1>
                    <p className="text-muted-foreground">
                        Найдите идеальное учебное заведение. Найдено вузов:{' '}
                        {totalItems}.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-xl border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Поиск по названию университета..."
                            className="pl-9 bg-background border-border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-[200px]">
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            {CITIES.map((city) => (
                                <option key={city} value={city}>
                                    {city}
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
                            aria-label="Предыдущая страница"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((pageNum) => {
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 &&
                                    pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={
                                            pageNum === currentPage
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                        className={cn(
                                            'w-9',
                                            pageNum === currentPage &&
                                                'pointer-events-none',
                                        )}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            } else if (
                                pageNum === currentPage - 2 ||
                                pageNum === currentPage + 2
                            ) {
                                return (
                                    <span
                                        key={pageNum}
                                        className="text-muted-foreground px-1"
                                    >
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Следующая страница"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground min-h-[300px]">
                    <School className="h-16 w-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">
                        Университеты не найдены
                    </p>
                    <p className="text-sm">
                        Попробуйте изменить параметры поиска или фильтры
                    </p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCity('Все города');
                        }}
                        className="mt-2"
                    >
                        Сбросить фильтры
                    </Button>
                </div>
            )}
        </div>
    );
}
