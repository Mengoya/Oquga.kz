import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

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
    return children;
}
