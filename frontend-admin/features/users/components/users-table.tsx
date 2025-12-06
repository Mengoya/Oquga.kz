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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Shield } from 'lucide-react';
import { UniversityAdmin } from '../types';
import { useFormatter, useTranslations } from 'next-intl';

interface UsersTableProps {
    data: UniversityAdmin[];
    isLoading: boolean;
}

export function UsersTable({ data, isLoading }: UsersTableProps) {
    const t = useTranslations('UsersPage');
    const tNotFound = useTranslations('Dashboard.notFound');
    const format = useFormatter();

    if (isLoading) {
        return <UsersTableSkeleton />;
    }

    if (data.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-6 w-6 text-muted-foreground" />
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
                        <TableHead className="w-[300px]">{t('table.headers.user')}</TableHead>
                        <TableHead>{t('table.headers.university')}</TableHead>
                        <TableHead>{t('table.headers.status')}</TableHead>
                        <TableHead>{t('table.headers.createdAt')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => {
                        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                        const fullName = `${user.firstName} ${user.lastName}`;

                        return (
                            <TableRow key={user.id} className="group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={`https://avatar.vercel.sh/${user.email}`}
                                            />
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">
                                                {fullName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.universityName ? (
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Building2 className="h-3.5 w-3.5" />
                                            <span className="text-sm truncate max-w-[250px]">
                                                {user.universityName}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">
                                            {t('notLinked')}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                        {user.isActive ? t('status.active') : t('status.blocked')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {format.dateTime(new Date(user.createdAt), {
                                            dateStyle: 'medium',
                                        })}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function UsersTableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {[...Array(4)].map((_, i) => (
                            <TableHead key={i}>
                                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            {[...Array(4)].map((_, j) => (
                                <TableCell key={j}>
                                    <div className="h-8 w-full animate-pulse rounded bg-muted/50" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
