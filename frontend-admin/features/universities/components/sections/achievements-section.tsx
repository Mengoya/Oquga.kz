'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, AchievementDto } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function AchievementsSection({ data, onChange }: Props) {
    const achievements = data.achievements || [];

    const addAchievement = () => {
        onChange({
            achievements: [
                ...achievements,
                { id: null, title: '', year: null, rankValue: '', details: '', sortOrder: achievements.length },
            ],
        });
    };

    const removeAchievement = (index: number) => {
        onChange({
            achievements: achievements.filter((_, i) => i !== index),
        });
    };

    const updateAchievement = (index: number, updates: Partial<AchievementDto>) => {
        onChange({
            achievements: achievements.map((a, i) => (i === index ? { ...a, ...updates } : a)),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Достижения</h3>
                    <p className="text-sm text-muted-foreground">
                        Рейтинги, награды и достижения университета
                    </p>
                </div>
                <Button onClick={addAchievement} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                </Button>
            </div>

            {achievements.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Нет достижений</p>
                </div>
            )}

            <div className="space-y-4">
                {achievements.map((achievement, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAchievement(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label>Название</Label>
                            <Input
                                value={achievement.title}
                                onChange={(e) => updateAchievement(index, { title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Год</Label>
                                <Input
                                    type="number"
                                    value={achievement.year || ''}
                                    onChange={(e) => updateAchievement(index, { year: e.target.value ? Number(e.target.value) : null })}
                                />
                            </div>
                            <div>
                                <Label>Место/Ранг</Label>
                                <Input
                                    value={achievement.rankValue || ''}
                                    onChange={(e) => updateAchievement(index, { rankValue: e.target.value })}
                                    placeholder="Например: 1 место, Топ-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Детали</Label>
                            <Textarea
                                value={achievement.details || ''}
                                onChange={(e) => updateAchievement(index, { details: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
