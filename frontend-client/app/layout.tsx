import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AiChat } from '@/components/chat/ai-chat';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Oquga Kz',
        template: '%s | Oquga Kz',
    },
    description:
        'Единая платформа для выбора университета, сравнения программ и поступления в ВУЗы Казахстана.',
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    'antialiased min-h-screen flex flex-col font-sans bg-background text-foreground',
                )}
            >
                <QueryProvider>
                    <Header />
                    <main className="flex-1 flex flex-col w-full">
                        {children}
                    </main>
                    <Footer />
                    <Toaster />
                    <AiChat />
                </QueryProvider>
            </body>
        </html>
    );
}
