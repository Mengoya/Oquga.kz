'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, TuitionDiscountDto } from '../../types';
import { Plus, Trash2, Wallet } from 'lucide-react';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

export function TuitionSection({ data, onChange }: Props) {
    const tuitionDiscounts = data.tuitionDiscounts || [];

    const addDiscount = () => {
        onChange({
            tuitionDiscounts: [
                ...tuitionDiscounts,
                {
                    id: null,
                    categoryName: '',
                    pricePerYear: null,
                    scholarshipInfo: null,
                    sortOrder: tuitionDiscounts.length,
                },
            ],
        });
    };

    const removeDiscount = (index: number) => {
        onChange({
            tuitionDiscounts: tuitionDiscounts.filter((_, i) => i !== index),
        });
    };

    const updateDiscount = (index: number, updates: Partial<TuitionDiscountDto>) => {
        onChange({
            tuitionDiscounts: tuitionDiscounts.map((d, i) => (i === index ? { ...d, ...updates } : d)),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Стоимость обучения</h3>
                    <p className="text-sm text-muted-foreground">
                        Категории оплаты, цены и информация о стипендиях
                    </p>
                </div>
                <Button onClick={addDiscount} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить категорию
                </Button>
            </div>

            {tuitionDiscounts.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <Wallet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Нет категорий оплаты</p>
                </div>
            )}

            <div className="space-y-4">
                {tuitionDiscounts.map((discount, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                Категория #{index + 1}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDiscount(index)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div>
                            <Label>Название категории</Label>
                            <Input
                                value={discount.categoryName}
                                onChange={(e) => updateDiscount(index, { categoryName: e.target.value })}
                                placeholder="Например: Бакалавриат (очное)"
                            />
                        </div>
                        <div>
                            <Label>Стоимость в год (тенге)</Label>
                            <Input
                                type="number"
                                value={discount.pricePerYear || ''}
                                onChange={(e) => updateDiscount(index, { pricePerYear: e.target.value ? Number(e.target.value) : null })}
                                placeholder="1500000"
                            />
                        </div>
                        <div>
                            <Label>Информация о стипендиях и скидках</Label>
                            <Textarea
                                value={discount.scholarshipInfo || ''}
                                onChange={(e) => updateDiscount(index, { scholarshipInfo: e.target.value || null })}
                                rows={3}
                                placeholder="Скидки для отличников, гранты..."
                            />
                        </div>
                        <div>
                            <Label>Порядок сортировки</Label>
                            <Input
                                type="number"
                                value={discount.sortOrder}
                                onChange={(e) => updateDiscount(index, { sortOrder: Number(e.target.value) })}
                                className="w-24"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
