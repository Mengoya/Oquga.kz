'use client';

import { useState } from 'react';
import { UniversityDetailResponse, UpdateUniversityValues } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUniversity } from '../api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
    Loader2,
    Building2,
    FileText,
    Users,
    Award,
    History,
    GraduationCap,
    ClipboardList,
    Wallet,
    Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BasicInfoSection } from './sections/basic-info-section';
import { DescriptionSection } from './sections/description-section';
import { LeadershipSection } from './sections/leadership-section';
import { AchievementsSection } from './sections/achievements-section';
import { HistorySection } from './sections/history-section';
import { FacultiesSection } from './sections/faculties-section';
import { AdmissionSection } from './sections/admission-section';
import { TuitionSection } from './sections/tuition-section';
import { InternationalSection } from './sections/international-section';

interface Props {
    university: UniversityDetailResponse;
}

type SectionKey =
    | 'basic'
    | 'description'
    | 'leadership'
    | 'achievements'
    | 'history'
    | 'faculties'
    | 'admission'
    | 'tuition'
    | 'international';

export function UniversityEditForm({ university }: Props) {
    const t = useTranslations('UniversityEdit.sections');
    const tCommon = useTranslations('Common');
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState<SectionKey>('basic');
    const [formData, setFormData] = useState<UpdateUniversityValues>(() =>
        initFormData(university),
    );

    const sections: {
        key: SectionKey;
        label: string;
        icon: React.ElementType;
    }[] = [
        { key: 'basic', label: t('basic'), icon: Building2 },
        { key: 'description', label: t('description'), icon: FileText },
        { key: 'leadership', label: t('leadership'), icon: Users },
        { key: 'achievements', label: t('achievements'), icon: Award },
        { key: 'history', label: t('history'), icon: History },
        { key: 'faculties', label: t('faculties'), icon: GraduationCap },
        { key: 'admission', label: t('admission'), icon: ClipboardList },
        { key: 'tuition', label: t('tuition'), icon: Wallet },
        { key: 'international', label: t('international'), icon: Globe },
    ];

    const mutation = useMutation({
        mutationFn: (values: UpdateUniversityValues) =>
            updateUniversity(String(university.id), values),
        onSuccess: (updatedData) => {
            toast.success(tCommon('feedback.success'), {
                description: tCommon('feedback.updated'),
            });
            queryClient.invalidateQueries({ queryKey: ['universities'] });
            queryClient.setQueryData(
                ['university', String(university.id)],
                updatedData,
            );
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                tCommon('feedback.genericError');
            toast.error(tCommon('feedback.error'), {
                description: message,
            });
        },
    });

    const handleSave = () => {
        mutation.mutate(formData);
    };

    const updateFormData = (updates: Partial<UpdateUniversityValues>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    return (
        <div className="flex gap-6">
            <div className="w-64 shrink-0">
                <nav className="space-y-1 sticky top-20">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.key}
                                onClick={() => setActiveSection(section.key)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left',
                                    activeSection === section.key
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {section.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-1 min-w-0">
                {activeSection === 'basic' && (
                    <BasicInfoSection
                        universityId={String(university.id)}
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'description' && (
                    <DescriptionSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'leadership' && (
                    <LeadershipSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'achievements' && (
                    <AchievementsSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'history' && (
                    <HistorySection data={formData} onChange={updateFormData} />
                )}
                {activeSection === 'faculties' && (
                    <FacultiesSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'admission' && (
                    <AdmissionSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}
                {activeSection === 'tuition' && (
                    <TuitionSection data={formData} onChange={updateFormData} />
                )}
                {activeSection === 'international' && (
                    <InternationalSection
                        data={formData}
                        onChange={updateFormData}
                    />
                )}

                <div className="flex justify-end pt-6 mt-6 border-t">
                    <Button onClick={handleSave} disabled={mutation.isPending}>
                        {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {tCommon('actions.saveChanges')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function initFormData(
    university: UniversityDetailResponse,
): UpdateUniversityValues {
    return {
        photoUrl: university.photoUrl || '',
        websiteUrl: university.websiteUrl || '',
        virtualTourUrl: university.virtualTourUrl || '',
        foundedYear: university.foundedYear,
        contactPhone: university.contactPhone || '',
        contactEmail: university.contactEmail || '',
        translations: {
            ru: {
                name: university.translations.ru?.name || '',
                city: university.translations.ru?.city || '',
                shortDescription:
                    university.translations.ru?.shortDescription || '',
                description: university.translations.ru?.description || '',
                goal: university.translations.ru?.goal || '',
                address: university.translations.ru?.address || '',
                historyText: university.translations.ru?.historyText || '',
            },
            kk: {
                name: university.translations.kk?.name || '',
                city: university.translations.kk?.city || '',
                shortDescription:
                    university.translations.kk?.shortDescription || '',
                description: university.translations.kk?.description || '',
                goal: university.translations.kk?.goal || '',
                address: university.translations.kk?.address || '',
                historyText: university.translations.kk?.historyText || '',
            },
            en: {
                name: university.translations.en?.name || '',
                city: university.translations.en?.city || '',
                shortDescription:
                    university.translations.en?.shortDescription || '',
                description: university.translations.en?.description || '',
                goal: university.translations.en?.goal || '',
                address: university.translations.en?.address || '',
                historyText: university.translations.en?.historyText || '',
            },
        },
        leadership: university.leadership.map((l) => ({ ...l })),
        achievements: university.achievements.map((a) => ({ ...a })),
        historyEvents: university.historyEvents.map((h) => ({ ...h })),
        faculties: university.faculties.map((f) => ({
            ...f,
            translations: { ...f.translations },
            departments: f.departments.map((d) => ({
                ...d,
                translations: { ...d.translations },
            })),
            programGroups: f.programGroups.map((pg) => ({
                ...pg,
                translations: { ...pg.translations },
                programs: pg.programs.map((p) => ({
                    ...p,
                    translations: { ...p.translations },
                })),
                passingScore: pg.passingScore ? { ...pg.passingScore } : null,
            })),
        })),
        admissionRule: university.admissionRule
            ? { ...university.admissionRule }
            : null,
        tuitionDiscounts: university.tuitionDiscounts.map((t) => ({ ...t })),
        internationalSections: university.internationalSections.map((s) => ({
            ...s,
            translations: { ...s.translations },
            items: s.items.map((i) => ({
                ...i,
                translations: { ...i.translations },
            })),
        })),
    };
}
