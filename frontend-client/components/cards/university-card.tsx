import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    UniversityResponse,
    UniversityTranslation,
} from '@/features/universities/types';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

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
    const translation = getTranslation(university, locale);
    const imageUrl = university.photoUrl || PLACEHOLDER_IMAGE;

    return (
        <Link
            href={`/app/%5Blocale%5D/universities/${university.id}`}
            className="group h-full block"
        >
            <article className="h-full flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b bg-muted">
                    <Image
                        src={imageUrl}
                        alt={translation.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-white/90 backdrop-blur text-foreground rounded shadow-sm flex items-center gap-1">
                        <Eye className="h-3 w-3 text-primary" />
                        {university.viewCount.toLocaleString('ru-RU')}
                    </div>
                    {university.progressPercent > 80 && (
                        <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-green-500/90 text-white rounded shadow-sm">
                            Верифицирован
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
                                <span>
                                    Основан в {university.foundedYear} году
                                </span>
                            </div>
                        )}
                    </div>

                    {translation.shortDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                            {translation.shortDescription}
                        </p>
                    )}

                    <Button
                        variant="secondary"
                        className="w-full mt-auto group-hover:bg-primary group-hover:text-white transition-colors"
                        tabIndex={-1}
                    >
                        Подробнее
                    </Button>
                </div>
            </article>
        </Link>
    );
}
