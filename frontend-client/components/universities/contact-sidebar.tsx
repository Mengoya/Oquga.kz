'use client';

import React, { useState } from 'react';
import {
    Phone,
    Mail,
    Globe,
    MapPin,
    Copy,
    Check,
    MessageCircle,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ContactSidebarProps {
    contactPhone: string | null;
    contactEmail: string | null;
    websiteUrl: string | null;
    city: string;
    translations: {
        contacts: string;
        phone: string;
        email: string;
        website: string;
        location: string;
        applyDocuments: string;
        applyNote: string;
        scheduleVisit: string;
        askQuestion: string;
        copied: string;
    };
}

export function ContactSidebar({
    contactPhone,
    contactEmail,
    websiteUrl,
    city,
    translations: t,
}: ContactSidebarProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = async (value: string, field: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            toast.success(t.copied);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const contactItems = [
        {
            id: 'phone',
            icon: Phone,
            label: t.phone,
            value: contactPhone,
            href: contactPhone ? `tel:${contactPhone}` : undefined,
            color: 'text-green-500 bg-green-500/10',
        },
        {
            id: 'email',
            icon: Mail,
            label: t.email,
            value: contactEmail,
            href: contactEmail ? `mailto:${contactEmail}` : undefined,
            color: 'text-blue-500 bg-blue-500/10',
        },
        {
            id: 'website',
            icon: Globe,
            label: t.website,
            value: websiteUrl
                ?.replace(/^https?:\/\/(www\.)?/, '')
                .replace(/\/$/, ''),
            href: websiteUrl || undefined,
            external: true,
            color: 'text-purple-500 bg-purple-500/10',
        },
        {
            id: 'location',
            icon: MapPin,
            label: t.location,
            value: city,
            href: `https://maps.google.com/?q=${encodeURIComponent(city)}`,
            external: true,
            color: 'text-orange-500 bg-orange-500/10',
        },
    ].filter((item) => item.value);

    return (
        <aside className="lg:col-span-4 space-y-6">
            <div className="bg-card rounded-2xl border shadow-sm sticky top-24">
                <div className="p-5 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        {t.contacts}
                    </h3>
                </div>

                <div className="p-5 space-y-4">
                    {contactItems.map((item) => (
                        <div
                            key={item.id}
                            className="group flex items-start gap-3"
                        >
                            <div
                                className={cn(
                                    'h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                                    item.color,
                                    'group-hover:scale-105',
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                    {item.label}
                                </p>
                                <div className="flex items-center gap-2">
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target={
                                                item.external
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                item.external
                                                    ? 'noopener noreferrer'
                                                    : undefined
                                            }
                                            className="text-sm font-medium hover:text-primary transition-colors truncate"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span className="text-sm font-medium truncate">
                                            {item.value}
                                        </span>
                                    )}
                                    {item.id !== 'location' && item.value && (
                                        <button
                                            onClick={() =>
                                                handleCopy(item.value!, item.id)
                                            }
                                            className={cn(
                                                'p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100',
                                                'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50',
                                            )}
                                            aria-label={`Copy ${item.label}`}
                                        >
                                            {copiedField === item.id ? (
                                                <Check className="h-3.5 w-3.5 text-green-500" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className="p-5 space-y-3">
                    <Button
                        className="w-full font-semibold text-base h-12 shadow-lg shadow-primary/20 group"
                        size="lg"
                    >
                        {t.applyDocuments}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>

                    <p className="text-[11px] text-center text-muted-foreground pt-2">
                        {t.applyNote}
                    </p>
                </div>
            </div>
        </aside>
    );
}
