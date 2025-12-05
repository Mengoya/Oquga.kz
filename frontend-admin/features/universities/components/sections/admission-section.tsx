'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, AdmissionRuleDto } from '../../types';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function AdmissionSection({ data, onChange }: Props) {
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
                <h3 className="text-lg font-semibold mb-4">Правила приема</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Сроки приема, необходимые документы и этапы поступления
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Дата начала приема</Label>
                    <Input
                        type="date"
                        value={admissionRule.startDate || ''}
                        onChange={(e) => updateField('startDate', e.target.value || null)}
                    />
                </div>
                <div>
                    <Label>Дата окончания приема</Label>
                    <Input
                        type="date"
                        value={admissionRule.endDate || ''}
                        onChange={(e) => updateField('endDate', e.target.value || null)}
                    />
                </div>
            </div>

            <div>
                <Label>Необходимые документы</Label>
                <Textarea
                    value={admissionRule.documentsText || ''}
                    onChange={(e) => updateField('documentsText', e.target.value)}
                    rows={4}
                    placeholder="Список документов для поступления..."
                />
            </div>

            <div>
                <Label>Этапы поступления</Label>
                <Textarea
                    value={admissionRule.stepsText || ''}
                    onChange={(e) => updateField('stepsText', e.target.value)}
                    rows={4}
                    placeholder="Пошаговое описание процесса поступления..."
                />
            </div>

            <div>
                <Label>Военная кафедра</Label>
                <Textarea
                    value={admissionRule.militaryDepartmentInfo || ''}
                    onChange={(e) => updateField('militaryDepartmentInfo', e.target.value)}
                    rows={2}
                    placeholder="Информация о военной кафедре..."
                />
            </div>

            <div>
                <Label>Общежитие</Label>
                <Textarea
                    value={admissionRule.dormitoryInfo || ''}
                    onChange={(e) => updateField('dormitoryInfo', e.target.value)}
                    rows={2}
                    placeholder="Информация о предоставлении общежития..."
                />
            </div>
        </div>
    );
}
