'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTransition, useCallback } from 'react';

const SUPPORTED_LOCALES = ['ru', 'kk', 'en'] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function removeLocaleFromPathname(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)) {
        const pathWithoutLocale = '/' + segments.slice(1).join('/');
        return pathWithoutLocale || '/';
    }

    return pathname;
}

export function LanguageSwitcher() {
    const t = useTranslations('Common.languages');
    const currentLocale = useLocale();
    const router = useRouter();
    const fullPathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = useCallback(
        (nextLocale: SupportedLocale) => {
            if (nextLocale === currentLocale) return;

            startTransition(() => {
                const pathnameWithoutLocale = removeLocaleFromPathname(fullPathname);

                const queryString = searchParams.toString();
                const targetPath = queryString
                    ? `${pathnameWithoutLocale}?${queryString}`
                    : pathnameWithoutLocale;

                router.replace(targetPath, { locale: nextLocale });
            });
        },
        [currentLocale, fullPathname, searchParams, router]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    aria-label="Switch language"
                >
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {SUPPORTED_LOCALES.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        disabled={currentLocale === locale}
                    >
                        {t(locale)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
