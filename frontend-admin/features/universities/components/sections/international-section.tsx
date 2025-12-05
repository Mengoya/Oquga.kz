'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues, InternationalSectionDto, InternationalItemDto } from '../../types';
import { Plus, Trash2, ChevronDown, ChevronRight, Globe, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const languages = ['ru', 'kk', 'en'] as const;
const languageLabels = { ru: 'RU', kk: 'KK', en: 'EN' };

export function InternationalSection({ data, onChange }: Props) {
    const sections = data.internationalSections || [];
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const addSection = () => {
        const newSection: InternationalSectionDto = {
            id: null,
            externalUrl: null,
            sortOrder: sections.length,
            isActive: true,
            translations: {
                ru: { title: '', description: null },
                kk: { title: '', description: null },
                en: { title: '', description: null },
            },
            items: [],
        };
        onChange({ internationalSections: [...sections, newSection] });
    };

    const removeSection = (index: number) => {
        onChange({ internationalSections: sections.filter((_, i) => i !== index) });
    };

    const updateSection = (index: number, updates: Partial<InternationalSectionDto>) => {
        onChange({
            internationalSections: sections.map((s, i) => (i === index ? { ...s, ...updates } : s)),
        });
    };

    const updateSectionTranslation = (sectionIndex: number, lang: string, field: string, value: string) => {
        const section = sections[sectionIndex];
        updateSection(sectionIndex, {
            translations: {
                ...section.translations,
                [lang]: {
                    ...section.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    const addItem = (sectionIndex: number) => {
        const section = sections[sectionIndex];
        const newItem: InternationalItemDto = {
            id: null,
            externalUrl: null,
            sortOrder: section.items.length,
            isActive: true,
            translations: {
                ru: { title: '', description: null },
                kk: { title: '', description: null },
                en: { title: '', description: null },
            },
        };
        updateSection(sectionIndex, { items: [...section.items, newItem] });
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        const section = sections[sectionIndex];
        updateSection(sectionIndex, {
            items: section.items.filter((_, i) => i !== itemIndex),
        });
    };

    const updateItem = (sectionIndex: number, itemIndex: number, updates: Partial<InternationalItemDto>) => {
        const section = sections[sectionIndex];
        updateSection(sectionIndex, {
            items: section.items.map((item, i) => (i === itemIndex ? { ...item, ...updates } : item)),
        });
    };

    const updateItemTranslation = (sectionIndex: number, itemIndex: number, lang: string, field: string, value: string) => {
        const section = sections[sectionIndex];
        const item = section.items[itemIndex];
        updateItem(sectionIndex, itemIndex, {
            translations: {
                ...item.translations,
                [lang]: {
                    ...item.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Международное сотрудничество</h3>
                    <p className="text-sm text-muted-foreground">
                        Секции международных программ и партнерств
                    </p>
                </div>
                <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить секцию
                </Button>
            </div>

            {sections.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <Globe className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Нет секций международного сотрудничества</p>
                </div>
            )}

            <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)}
                        >
                            <div className="flex items-center gap-2">
                                {expandedSection === sectionIndex ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {section.translations.ru?.title || `Секция #${sectionIndex + 1}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({section.items.length} элем.)
                                </span>
                                {!section.isActive && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        Неактивна
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSection(sectionIndex);
                                }}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {expandedSection === sectionIndex && (
                            <div className="p-4 border-t space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Внешняя ссылка</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={section.externalUrl || ''}
                                                onChange={(e) => updateSection(sectionIndex, { externalUrl: e.target.value || null })}
                                                placeholder="https://..."
                                            />
                                            {section.externalUrl && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={section.externalUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`active-section-${sectionIndex}`}
                                                checked={section.isActive}
                                                onChange={(e) => updateSection(sectionIndex, { isActive: e.target.checked })}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor={`active-section-${sectionIndex}`}>Активна</Label>
                                        </div>
                                        <div>
                                            <Label>Порядок</Label>
                                            <Input
                                                type="number"
                                                value={section.sortOrder}
                                                onChange={(e) => updateSection(sectionIndex, { sortOrder: Number(e.target.value) })}
                                                className="w-20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Tabs defaultValue="ru">
                                    <TabsList>
                                        {languages.map((lang) => (
                                            <TabsTrigger key={lang} value={lang}>
                                                {languageLabels[lang]}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {languages.map((lang) => (
                                        <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                                            <div>
                                                <Label>Заголовок</Label>
                                                <Input
                                                    value={section.translations[lang]?.title || ''}
                                                    onChange={(e) => updateSectionTranslation(sectionIndex, lang, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Описание</Label>
                                                <Textarea
                                                    value={section.translations[lang]?.description || ''}
                                                    onChange={(e) => updateSectionTranslation(sectionIndex, lang, 'description', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium">Элементы секции</h4>
                                        <Button onClick={() => addItem(sectionIndex)} size="sm" variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Добавить элемент
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {section.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="border rounded-lg p-4 bg-muted/30 space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <span className="text-sm font-medium">
                                                        Элемент #{itemIndex + 1}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive"
                                                        onClick={() => removeItem(sectionIndex, itemIndex)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-xs">Внешняя ссылка</Label>
                                                        <Input
                                                            className="h-8 text-sm"
                                                            value={item.externalUrl || ''}
                                                            onChange={(e) => updateItem(sectionIndex, itemIndex, { externalUrl: e.target.value || null })}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                    <div className="flex items-end gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`active-item-${sectionIndex}-${itemIndex}`}
                                                                checked={item.isActive}
                                                                onChange={(e) => updateItem(sectionIndex, itemIndex, { isActive: e.target.checked })}
                                                                className="h-4 w-4"
                                                            />
                                                            <Label htmlFor={`active-item-${sectionIndex}-${itemIndex}`} className="text-xs">Активен</Label>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs">Порядок</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8 text-sm w-16"
                                                                value={item.sortOrder}
                                                                onChange={(e) => updateItem(sectionIndex, itemIndex, { sortOrder: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Tabs defaultValue="ru">
                                                    <TabsList className="h-8">
                                                        {languages.map((lang) => (
                                                            <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1">
                                                                {languageLabels[lang]}
                                                            </TabsTrigger>
                                                        ))}
                                                    </TabsList>
                                                    {languages.map((lang) => (
                                                        <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
                                                            <div>
                                                                <Label className="text-xs">Заголовок</Label>
                                                                <Input
                                                                    className="h-8 text-sm"
                                                                    value={item.translations[lang]?.title || ''}
                                                                    onChange={(e) => updateItemTranslation(sectionIndex, itemIndex, lang, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Описание</Label>
                                                                <Textarea
                                                                    className="text-sm"
                                                                    value={item.translations[lang]?.description || ''}
                                                                    onChange={(e) => updateItemTranslation(sectionIndex, itemIndex, lang, 'description', e.target.value)}
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </TabsContent>
                                                    ))}
                                                </Tabs>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
