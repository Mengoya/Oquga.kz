'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
    compareIds: number[];
    isHydrated: boolean;

    addToCompare: (id: number) => boolean;
    removeFromCompare: (id: number) => void;
    toggleCompare: (id: number) => boolean;
    clearCompare: () => void;
    setHydrated: (state: boolean) => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            compareIds: [],
            isHydrated: false,

            addToCompare: (id: number) => {
                const { compareIds } = get();
                if (compareIds.includes(id)) return false;
                if (compareIds.length >= MAX_COMPARE_ITEMS) return false;

                set({ compareIds: [...compareIds, id] });
                return true;
            },

            removeFromCompare: (id: number) => {
                set((state) => ({
                    compareIds: state.compareIds.filter((compareId) => compareId !== id),
                }));
            },

            toggleCompare: (id: number) => {
                const { compareIds } = get();
                if (compareIds.includes(id)) {
                    set({ compareIds: compareIds.filter((compareId) => compareId !== id) });
                    return false;
                }
                if (compareIds.length >= MAX_COMPARE_ITEMS) return false;
                set({ compareIds: [...compareIds, id] });
                return true;
            },

            clearCompare: () => {
                set({ compareIds: [] });
            },

            setHydrated: (isHydrated: boolean) => {
                set({ isHydrated });
            },
        }),
        {
            name: 'university-compare-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
            partialize: (state) => ({ compareIds: state.compareIds }),
        }
    )
);

export function useCompareIds() {
    return useCompareStore((state) => state.compareIds);
}

export function useCompareHydrated() {
    return useCompareStore((state) => state.isHydrated);
}

export function useCompareActions() {
    return useCompareStore(
        useShallow((state) => ({
            addToCompare: state.addToCompare,
            removeFromCompare: state.removeFromCompare,
            toggleCompare: state.toggleCompare,
            clearCompare: state.clearCompare,
        }))
    );
}

export function useCompareCount() {
    return useCompareStore((state) => state.compareIds.length);
}

export function useCanAddMore() {
    return useCompareStore((state) => state.compareIds.length < MAX_COMPARE_ITEMS);
}

export function useIsInCompare(id: number) {
    return useCompareStore((state) => state.compareIds.includes(id));
}
