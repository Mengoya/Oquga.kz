'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MoreHorizontal,
    GraduationCap,
    Users,
    Star,
    MapPin,
} from 'lucide-react';
import { University } from '../types';
import { useFormatter, useTranslations } from 'next-intl';

interface UniversitiesTableProps {
    data: University[];
    isLoading: boolean;
}

export function UniversitiesTable({ data, isLoading }: UniversitiesTableProps) {
    const t = useTranslations('Dashboard.table.headers');
    const tNotFound = useTranslations('Dashboard.notFound');
    const tActions = useTranslations('Common.actions');
    const format = useFormatter();

    if (isLoading) {
        return <UniversitiesTableSkeleton />;
    }

    if (data.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                    {tNotFound('title')}
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {tNotFound('description')}
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">{t('name')}</TableHead>
                        <TableHead>{t('city')}</TableHead>
                        <TableHead>{t('programs')}</TableHead>
                        <TableHead>{t('students')}</TableHead>
                        <TableHead>{t('rating')}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((uni) => (
                        <TableRow key={uni.id} className="group">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="truncate">{uni.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ID: {uni.id}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {uni.city}
                                </div>
                            </TableCell>
                            <TableCell>
                                {format.number(uni.programsCount)}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    {format.number(uni.studentsCount)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 font-medium">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {format.number(uni.rating, {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    })}
                                </div>
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={uni.status} />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">
                                        {tActions('more')}
                                    </span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const t = useTranslations('Dashboard.status');

    const variants: Record<
        string,
        'default' | 'secondary' | 'outline' | 'destructive'
    > = {
        active: 'default',
        archived: 'secondary',
        pending: 'outline',
    };

    return (
        <Badge variant={variants[status] || 'outline'}>
            {t(status as any)}
        </Badge>
    );
}

function UniversitiesTableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {[...Array(6)].map((_, i) => (
                            <TableHead key={i}>
                                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            {[...Array(6)].map((_, j) => (
                                <TableCell key={j}>
                                    <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
