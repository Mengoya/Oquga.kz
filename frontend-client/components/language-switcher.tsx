'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, localeFlags, localeNames, Locale } from '@/i18n/config';

export function LanguageSwitcher() {
    const t = useTranslations('language');
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLocaleChange = (newLocale: Locale) => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-9 w-9 sm:h-10 sm:w-10',
                        isPending && 'opacity-50 pointer-events-none',
                    )}
                    aria-label={t('select')}
                >
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[150px]">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => handleLocaleChange(loc)}
                        className={cn(
                            'cursor-pointer flex items-center justify-between',
                            locale === loc && 'bg-accent',
                        )}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-base">
                                {localeFlags[loc]}
                            </span>
                            <span>{localeNames[loc]}</span>
                        </span>
                        {locale === loc && (
                            <Check className="h-4 w-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
