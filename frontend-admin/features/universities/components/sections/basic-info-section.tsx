'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateUniversityValues } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const languages = ['ru', 'kk', 'en'] as const;
const languageLabels = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

export function BasicInfoSection({ data, onChange }: Props) {
    const handleChange = (field: keyof UpdateUniversityValues, value: any) => {
        onChange({ [field]: value });
    };

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
                <h3 className="text-lg font-semibold mb-4">Базовая информация</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Основные данные университета: контакты, ссылки, год основания
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="photoUrl">URL фото</Label>
                    <Input
                        id="photoUrl"
                        value={data.photoUrl || ''}
                        onChange={(e) => handleChange('photoUrl', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="websiteUrl">Веб-сайт</Label>
                        <Input
                            id="websiteUrl"
                            value={data.websiteUrl || ''}
                            onChange={(e) => handleChange('websiteUrl', e.target.value)}
                            placeholder="https://university.kz"
                        />
                    </div>
                    <div>
                        <Label htmlFor="foundedYear">Год основания</Label>
                        <Input
                            id="foundedYear"
                            type="number"
                            value={data.foundedYear || ''}
                            onChange={(e) => handleChange('foundedYear', e.target.value ? Number(e.target.value) : null)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contactPhone">Телефон</Label>
                        <Input
                            id="contactPhone"
                            value={data.contactPhone || ''}
                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                            placeholder="+7 (xxx) xxx-xx-xx"
                        />
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                            id="contactEmail"
                            type="email"
                            value={data.contactEmail || ''}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            placeholder="info@university.kz"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Название и город</h4>
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
                                <Label>Название</Label>
                                <Input
                                    value={data.translations[lang]?.name || ''}
                                    onChange={(e) => handleTranslationChange(lang, 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Город</Label>
                                <Input
                                    value={data.translations[lang]?.city || ''}
                                    onChange={(e) => handleTranslationChange(lang, 'city', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Адрес</Label>
                                <Input
                                    value={data.translations[lang]?.address || ''}
                                    onChange={(e) => handleTranslationChange(lang, 'address', e.target.value)}
                                />
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
