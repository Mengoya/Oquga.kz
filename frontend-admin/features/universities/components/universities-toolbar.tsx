'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { useDataTableParams } from '@/hooks/use-data-table-params';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslations } from 'next-intl';
import { CreateUniversityDialog } from '@/features/universities/components/create-university-dialog';

export function UniversitiesToolbar() {
    const tDashboard = useTranslations('Dashboard');
    const tCommon = useTranslations('Common.actions');

    const { search, setParams } = useDataTableParams();
    const [localSearch, setLocalSearch] = useState(search);
    const debouncedSearch = useDebounce(localSearch, 500);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch !== search) {
            setParams({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch, search, setParams]);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={tDashboard('search')}
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-9"
                    />
                    {localSearch && (
                        <button
                            onClick={() => setLocalSearch('')}
                            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button variant="outline" className="hidden sm:flex">
                    <Filter className="mr-2 h-4 w-4" />
                    {tCommon('filter')}
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <CreateUniversityDialog />
            </div>
        </div>
    );
}
