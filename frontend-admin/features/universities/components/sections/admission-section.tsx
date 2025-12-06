'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, AdmissionRuleDto } from '../../types';
import { useTranslations } from 'next-intl';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function AdmissionSection({ data, onChange }: Props) {
    const t = useTranslations('UniversityEdit.admission');

    const admissionRule = data.admissionRule || {
        startDate: null,
        endDate: null,
        documentsText: null,
        stepsText: null,
        militaryDepartmentInfo: null,
        dormitoryInfo: null,
    };

    const updateField = (field: keyof AdmissionRuleDto, value: any) => {
        onChange({
            admissionRule: {
                ...admissionRule,
                [field]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>{t('startDate')}</Label>
                    <Input
                        type="date"
                        value={admissionRule.startDate || ''}
                        onChange={(e) =>
                            updateField('startDate', e.target.value || null)
                        }
                    />
                </div>
                <div>
                    <Label>{t('endDate')}</Label>
                    <Input
                        type="date"
                        value={admissionRule.endDate || ''}
                        onChange={(e) =>
                            updateField('endDate', e.target.value || null)
                        }
                    />
                </div>
            </div>

            <div>
                <Label>{t('documents')}</Label>
                <Textarea
                    value={admissionRule.documentsText || ''}
                    onChange={(e) =>
                        updateField('documentsText', e.target.value)
                    }
                    rows={4}
                    placeholder="Список документов для поступления..."
                />
            </div>

            <div>
                <Label>{t('steps')}</Label>
                <Textarea
                    value={admissionRule.stepsText || ''}
                    onChange={(e) => updateField('stepsText', e.target.value)}
                    rows={4}
                    placeholder="Пошаговое описание процесса поступления..."
                />
            </div>

            <div>
                <Label>{t('military')}</Label>
                <Textarea
                    value={admissionRule.militaryDepartmentInfo || ''}
                    onChange={(e) =>
                        updateField('militaryDepartmentInfo', e.target.value)
                    }
                    rows={2}
                    placeholder="Информация о военной кафедре..."
                />
            </div>

            <div>
                <Label>{t('dormitory')}</Label>
                <Textarea
                    value={admissionRule.dormitoryInfo || ''}
                    onChange={(e) =>
                        updateField('dormitoryInfo', e.target.value)
                    }
                    rows={2}
                    placeholder="Информация о предоставлении общежития..."
                />
            </div>
        </div>
    );
}
