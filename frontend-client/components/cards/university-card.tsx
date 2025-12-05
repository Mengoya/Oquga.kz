import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { University } from '@/types';
import { useTranslations } from 'next-intl';

interface UniversityCardProps {
    uni: University;
}

export function UniversityCard({ uni }: UniversityCardProps) {
    const t = useTranslations('Universities');

    return (
        <Link href={`/universities/${uni.id}`} className="group h-full block">
            <article className="h-full flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b bg-muted">
                    <Image
                        src={uni.image}
                        alt={uni.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-white/90 backdrop-blur text-foreground rounded shadow-sm flex items-center gap-1">
                        <Eye className="h-3 w-3 text-primary" />
                        {uni.views.toLocaleString()}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                        {uni.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                            <span>{uni.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                            <span>
                                {t('founded', { year: uni.foundedYear })}
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                        {uni.description}
                    </p>

                    <Button
                        variant="secondary"
                        className="w-full mt-auto group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                        {t('details')}
                    </Button>
                </div>
            </article>
        </Link>
    );
}
