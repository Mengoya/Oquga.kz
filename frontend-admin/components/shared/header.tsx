'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
    const tNav = useTranslations('Navigation');
    const tCommon = useTranslations('Common.actions');
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: tNav('universities') },
        { href: '/programs', label: tNav('programs') },
        { href: '/about', label: tNav('about') },
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

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Button variant="default" size="sm">
                        {tCommon('login')}
                    </Button>
                </div>
            </div>
        </header>
    );
}
