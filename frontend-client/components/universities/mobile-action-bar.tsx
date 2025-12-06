'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Globe, FileText, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileActionBarProps {
    contactPhone: string | null;
    websiteUrl: string | null;
    translations: {
        call: string;
        website: string;
        apply: string;
    };
}

export function MobileActionBar({
    contactPhone,
    websiteUrl,
    translations: t,
}: MobileActionBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY > 400);
            setShowScrollTop(scrollY > 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
                    'bg-background/95 backdrop-blur-lg border-t shadow-lg',
                    'transition-transform duration-300 safe-area-inset-bottom',
                    isVisible ? 'translate-y-0' : 'translate-y-full',
                )}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2">
                        {contactPhone && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-11"
                                asChild
                            >
                                <a href={`tel:${contactPhone}`}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    {t.call}
                                </a>
                            </Button>
                        )}

                        {websiteUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-11"
                                asChild
                            >
                                <a
                                    href={websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    {t.website}
                                </a>
                            </Button>
                        )}

                        <Button size="sm" className="flex-1 h-11 font-semibold">
                            <FileText className="h-4 w-4 mr-2" />
                            {t.apply}
                        </Button>
                    </div>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className={cn(
                    'fixed right-4 z-40 p-3 rounded-full',
                    'bg-primary text-primary-foreground shadow-lg',
                    'transition-all duration-300',
                    'hover:scale-110 active:scale-95',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
                    showScrollTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none',
                    'bottom-20 lg:bottom-6',
                )}
                aria-label="Scroll to top"
            >
                <ChevronUp className="h-5 w-5" />
            </button>
        </>
    );
}
