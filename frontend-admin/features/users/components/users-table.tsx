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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Shield, Building2 } from 'lucide-react';
import { User } from '../types';
import { useFormatter, useTranslations } from 'next-intl';

interface UsersTableProps {
    data: User[];
    isLoading: boolean;
}

export function UsersTable({ data, isLoading }: UsersTableProps) {
    const t = useTranslations('UsersPage.table.headers');
    const tRoles = useTranslations('UsersPage.roles');
    const tStatus = useTranslations('UsersPage.status');
    const tNotFound = useTranslations('Dashboard.notFound'); // Используем общий
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
                        <TableHead className="w-[300px]">{t('user')}</TableHead>
                        <TableHead>{t('role')}</TableHead>
                        <TableHead>{t('university')}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead>{t('lastLogin')}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => (
                        <TableRow key={user.id} className="group">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={`https://avatar.vercel.sh/${user.email}`}
                                        />
                                        <AvatarFallback>
                                            {user.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">
                                        {tRoles(user.role as any)}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {user.universityName ? (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Building2 className="h-3.5 w-3.5" />
                                        <span className="text-sm truncate max-w-[200px]">
                                            {user.universityName}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">
                                        Global
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        user.status === 'active'
                                            ? 'default'
                                            : 'destructive'
                                    }
                                >
                                    {tStatus(user.status as any)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">
                                    {user.lastLogin
                                        ? format.dateTime(
                                              new Date(user.lastLogin),
                                              {
                                                  dateStyle: 'medium',
                                                  timeStyle: 'short',
                                              },
                                          )
                                        : '-'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
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
