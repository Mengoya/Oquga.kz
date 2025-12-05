'use client';

import { ProgressDto } from '../types';
import { Progress } from '@/components/ui/progress';
import {
    Building2,
    FileText,
    Users,
    Award,
    GraduationCap,
    ClipboardList,
    Wallet,
    Globe
} from 'lucide-react';

interface Props {
    progress: ProgressDto;
}

const sectionConfig = {
    basicInfo: { icon: Building2, label: 'Базовая информация' },
    description: { icon: FileText, label: 'Описание и история' },
    leadership: { icon: Users, label: 'Руководство' },
    achievements: { icon: Award, label: 'Достижения' },
    faculties: { icon: GraduationCap, label: 'Факультеты' },
    admissionRules: { icon: ClipboardList, label: 'Правила приема' },
    tuition: { icon: Wallet, label: 'Стоимость обучения' },
    international: { icon: Globe, label: 'Международное сотрудничество' },
};

export function ProgressCard({ progress }: Props) {
    const sections = [
        progress.basicInfo,
        progress.description,
        progress.leadership,
        progress.achievements,
        progress.faculties,
        progress.admissionRules,
        progress.tuition,
        progress.international,
    ];

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Прогресс заполнения</h3>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{progress.totalPercent}%</span>
                </div>
            </div>

            <Progress value={progress.totalPercent} className="h-3 mb-6" />

            <div className="grid gap-3">
                {sections.map((section) => {
                    const config = sectionConfig[section.name as keyof typeof sectionConfig];
                    const Icon = config?.icon || Building2;

                    return (
                        <div key={section.name} className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">
                                        {config?.label || section.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {section.filledFields}/{section.totalFields} полей
                                    </span>
                                </div>
                                <Progress
                                    value={(section.percent / section.maxPercent) * 100}
                                    className="h-1.5"
                                />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                                {section.percent}/{section.maxPercent}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
