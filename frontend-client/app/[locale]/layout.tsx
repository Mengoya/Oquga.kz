import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AiChat } from '@/components/chat/ai-chat';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { routing } from '@/i18n/routing';
import { Locale } from '@/i18n/config';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    const t = messages.metadata as { title: string; description: string };

    return {
        title: {
            default: t.title,
            template: `%s | ${t.title}`,
        },
        description: t.description,
        icons: {
            icon: '/favicon.ico',
        },
    };
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    'antialiased min-h-screen flex flex-col font-sans bg-background text-foreground',
                )}
            >
                <NextIntlClientProvider messages={messages}>
                    <QueryProvider>
                        <Header />
                        <main className="flex-1 flex flex-col w-full">
                            {children}
                        </main>
                        <Footer />
                        <Toaster />
                        <AiChat />
                    </QueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
