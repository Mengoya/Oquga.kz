'use client';

import React, { useState } from 'react';
import { ExternalLink, Maximize2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface VirtualTourViewerProps {
    url: string;
    title: string;
    className?: string;
}

export function VirtualTourViewer({
    url,
    title,
    className,
}: VirtualTourViewerProps) {
    const t = useTranslations('universities');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleOpenFullscreen = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (!url) return null;

    return (
        <div
            className={cn(
                'relative w-full rounded-2xl overflow-hidden border bg-muted/20 shadow-sm flex flex-col',
                className,
            )}
        >
            <div className="flex items-center justify-between px-4 py-3 bg-card border-b">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm md:text-base flex items-center gap-2">
                        <Maximize2 className="h-4 w-4 text-primary" />
                        {t('virtualTour')}
                    </h3>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8 text-xs md:text-sm"
                    onClick={handleOpenFullscreen}
                >
                    {t('openInNewWindow')}
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </div>

            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[400px] bg-black/5">
                {isLoading && !hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-muted/50 backdrop-blur-sm animate-in fade-in">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">
                            {t('loadingTour')}
                        </p>
                    </div>
                )}

                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background p-6 text-center">
                        <Alert variant="destructive" className="max-w-md">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('tourLoadError')}</AlertTitle>
                            <AlertDescription>
                                {t('tourLoadErrorDesc')}
                            </AlertDescription>
                        </Alert>
                        <Button
                            variant="default"
                            className="mt-4"
                            onClick={handleOpenFullscreen}
                        >
                            {t('openInNewWindow')}
                        </Button>
                    </div>
                )}

                <iframe
                    src={url}
                    title={`3D Tour - ${title}`}
                    className={cn(
                        'w-full h-full border-0 transition-opacity duration-500',
                        isLoading ? 'opacity-0' : 'opacity-100',
                    )}
                    allowFullScreen
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking"
                    referrerPolicy="no-referrer"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setHasError(true);
                    }}
                />
            </div>

            <div className="p-3 bg-muted/30 text-xs text-muted-foreground text-center border-t">
                {t('virtualTourDesc')}
            </div>
        </div>
    );
}
