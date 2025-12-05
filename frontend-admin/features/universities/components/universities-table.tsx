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

interface UniversitiesTableProps {
    data: University[];
    isLoading: boolean;
}

export function UniversitiesTable({ data, isLoading }: UniversitiesTableProps) {
    if (isLoading) {
        return <UniversitiesTableSkeleton />;
    }

    if (data.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Вузы не найдены</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Попробуйте изменить параметры поиска или фильтры.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Название</TableHead>
                        <TableHead>Город</TableHead>
                        <TableHead>Программы</TableHead>
                        <TableHead>Студенты</TableHead>
                        <TableHead>Рейтинг</TableHead>
                        <TableHead>Статус</TableHead>
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
                            <TableCell>{uni.programsCount}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                    {uni.studentsCount.toLocaleString('ru-RU')}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 font-medium">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {uni.rating}
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
                                    <span className="sr-only">Действия</span>
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
    const variants: Record<
        string,
        'default' | 'secondary' | 'outline' | 'destructive'
    > = {
        active: 'default',
        archived: 'secondary',
        pending: 'outline',
    };

    const labels: Record<string, string> = {
        active: 'Активен',
        archived: 'Архив',
        pending: 'На проверке',
    };

    return (
        <Badge variant={variants[status] || 'outline'}>
            {labels[status] || status}
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
