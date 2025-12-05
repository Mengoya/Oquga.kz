import { Header } from '@/components/shared/header';
import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 bg-muted/30">{children}</div>
        </div>
    );
}
