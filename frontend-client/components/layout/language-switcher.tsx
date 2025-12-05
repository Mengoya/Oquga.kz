'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
            {['ru', 'kk', 'en'].map((lang) => (
                <Button
                    key={lang}
                    variant="ghost"
                    size="sm"
                    onClick={() => switchLocale(lang)}
                    className={cn(
                        'h-7 px-2 text-xs uppercase font-bold',
                        locale === lang
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {lang}
                </Button>
            ))}
        </div>
    );
}
