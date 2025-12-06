'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUniversityValues } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const languages = ['ru', 'kk', 'en'] as const;

export function DescriptionSection({ data, onChange }: Props) {
    const t = useTranslations('UniversityEdit.description');
    const tLangs = useTranslations('UniversityEdit.languages');

    const handleTranslationChange = (
        lang: string,
        field: string,
        value: string,
    ) => {
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
                <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {t('subtitle')}
                </p>
            </div>

            <Tabs defaultValue="ru">
                <TabsList className="grid w-full grid-cols-3">
                    {languages.map((lang) => (
                        <TabsTrigger key={lang} value={lang}>
                            {tLangs(lang)}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {languages.map((lang) => (
                    <TabsContent
                        key={lang}
                        value={lang}
                        className="space-y-4 mt-4"
                    >
                        <div>
                            <Label>{t('shortDescription')}</Label>
                            <Input
                                value={
                                    data.translations[lang]?.shortDescription ||
                                    ''
                                }
                                onChange={(e) =>
                                    handleTranslationChange(
                                        lang,
                                        'shortDescription',
                                        e.target.value,
                                    )
                                }
                                placeholder={t('shortDescriptionHint')}
                                maxLength={500}
                            />
                        </div>
                        <div>
                            <Label>{t('fullDescription')}</Label>
                            <Textarea
                                value={
                                    data.translations[lang]?.description || ''
                                }
                                onChange={(e) =>
                                    handleTranslationChange(
                                        lang,
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label>{t('goal')}</Label>
                            <Textarea
                                value={data.translations[lang]?.goal || ''}
                                onChange={(e) =>
                                    handleTranslationChange(
                                        lang,
                                        'goal',
                                        e.target.value,
                                    )
                                }
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>{t('history')}</Label>
                            <Textarea
                                value={
                                    data.translations[lang]?.historyText || ''
                                }
                                onChange={(e) =>
                                    handleTranslationChange(
                                        lang,
                                        'historyText',
                                        e.target.value,
                                    )
                                }
                                rows={4}
                            />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
