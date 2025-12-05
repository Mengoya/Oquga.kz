'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUniversityDetail } from '@/features/universities/api';
import { UniversityEditForm } from '@/features/universities/components/university-edit-form';
import { ProgressCard } from '@/features/universities/components/progress-card';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';
import { useEffect } from 'react';

export default function UniversityEditPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const id = params.id as string;

    const { data: university, isLoading, error } = useQuery({
        queryKey: ['university', id],
        queryFn: () => fetchUniversityDetail(id),
        enabled: !!id,
    });

    useEffect(() => {
        if (user?.role === 'UNIVERSITY_ADMIN' && user.universityId !== Number(id)) {
            router.push('/');
        }
    }, [user, id, router]);

    const isUniversityAdmin = user?.role === 'UNIVERSITY_ADMIN';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold">Университет не найден</h2>
                    <Button variant="link" onClick={() => router.back()}>
                        Вернуться назад
                    </Button>
                </div>
            </div>
        );
    }

    const translation = university.translations.ru ||
        university.translations.kk ||
        university.translations.en;

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    {!isUniversityAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {translation?.name || 'Редактирование'}
                        </h1>
                        <p className="text-muted-foreground">
                            Редактирование информации о ВУЗе
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
                            <UniversityEditForm university={university} />
                        </div>
                    </div>
                    <div>
                        <ProgressCard progress={university.progress} />
                    </div>
                </div>
            </div>
        </main>
    );
}
