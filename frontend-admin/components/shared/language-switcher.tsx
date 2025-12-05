'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
    const t = useTranslations('Common.languages');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => onSelectChange('ru')}
                    disabled={locale === 'ru'}
                >
                    {t('ru')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onSelectChange('kk')}
                    disabled={locale === 'kk'}
                >
                    {t('kk')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onSelectChange('en')}
                    disabled={locale === 'en'}
                >
                    {t('en')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
