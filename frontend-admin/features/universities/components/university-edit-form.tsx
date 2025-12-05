'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUniversitySchema, UpdateUniversityValues, UniversityDetailResponse } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUniversity } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
    university: UniversityDetailResponse;
}

export function UniversityEditForm({ university }: Props) {
    const queryClient = useQueryClient();

    const form = useForm<UpdateUniversityValues>({
        resolver: zodResolver(UpdateUniversitySchema),
        defaultValues: {
            photoUrl: university.photoUrl || '',
            websiteUrl: university.websiteUrl || '',
            foundedYear: university.foundedYear,
            contactPhone: university.contactPhone || '',
            contactEmail: university.contactEmail || '',
            translations: {
                ru: {
                    name: university.translations.ru?.name || '',
                    city: university.translations.ru?.city || '',
                    shortDescription: university.translations.ru?.shortDescription || '',
                    description: university.translations.ru?.description || '',
                    goal: university.translations.ru?.goal || '',
                    address: university.translations.ru?.address || '',
                    historyText: university.translations.ru?.historyText || '',
                },
                kk: {
                    name: university.translations.kk?.name || '',
                    city: university.translations.kk?.city || '',
                    shortDescription: university.translations.kk?.shortDescription || '',
                    description: university.translations.kk?.description || '',
                    goal: university.translations.kk?.goal || '',
                    address: university.translations.kk?.address || '',
                    historyText: university.translations.kk?.historyText || '',
                },
                en: {
                    name: university.translations.en?.name || '',
                    city: university.translations.en?.city || '',
                    shortDescription: university.translations.en?.shortDescription || '',
                    description: university.translations.en?.description || '',
                    goal: university.translations.en?.goal || '',
                    address: university.translations.en?.address || '',
                    historyText: university.translations.en?.historyText || '',
                },
            },
        },
    });

    const watchedTranslations = form.watch('translations');

    const getLanguageStatus = (lang: 'ru' | 'kk' | 'en') => {
        const t = watchedTranslations[lang];
        if (!t) return { filled: 0, total: 7 };
        let filled = 0;
        if (t.name && t.name.trim()) filled++;
        if (t.city && t.city.trim()) filled++;
        if (t.shortDescription && t.shortDescription.trim()) filled++;
        if (t.description && t.description.trim()) filled++;
        if (t.goal && t.goal.trim()) filled++;
        if (t.address && t.address.trim()) filled++;
        if (t.historyText && t.historyText.trim()) filled++;
        return { filled, total: 7 };
    };

    const mutation = useMutation({
        mutationFn: (values: UpdateUniversityValues) =>
            updateUniversity(String(university.id), values),
        onSuccess: (updatedData) => {
            toast.success('Успешно', {
                description: 'Данные университета обновлены',
            });
            queryClient.invalidateQueries({ queryKey: ['universities'] });
            queryClient.setQueryData(['university', String(university.id)], updatedData);
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Не удалось обновить данные';
            toast.error('Ошибка', {
                description: message,
            });
        },
    });

    const onSubmit = (values: UpdateUniversityValues) => {
        mutation.mutate(values);
    };

    const languages = ['ru', 'kk', 'en'] as const;
    const languageLabels = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL фото</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/photo.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Веб-сайт</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="foundedYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Год основания</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                    <Input placeholder="+7 (xxx) xxx-xx-xx" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="info@university.kz" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                        <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`translations.${lang}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Название</FormLabel>
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
                                            <FormLabel>Город</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                name={`translations.${lang}.address`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Адрес</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>Описание</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.${lang}.goal`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Миссия / Цель</FormLabel>
                                        <FormControl>
                                            <Textarea rows={2} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`translations.${lang}.historyText`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>История</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </Form>
    );
}
