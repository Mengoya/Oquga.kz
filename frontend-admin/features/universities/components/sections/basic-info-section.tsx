'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateUniversityValues } from '../../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhotoUpload } from '../photo-upload';
import { useTranslations } from 'next-intl';

interface Props {
    universityId: string;
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const LANGUAGES = ['ru', 'kk', 'en'] as const;
const LANGUAGE_LABELS = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

export function BasicInfoSection({ universityId, data, onChange }: Props) {
    const t = useTranslations('UniversityEdit.basicInfo');
    const tPhoto = useTranslations('UniversityEdit.photo');
    const tLangs = useTranslations('UniversityEdit.languages');

    const handleChange = (
        field: keyof UpdateUniversityValues,
        value: unknown,
    ) => {
        onChange({ [field]: value });
    };

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

    const handlePhotoChange = (photoUrl: string | null) => {
        onChange({ photoUrl: photoUrl || '' });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {t('subtitle')}
                </p>
            </div>

            <div>
                <Label className="mb-2 block">{tPhoto('title')}</Label>
                <PhotoUpload
                    universityId={universityId}
                    currentPhotoUrl={data.photoUrl || null}
                    onPhotoChange={handlePhotoChange}
                />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="websiteUrl">{t('website')}</Label>
                        <Input
                            id="websiteUrl"
                            value={data.websiteUrl || ''}
                            onChange={(e) =>
                                handleChange('websiteUrl', e.target.value)
                            }
                            placeholder="https://university.kz"
                            type="url"
                        />
                    </div>
                    <div>
                        <Label htmlFor="virtualTourUrl">
                            {t('virtualTour')}
                        </Label>
                        <Input
                            id="virtualTourUrl"
                            value={data.virtualTourUrl || ''}
                            onChange={(e) =>
                                handleChange('virtualTourUrl', e.target.value)
                            }
                            placeholder="https://tour.university.kz"
                            type="url"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="foundedYear">
                                {t('foundedYear')}
                            </Label>
                            <Input
                                id="foundedYear"
                                type="number"
                                min={1800}
                                max={new Date().getFullYear()}
                                value={data.foundedYear || ''}
                                onChange={(e) =>
                                    handleChange(
                                        'foundedYear',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            />
                        </div>
                        <div />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="contactPhone">{t('phone')}</Label>
                        <Input
                            id="contactPhone"
                            value={data.contactPhone || ''}
                            onChange={(e) =>
                                handleChange('contactPhone', e.target.value)
                            }
                            placeholder="+7 (xxx) xxx-xx-xx"
                            type="tel"
                        />
                    </div>
                    <div>
                        <Label htmlFor="contactEmail">{t('email')}</Label>
                        <Input
                            id="contactEmail"
                            type="email"
                            value={data.contactEmail || ''}
                            onChange={(e) =>
                                handleChange('contactEmail', e.target.value)
                            }
                            placeholder="info@university.kz"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h4 className="font-medium mb-4">{t('nameAndCity')}</h4>
                <Tabs defaultValue="ru">
                    <TabsList className="grid w-full grid-cols-3">
                        {LANGUAGES.map((lang) => (
                            <TabsTrigger key={lang} value={lang}>
                                {tLangs(lang)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {LANGUAGES.map((lang) => (
                        <TabsContent
                            key={lang}
                            value={lang}
                            className="space-y-4 mt-4"
                        >
                            <div>
                                <Label>{t('name')}</Label>
                                <Input
                                    value={data.translations[lang]?.name || ''}
                                    onChange={(e) =>
                                        handleTranslationChange(
                                            lang,
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t('city')}</Label>
                                <Input
                                    value={data.translations[lang]?.city || ''}
                                    onChange={(e) =>
                                        handleTranslationChange(
                                            lang,
                                            'city',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <Label>{t('address')}</Label>
                                <Input
                                    value={
                                        data.translations[lang]?.address || ''
                                    }
                                    onChange={(e) =>
                                        handleTranslationChange(
                                            lang,
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
