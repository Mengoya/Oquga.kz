'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, Link } from '@/i18n/routing';
import { Menu, X, User, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
    const t = useTranslations('Navigation');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-md border-border shadow-sm'
                    : 'bg-background border-transparent',
            )}
        >
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span>{SITE_CONFIG.name}</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-6">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary relative py-1',
                                pathname === item.href
                                    ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {t(item.key)}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex"
                        aria-label={t('search')}
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex gap-2"
                    >
                        <User className="h-4 w-4" />
                        <span>{t('login')}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-5">
                    <div className="container px-4 py-8 h-[calc(100vh-4rem)] flex flex-col justify-between overflow-y-auto">
                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className={cn(
                                            'flex items-center gap-4 p-4 rounded-lg transition-colors',
                                            pathname === item.href
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted',
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <div>
                                            <div className="font-medium">
                                                {t(item.key)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {t(`${item.key}_desc`)}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="flex flex-col gap-4 mt-8 pt-8 border-t">
                            <div className="flex justify-center mb-4">
                                <LanguageSwitcher />
                            </div>
                            <Button
                                className="w-full justify-center gap-2"
                                size="lg"
                            >
                                <User className="h-4 w-4" />
                                {t('profile')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
