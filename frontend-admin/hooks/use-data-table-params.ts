'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function useDataTableParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const setParams = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(
                searchParams.toString(),
            );

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === 'all') {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            });

            startTransition(() => {
                router.push(`${pathname}?${newSearchParams.toString()}`, {
                    scroll: false,
                });
            });
        },
        [pathname, router, searchParams],
    );

    return {
        page,
        search,
        status,
        setParams,
        isPending,
    };
}
