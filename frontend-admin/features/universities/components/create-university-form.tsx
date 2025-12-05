'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUniversitySchema, CreateUniversityValues } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUniversity } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Copy,
    Image as ImageIcon,
    Languages,
    Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface Props {
    onSuccess: () => void;
}

const LANGUAGES = ['ru', 'kk', 'en'] as const;
type Language = typeof LANGUAGES[number];

const LANGUAGE_LABELS: Record<Language, string> = {
    ru: 'Русский',
    kk: 'Қазақша',
    en: 'English'
};

export function CreateUniversityForm({ onSuccess }: Props) {
    const t = useTranslations('UniversitiesPage.createModal');
    const tCommon = useTranslations('Common');
    const queryClient = useQueryClient();

    const form = useForm<CreateUniversityValues>({
        resolver: zodResolver(CreateUniversitySchema),
        mode: 'onChange',
        defaultValues: {
            photoUrl: '',
            translations: {
                ru: { name: '', city: '', shortDescription: '', description: '' },
                kk: { name: '', city: '', shortDescription: '', description: '' },
                en: { name: '', city: '', shortDescription: '', description: '' },
            },
        },
    });

    const watchedValues = form.watch();
    const { errors } = form.formState;

    const languageStatus = useMemo(() => {
        return LANGUAGES.map((lang) => {
            const data = watchedValues.translations?.[lang];
            const hasRequiredData = !!data?.name?.trim() && !!data?.city?.trim();
            const isFullyFilled = hasRequiredData && !!data?.shortDescription?.trim();

            const hasErrors = !!errors.translations?.[lang];

            return {
                lang,
                hasRequiredData,
                isFullyFilled,
                hasErrors
            };
        });
    }, [watchedValues, errors]);

    const totalProgress = useMemo(() => {
        let score = 0;
        if (watchedValues.photoUrl) score += 10;
        languageStatus.forEach(status => {
            if (status.hasRequiredData) score += 20;
            if (status.isFullyFilled) score += 10;
        });
        return Math.min(score, 100);
    }, [watchedValues.photoUrl, languageStatus]);

    const mutation = useMutation({
        mutationFn: createUniversity,
        onSuccess: () => {
            toast.success(tCommon('feedback.success'), {
                description: tCommon('feedback.created'),
            });
            queryClient.invalidateQueries({ queryKey: ['universities'] });
            onSuccess();
        },
        onError: () => {
            toast.error(tCommon('feedback.error'), {
                description: tCommon('feedback.genericError'),
            });
        },
    });

    const onSubmit = (values: CreateUniversityValues) => {
        mutation.mutate(values);
    };

    const copyToOtherLanguages = (sourceLang: Language) => {
        const sourceData = form.getValues(`translations.${sourceLang}`);
        if (!sourceData.name && !sourceData.city) {
            toast.warning('Нет данных для копирования');
            return;
        }

        LANGUAGES.forEach((targetLang) => {
            if (targetLang === sourceLang) return;

            const currentName = form.getValues(`translations.${targetLang}.name`);
            const currentCity = form.getValues(`translations.${targetLang}.city`);

            if (!currentName) {
                form.setValue(`translations.${targetLang}.name`, sourceData.name || '', { shouldValidate: true });
            }
            if (!currentCity) {
                form.setValue(`translations.${targetLang}.city`, sourceData.city || '', { shouldValidate: true });
            }
        });
        toast.success(`Данные из ${LANGUAGE_LABELS[sourceLang]} скопированы в пустые поля`);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Заполнение формы</span>
                        <span className="font-medium text-foreground">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className={cn("h-2", {
                        "bg-green-100 [&>div]:bg-green-600": totalProgress === 100,
                    })} />
                </div>

                <Card className="border-dashed shadow-none bg-muted/20">
                    <CardContent className="pt-6">
                        <FormField
                            control={form.control}
                            name="photoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-primary" />
                                        Медиа контент
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex gap-3">
                                            <Input
                                                placeholder="https://example.com/logo.png"
                                                {...field}
                                                className="bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Ссылка на логотип или фото университета (обязательно)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Languages className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Локализация данных</h3>
                    </div>

                    <Tabs defaultValue="ru" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted">
                            {languageStatus.map(({ lang, hasRequiredData, hasErrors }) => (
                                <TabsTrigger
                                    key={lang}
                                    value={lang}
                                    className={cn(
                                        "flex flex-col gap-1 py-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm",
                                        hasErrors && "data-[state=active]:text-destructive text-destructive/80",
                                        !hasErrors && hasRequiredData && "text-green-600 data-[state=active]:text-green-700"
                                    )}
                                >
                                    <span className="font-medium">{LANGUAGE_LABELS[lang]}</span>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        {hasErrors ? (
                                            <Badge variant="destructive" className="h-4 px-1 text-[10px]">Ошибка</Badge>
                                        ) : hasRequiredData ? (
                                            <Badge variant="outline" className="h-4 px-1 text-[10px] border-green-500 text-green-600 bg-green-50">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Готово
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="h-4 px-1 text-[10px]">Пусто</Badge>
                                        )}
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {LANGUAGES.map((lang) => (
                            <TabsContent key={lang} value={lang} className="space-y-4 mt-4 animate-in fade-in-50 slide-in-from-top-2">
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-muted-foreground hover:text-primary"
                                        onClick={() => copyToOtherLanguages(lang)}
                                        title="Копировать название и город в другие языки (если там пусто)"
                                    >
                                        <Copy className="h-3 w-3 mr-2" />
                                        Копировать в другие языки
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`translations.${lang}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('nameLabel')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={`Название на ${LANGUAGE_LABELS[lang]}`} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`translations.${lang}.city`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('cityLabel')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={`Город на ${LANGUAGE_LABELS[lang]}`} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`translations.${lang}.shortDescription`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Краткое описание (SEO)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="До 500 символов" maxLength={500} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`translations.${lang}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('descriptionLabel')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Подробное описание" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    {languageStatus.some(s => !s.hasRequiredData) && (
                        <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
                            <Info className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>
                                Заполнить название и города для всех языков:
                                <span className="font-semibold ml-1">
                                    {languageStatus.filter(s => !s.hasRequiredData).map(s => LANGUAGE_LABELS[s.lang]).join(', ')}
                                </span>
                            </p>
                        </div>
                    )}

                    {form.formState.errors.root && (
                        <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                            <AlertCircle className="h-4 w-4" />
                            {form.formState.errors.root.message}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <Button variant="outline" type="button" onClick={() => onSuccess()}>
                        {tCommon('actions.cancel')}
                    </Button>
                    <Button type="submit" disabled={mutation.isPending} className="min-w-[140px]">
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Создание...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {tCommon('actions.create')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}