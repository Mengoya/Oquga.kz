'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, HistoryEventDto } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function HistorySection({ data, onChange }: Props) {
    const historyEvents = data.historyEvents || [];

    const addEvent = () => {
        onChange({
            historyEvents: [
                ...historyEvents,
                { id: null, eventYear: new Date().getFullYear(), eventDescription: '', sortOrder: historyEvents.length },
            ],
        });
    };

    const removeEvent = (index: number) => {
        onChange({
            historyEvents: historyEvents.filter((_, i) => i !== index),
        });
    };

    const updateEvent = (index: number, updates: Partial<HistoryEventDto>) => {
        onChange({
            historyEvents: historyEvents.map((e, i) => (i === index ? { ...e, ...updates } : e)),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">История</h3>
                    <p className="text-sm text-muted-foreground">
                        Ключевые события в истории университета
                    </p>
                </div>
                <Button onClick={addEvent} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить событие
                </Button>
            </div>

            {historyEvents.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">Нет событий истории</p>
                </div>
            )}

            <div className="space-y-4">
                {historyEvents.map((event, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Событие #{index + 1}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEvent(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label>Год</Label>
                            <Input
                                type="number"
                                value={event.eventYear}
                                onChange={(e) => updateEvent(index, { eventYear: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Label>Описание события</Label>
                            <Textarea
                                value={event.eventDescription || ''}
                                onChange={(e) => updateEvent(index, { eventDescription: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
