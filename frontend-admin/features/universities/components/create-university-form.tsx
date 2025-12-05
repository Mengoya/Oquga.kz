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
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
            name: '',
            city: '',
        },
    });

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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('nameLabel')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('cityLabel')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
