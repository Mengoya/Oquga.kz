'use client';

import { useAuthStore } from '@/stores/use-auth-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

export function ProfileHeader() {
    const [mounted, setMounted] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/10 to-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2 w-full flex flex-col items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!user) return null;

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const avatarUrl = `https://avatar.vercel.sh/${user.email}`;

    return (
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary/5 via-background to-background">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarImage src={avatarUrl} alt={user.firstName} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                    {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 break-all">
                    {user.email}
                </p>

                <Badge className="px-4 py-1 text-xs uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none">
                    {user.role === 'admin' ? 'Администратор' : 'Абитуриент'}
                </Badge>
            </CardContent>
        </Card>
    );
}
