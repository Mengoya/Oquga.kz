'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const languages = ['ru', 'kk', 'en'] as const;
const languageLabels = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

export function DescriptionSection({ data, onChange }: Props) {
    const handleTranslationChange = (lang: string, field: string, value: string) => {
        onChange({
            translations: {
                ...data.translations,
                [lang]: {
                    ...data.translations[lang],
                    [field]: value,
                },
            },
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Описание</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Краткое и полное описание, миссия/цель, история университета
                </p>
            </div>

            <Tabs defaultValue="ru">
                <TabsList className="grid w-full grid-cols-3">
                    {languages.map((lang) => (
                        <TabsTrigger key={lang} value={lang}>
                            {languageLabels[lang]}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {languages.map((lang) => (
                    <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                        <div>
                            <Label>Краткое описание</Label>
                            <Input
                                value={data.translations[lang]?.shortDescription || ''}
                                onChange={(e) => handleTranslationChange(lang, 'shortDescription', e.target.value)}
                                placeholder="До 500 символов"
                                maxLength={500}
                            />
                        </div>
                        <div>
                            <Label>Полное описание</Label>
                            <Textarea
                                value={data.translations[lang]?.description || ''}
                                onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label>Миссия / Цель</Label>
                            <Textarea
                                value={data.translations[lang]?.goal || ''}
                                onChange={(e) => handleTranslationChange(lang, 'goal', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>История</Label>
                            <Textarea
                                value={data.translations[lang]?.historyText || ''}
                                onChange={(e) => handleTranslationChange(lang, 'historyText', e.target.value)}
                                rows={4}
                            />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
