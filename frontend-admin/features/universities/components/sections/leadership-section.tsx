'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, LeadershipDto } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function LeadershipSection({ data, onChange }: Props) {
    const leadership = data.leadership || [];

    const addLeader = () => {
        onChange({
            leadership: [
                ...leadership,
                { id: null, fullName: '', position: '', bioSummary: '', sortOrder: leadership.length },
            ],
        });
    };

    const removeLeader = (index: number) => {
        onChange({
            leadership: leadership.filter((_, i) => i !== index),
        });
    };

    const updateLeader = (index: number, updates: Partial<LeadershipDto>) => {
        onChange({
            leadership: leadership.map((l, i) => (i === index ? { ...l, ...updates } : l)),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Руководство</h3>
                    <p className="text-sm text-muted-foreground">
                        Ректор, проректоры и другие члены руководства
                    </p>
                </div>
                <Button onClick={addLeader} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                </Button>
            </div>

            {leadership.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Нет записей о руководстве</p>
                </div>
            )}

            <div className="space-y-4">
                {leadership.map((leader, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLeader(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>ФИО</Label>
                                <Input
                                    value={leader.fullName}
                                    onChange={(e) => updateLeader(index, { fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Должность</Label>
                                <Input
                                    value={leader.position}
                                    onChange={(e) => updateLeader(index, { position: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Биография</Label>
                            <Textarea
                                value={leader.bioSummary || ''}
                                onChange={(e) => updateLeader(index, { bioSummary: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
