'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUniversities } from '@/features/universities/api';
import { UniversitiesTable } from '@/features/universities/components/universities-table';
import { UniversitiesToolbar } from '@/features/universities/components/universities-toolbar';
import { useDataTableParams } from '@/hooks/use-data-table-params';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRouter } from '@/i18n/routing';

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const tActions = useTranslations('Common.actions');
    const router = useRouter();
    const { user } = useAuthStore();

    const { page, search, setParams } = useDataTableParams();

    const isUniversityAdmin = user?.role === 'UNIVERSITY_ADMIN';

    useEffect(() => {
        if (isUniversityAdmin && user?.universityId) {
            router.replace(`/universities/${user.universityId}/edit` as any);
        }
    }, [isUniversityAdmin, user?.universityId, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['universities', page, search],
        queryFn: () => fetchUniversities({ page, search, limit: 10 }),
        placeholderData: keepPreviousData,
        enabled: !isUniversityAdmin,
    });

    if (isUniversityAdmin) {
        return (
            <main className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Перенаправление...</p>
                </div>
            </main>
        );
    }

    const totalPages = data?.meta.totalPages || 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>

                <UniversitiesToolbar />

                <UniversitiesTable
                    data={data?.data || []}
                    isLoading={isLoading}
                />

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                        {data?.meta.total
                            ? t.rich('shown', {
                                count: data.data.length,
                                total: data.meta.total,
                                span: (chunks) => (
                                    <span className="font-medium text-foreground">
                                          {chunks}
                                      </span>
                                ),
                            })
                            : t('notFound.title')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setParams({ page: page - 1 })}
                            disabled={!hasPrevPage || isLoading}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            {tActions('prev')}
                        </Button>
                        <div className="text-sm font-medium">
                            {page} / {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setParams({ page: page + 1 })}
                            disabled={!hasNextPage || isLoading}
                        >
                            {tActions('next')}
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
