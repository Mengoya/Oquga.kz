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
    MapPin,
    Check,
    X,
    Edit,
} from 'lucide-react';
import { University } from '../types';
import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/use-auth-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UniversitiesTableProps {
    data: University[];
    isLoading: boolean;
}

export function UniversitiesTable({ data, isLoading }: UniversitiesTableProps) {
    const t = useTranslations('Dashboard.table.headers');
    const tNotFound = useTranslations('Dashboard.notFound');
    const tActions = useTranslations('Common.actions');
    const router = useRouter();
    const { user } = useAuthStore();

    const isUniversityAdmin = user?.role === 'UNIVERSITY_ADMIN';

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

    const handleEdit = (id: string) => {
        router.push(`/universities/${id}/edit` as any);
    };

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">{t('name')}</TableHead>
                        <TableHead>{t('city')}</TableHead>
                        <TableHead className="text-center">RU</TableHead>
                        <TableHead className="text-center">KK</TableHead>
                        <TableHead className="text-center">EN</TableHead>
                        <TableHead>Прогресс</TableHead>
                        {isUniversityAdmin && <TableHead className="w-[50px]"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((uni) => {
                        const canEditThis = isUniversityAdmin && user?.universityId === Number(uni.id);

                        return (
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
                                <TableCell className="text-center">
                                    <LanguageStatus isComplete={uni.translations?.ru?.isComplete} />
                                </TableCell>
                                <TableCell className="text-center">
                                    <LanguageStatus isComplete={uni.translations?.kk?.isComplete} />
                                </TableCell>
                                <TableCell className="text-center">
                                    <LanguageStatus isComplete={uni.translations?.en?.isComplete} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 min-w-[120px]">
                                        <Progress value={uni.progressPercent} className="h-2" />
                                        <span className="text-xs text-muted-foreground w-8">
                                            {uni.progressPercent}%
                                        </span>
                                    </div>
                                </TableCell>
                                {isUniversityAdmin && (
                                    <TableCell>
                                        {canEditThis && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(uni.id)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Редактировать
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function LanguageStatus({ isComplete }: { isComplete?: boolean }) {
    if (isComplete === undefined) {
        return <span className="text-muted-foreground">-</span>;
    }
    return isComplete ? (
        <Badge variant="default" className="h-6 w-6 p-0 justify-center">
            <Check className="h-3 w-3" />
        </Badge>
    ) : (
        <Badge variant="secondary" className="h-6 w-6 p-0 justify-center">
            <X className="h-3 w-3" />
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
