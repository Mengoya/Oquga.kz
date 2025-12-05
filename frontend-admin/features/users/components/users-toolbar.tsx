'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X, Plus, FilterX } from 'lucide-react';
import { useDataTableParams } from '@/hooks/use-data-table-params';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { MOCK_UNIVERSITIES_LIST } from '../api';
import { CreateUserDialog } from '@/features/users/components/create-user-dialog';

export function UsersToolbar() {
    const t = useTranslations('UsersPage');
    const searchParams = useSearchParams();

    const currentRole = searchParams.get('role') || 'all';
    const currentUni = searchParams.get('universityId') || 'all';
    const currentSearch = searchParams.get('search') || '';

    const { setParams } = useDataTableParams();
    const [localSearch, setLocalSearch] = useState(currentSearch);
    const debouncedSearch = useDebounce(localSearch, 500);

    useEffect(() => {
        if (debouncedSearch !== currentSearch) {
            setParams({ search: debouncedSearch, page: 1 });
        }
    }, [debouncedSearch, currentSearch, setParams]);

    const handleRoleChange = (val: string) => {
        setParams({ role: val, page: 1 });
    };

    const handleUniChange = (val: string) => {
        setParams({ universityId: val, page: 1 });
    };

    const hasActiveFilters =
        currentRole !== 'all' || currentUni !== 'all' || localSearch !== '';

    const resetFilters = () => {
        setLocalSearch('');
        setParams({ search: '', role: 'all', universityId: 'all', page: 1 });
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search')}
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

                <Select value={currentRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder={t('filters.role')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('filters.role')}</SelectItem>
                        <SelectItem value="admin">
                            {t('roles.admin')}
                        </SelectItem>
                        <SelectItem value="manager">
                            {t('roles.manager')}
                        </SelectItem>
                        <SelectItem value="viewer">
                            {t('roles.viewer')}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select value={currentUni} onValueChange={handleUniChange}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder={t('filters.university')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t('filters.university')}
                        </SelectItem>
                        {MOCK_UNIVERSITIES_LIST.map((uni) => (
                            <SelectItem key={uni.id} value={uni.id}>
                                {uni.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={resetFilters}
                        title="Сбросить"
                    >
                        <FilterX className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <CreateUserDialog />
        </div>
    );
}
