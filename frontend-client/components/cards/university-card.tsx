'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Eye, Scale, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    UniversityResponse,
    UniversityTranslation,
} from '@/features/universities/types';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import {
    useCompareIds,
    useCompareHydrated,
    useCompareActions,
    useCanAddMore
} from '@/stores/use-compare-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface UniversityCardProps {
    university: UniversityResponse;
    locale?: string;
}

function getTranslation(
    university: UniversityResponse,
    locale: string = 'ru',
): UniversityTranslation {
    return (
        university.translations[locale] ||
        Object.values(university.translations)[0] || {
            name: 'Название отсутствует',
            shortDescription: '',
            description: '',
            city: 'Город не указан',
            isComplete: false,
        }
    );
}

export function UniversityCard({
                                   university,
                                   locale = 'ru',
                               }: UniversityCardProps) {
    const t = useTranslations('universities');
    const translation = getTranslation(university, locale);
    const imageUrl = university.photoUrl || PLACEHOLDER_IMAGE;

    const compareIds = useCompareIds();
    const isHydrated = useCompareHydrated();
    const canAddMore = useCanAddMore();
    const { toggleCompare } = useCompareActions();

    const isCompared = compareIds.includes(university.id);

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isCompared && !canAddMore) {
            toast.error(t('compareMaxReached'));
            return;
        }

        const added = toggleCompare(university.id);

        if (added) {
            toast.success(t('addedToCompare'));
        } else {
            toast.success(t('removedFromCompare'));
        }
    };

    const universityPath = `/universities/${university.id}`;

    return (
        <article className="group h-full flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 relative">
            {isHydrated && (
                <Button
                    variant={isCompared ? 'default' : 'outline'}
                    size="icon"
                    className={cn(
                        'absolute top-3 right-12 h-8 w-8 rounded-full shadow-md transition-all z-20',
                        isCompared
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-white/90 backdrop-blur hover:bg-primary/10 hover:border-primary border-white/50',
                        !canAddMore && !isCompared && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={handleCompareClick}
                    title={isCompared ? t('removeFromCompare') : t('addToCompare')}
                >
                    {isCompared ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Scale className="h-4 w-4" />
                    )}
                </Button>
            )}

            <Link href={universityPath as `/universities/${string}`} className="flex flex-col flex-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b bg-muted">
                    <Image
                        src={imageUrl}
                        alt={translation.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-white/90 backdrop-blur text-foreground rounded shadow-sm flex items-center gap-1 z-10">
                        <Eye className="h-3 w-3 text-primary" />
                        {university.viewCount.toLocaleString(locale)}
                    </div>
                    {university.progressPercent > 80 && (
                        <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-green-500/90 text-white rounded shadow-sm z-10">
                            ✓
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {translation.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                            <span>{translation.city}</span>
                        </div>
                        {university.foundedYear && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                                <span>{university.foundedYear}</span>
                            </div>
                        )}
                    </div>

                    {translation.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                            {translation.shortDescription}
                        </p>
                    )}

                    <div className="mt-auto">
                        <Button
                            variant="secondary"
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {t('details')}
                        </Button>
                    </div>
                </div>
            </Link>
        </article>
    );
}
