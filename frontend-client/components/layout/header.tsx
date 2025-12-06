'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Menu,
    X,
    User as UserIcon,
    LogIn,
    LogOut,
    Settings,
    LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/use-auth-store';
import { logout as logoutApi } from '@/features/auth/api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            logout();
            router.push('/login');
            router.refresh();
        }
    };

    const displayName = user ? `${user.firstName} ${user.lastName}` : '';
    const initials = user
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : 'U';
    const avatarUrl = user ? `https://avatar.vercel.sh/${user.email}` : '';

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-50 w-full transition-all duration-300 border-b',
                    isMobileMenuOpen
                        ? 'bg-background border-border'
                        : isScrolled
                          ? 'bg-background/80 backdrop-blur-md border-border shadow-sm'
                          : 'bg-background/0 border-transparent',
                )}
            >
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity z-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo.png"
                                alt={`${SITE_CONFIG.name} Лого`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span>{SITE_CONFIG.name}</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary relative py-1',
                                    pathname === link.href
                                        ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4">
                        {!isMounted ? (
                            <div className="h-9 w-20 bg-muted/50 rounded animate-pulse hidden sm:block" />
                        ) : isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full"
                                    >
                                        <Avatar className="h-9 w-9 border cursor-pointer hover:ring-2 ring-primary/20 transition-all">
                                            <AvatarImage
                                                src={avatarUrl}
                                                alt={displayName}
                                            />
                                            <AvatarFallback>
                                                {initials}
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
                                                {displayName}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => router.push('/profile')}
                                        className="cursor-pointer"
                                    >
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        Профиль
                                    </DropdownMenuItem>
                                    {user.role === 'admin' && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.push('/admin')
                                            }
                                            className="cursor-pointer"
                                        >
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Админ-панель
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem disabled>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Настройки
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-destructive focus:text-destructive cursor-pointer"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Выйти
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden sm:flex gap-2"
                                onClick={() => router.push('/login')}
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Войти</span>
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="lg:hidden fixed inset-0 z-40 bg-background animate-in fade-in slide-in-from-top-5 duration-200"
                    style={{ top: '64px', height: 'calc(100vh - 64px)' }}
                >
                    <div className="container px-4 py-6 h-full flex flex-col justify-between overflow-y-auto pb-20">
                        <nav className="flex flex-col gap-2">
                            {NAV_LINKS.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-4 p-4 rounded-xl transition-all duration-200',
                                        'active:scale-[0.98]',
                                        pathname === link.href
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'hover:bg-muted text-foreground/80',
                                    )}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        opacity: 0,
                                        animation:
                                            'fade-in-up 0.3s forwards ease-out',
                                    }}
                                >
                                    <div>
                                        <div className="text-base font-medium">
                                            {link.label}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {link.description}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        <div className="flex flex-col gap-4 mt-8 pt-8 border-t bg-background">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-2 mb-2">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={avatarUrl} />
                                            <AvatarFallback>
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full justify-center gap-2 h-12 text-base shadow-lg shadow-primary/20 bg-destructive text-white hover:bg-destructive/90"
                                        size="lg"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Выйти
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="w-full justify-center gap-2 h-12 text-base shadow-lg shadow-primary/20"
                                    size="lg"
                                    onClick={() => router.push('/login')}
                                >
                                    <LogIn className="h-4 w-4" />
                                    Войти
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
