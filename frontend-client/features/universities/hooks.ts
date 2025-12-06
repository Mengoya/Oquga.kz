import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getUniversities } from './api';
import { UniversityListParams, UniversityListResponse } from './types';

export const universityKeys = {
    all: ['universities'] as const,
    lists: () => [...universityKeys.all, 'list'] as const,
    list: (params: UniversityListParams) =>
        [...universityKeys.lists(), params] as const,
    details: () => [...universityKeys.all, 'detail'] as const,
    detail: (id: string) => [...universityKeys.details(), id] as const,
};

export function useUniversities(params: UniversityListParams = {}) {
    return useQuery<UniversityListResponse, Error>({
        queryKey: universityKeys.list(params),
        queryFn: () => getUniversities(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
