'use client';

import * as React from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUniversities } from '@/features/universities/api';
import { UniversitiesTable } from '@/features/universities/components/universities-table';
import { UniversitiesToolbar } from '@/features/universities/components/universities-toolbar';
import { useDataTableParams } from '@/hooks/use-data-table-params';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    const { page, search, setParams } = useDataTableParams();

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['universities', page, search],
        queryFn: () => fetchUniversities({ page, search, limit: 10 }),
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.meta.totalPages || 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="min-h-screen bg-muted/40">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <div className="h-6 w-6 rounded bg-primary" />
                        <span>DataNub Admin</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted" />
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Университеты
                        </h1>
                        <p className="text-muted-foreground">
                            Управление списком высших учебных заведений РК
                        </p>
                    </div>

                    <UniversitiesToolbar />

                    <UniversitiesTable
                        data={data?.data || []}
                        isLoading={isLoading}
                    />

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                            {data?.meta.total ? (
                                <>
                                    Показано{' '}
                                    <span className="font-medium text-foreground">
                                        {data.data.length}
                                    </span>{' '}
                                    из{' '}
                                    <span className="font-medium text-foreground">
                                        {data.meta.total}
                                    </span>{' '}
                                    вузов
                                </>
                            ) : (
                                'Нет данных'
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setParams({ page: page - 1 })}
                                disabled={!hasPrevPage || isLoading}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Назад
                            </Button>
                            <div className="text-sm font-medium">
                                Стр. {page} из {totalPages || 1}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setParams({ page: page + 1 })}
                                disabled={!hasNextPage || isLoading}
                            >
                                Вперед
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
