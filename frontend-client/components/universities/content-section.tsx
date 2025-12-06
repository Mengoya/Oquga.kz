'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export function ContentSection({
    title,
    icon,
    children,
    className,
    id,
}: ContentSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id={id}
            className={cn(
                'bg-card rounded-2xl p-6 md:p-8 border shadow-sm',
                'transition-all duration-700',
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8',
                className,
            )}
        >
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3 border-b pb-4">
                {icon && (
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">
                        {icon}
                    </span>
                )}
                {title}
            </h2>
            {children}
        </section>
    );
}
