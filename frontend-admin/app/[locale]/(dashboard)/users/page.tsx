'use client';

import * as React from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchUniversityAdmins } from '@/features/users/api';
import { UsersTable } from '@/features/users/components/users-table';
import { UsersToolbar } from '@/features/users/components/users-toolbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDataTableParams } from '@/hooks/use-data-table-params';

export default function UsersPage() {
    const t = useTranslations('UsersPage');
    const tActions = useTranslations('Common.actions');
    const tDashboard = useTranslations('Dashboard');
    const { page, search, setParams } = useDataTableParams();

    const { data, isLoading } = useQuery({
        queryKey: ['university-admins', page, search],
        queryFn: () => fetchUniversityAdmins({ page, search, limit: 10 }),
        placeholderData: keepPreviousData,
    });

    const totalPages = data?.meta.totalPages || 0;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Администраторы ВУЗов
                    </h1>
                    <p className="text-muted-foreground">
                        Управление учётными записями администраторов университетов
                    </p>
                </div>

                <UsersToolbar />

                <UsersTable data={data?.data || []} isLoading={isLoading} />

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                        {data?.meta.total
                            ? tDashboard.rich('shown', {
                                count: data.data.length,
                                total: data.meta.total,
                                span: (chunks) => (
                                    <span className="font-medium text-foreground">
                                          {chunks}
                                      </span>
                                ),
                            })
                            : tDashboard('notFound.title')}
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
