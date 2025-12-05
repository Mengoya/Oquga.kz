'use client';

import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
    const tNav = useTranslations('Navigation');
    const tCommon = useTranslations('Common.actions');
    const pathname = usePathname();
    const { isAuthenticated, logout, user } = useAuthStore();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            logout();
            router.push('/login');
        }
    };

    const navItems = [
        { href: '/', label: tNav('universities') },
        { href: '/users', label: tNav('users') },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-lg"
                    >
                        <div className="h-6 w-6 rounded bg-primary" />
                        <span>DataNub</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'transition-colors hover:text-foreground/80',
                                    pathname.endsWith(
                                        item.href === '/' ? '' : item.href,
                                    )
                                        ? 'text-foreground'
                                        : 'text-foreground/60',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    {!isMounted ? (
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    ) : isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-9 w-9 rounded-full"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={`https://avatar.vercel.sh/${user.email}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>
                                            {user.name?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() => router.push('/profile')}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        {tNav('profile')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <Settings className="mr-2 h-4 w-4" />
                                        {tNav('settings')}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {tNav('logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="default" size="sm" asChild>
                            <Link href="/login">{tCommon('login')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
