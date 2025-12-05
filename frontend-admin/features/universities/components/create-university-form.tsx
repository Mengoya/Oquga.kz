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
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Check, Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
    onSuccess: () => void;
}

export function CreateUniversityForm({ onSuccess }: Props) {
    const t = useTranslations('UniversitiesPage.createModal');
    const tCommon = useTranslations('Common');
    const queryClient = useQueryClient();

    const form = useForm<CreateUniversityValues>({
        resolver: zodResolver(CreateUniversitySchema),
        defaultValues: {
            photoUrl: '',
            translations: {
                ru: { name: '', city: '', shortDescription: '', description: '' },
                kk: { name: '', city: '', shortDescription: '', description: '' },
                en: { name: '', city: '', shortDescription: '', description: '' },
            },
        },
    });

    const watchedTranslations = form.watch('translations');

    const getLanguageStatus = (lang: 'ru' | 'kk' | 'en') => {
        const t = watchedTranslations[lang];
        if (!t) return { filled: 0, total: 4 };
        let filled = 0;
        if (t.name && t.name.trim()) filled++;
        if (t.city && t.city.trim()) filled++;
        if (t.shortDescription && t.shortDescription.trim()) filled++;
        if (t.description && t.description.trim()) filled++;
        return { filled, total: 4 };
    };

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

    const languages = ['ru', 'kk', 'en'] as const;
    const languageLabels = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                URL фото
                                <span className="text-xs text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/photo.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Tabs defaultValue="ru" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {languages.map((lang) => {
                            const status = getLanguageStatus(lang);
                            const isComplete = status.filled === status.total;
                            return (
                                <TabsTrigger key={lang} value={lang} className="relative">
                                    <span>{languageLabels[lang]}</span>
                                    <Badge
                                        variant={isComplete ? 'default' : 'secondary'}
                                        className="ml-2 h-5 px-1.5 text-[10px]"
                                    >
                                        {isComplete ? (
                                            <Check className="h-3 w-3" />
                                        ) : (
                                            `${status.filled}/${status.total}`
                                        )}
                                    </Badge>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {languages.map((lang) => (
                        <TabsContent
                            key={lang}
                            value={lang}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name={`translations.${lang}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            {t('nameLabel')}
                                            <span className="text-xs text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel className="flex items-center gap-2">
                                            {t('cityLabel')}
                                            <span className="text-xs text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.${lang}.shortDescription`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Краткое описание</FormLabel>
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="rounded-md border p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                        Статус заполнения:
                    </p>
                    <div className="flex gap-4 mt-2">
                        {languages.map((lang) => {
                            const status = getLanguageStatus(lang);
                            const isComplete = status.filled === status.total;
                            return (
                                <div key={lang} className="flex items-center gap-1">
                                    {isComplete ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className={`text-sm ${isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {lang.toUpperCase()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {form.formState.errors.translations?.root && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.translations.root.message}
                    </p>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {tCommon('actions.create')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
