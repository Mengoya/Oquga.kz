'use client';

import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    useCompareIds,
    useCompareHydrated,
    useCompareActions
} from '@/stores/use-compare-store';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function CompareFloatBar() {
    const t = useTranslations('universities');
    const router = useRouter();

    const compareIds = useCompareIds();
    const isHydrated = useCompareHydrated();
    const { clearCompare } = useCompareActions();

    const compareCount = compareIds.length;

    if (!isHydrated || compareCount === 0) return null;

    const handleCompare = () => {
        router.push('/universities/compare' as any);
    };

    return (
        <div
            className={cn(
                'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
                'bg-card border shadow-2xl rounded-full px-4 py-3',
                'flex items-center gap-4',
                'animate-in slide-in-from-bottom-5 fade-in duration-300'
            )}
        >
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        {t('compareSelected', { count: compareCount })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {t('compareMax', { max: 4 })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={clearCompare}
                    title={t('clearCompare')}
                >
                    <X className="h-4 w-4" />
                </Button>

                <Button
                    onClick={handleCompare}
                    disabled={compareCount < 2}
                    className="rounded-full px-6 gap-2"
                >
                    {t('compareNow')}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
