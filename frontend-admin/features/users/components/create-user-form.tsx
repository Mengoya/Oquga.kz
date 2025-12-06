'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUniversityAdminSchema, CreateUniversityAdminValues } from '../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUniversityAdmin } from '../api';
import { fetchUniversities } from '@/features/universities/api';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Props {
    onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: Props) {
    const t = useTranslations('UsersPage.createModal');
    const tCommon = useTranslations('Common');
    const queryClient = useQueryClient();

    const { data: universitiesData, isLoading: universitiesLoading } = useQuery({
        queryKey: ['universities-list'],
        queryFn: () => fetchUniversities({ page: 1, limit: 100 }),
    });

    const form = useForm<CreateUniversityAdminValues>({
        resolver: zodResolver(CreateUniversityAdminSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            universityId: undefined,
        },
    });

    const mutation = useMutation({
        mutationFn: createUniversityAdmin,
        onSuccess: () => {
            toast.success(tCommon('feedback.success'), {
                description: t('success'),
            });
            queryClient.invalidateQueries({ queryKey: ['university-admins'] });
            onSuccess();
        },
        onError: (error: any) => {
            const message = error?.response?.data || tCommon('feedback.genericError');
            toast.error(tCommon('feedback.error'), {
                description: message,
            });
        },
    });

    const onSubmit = (values: CreateUniversityAdminValues) => {
        mutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('firstNameLabel')}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('lastNameLabel')}</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('emailLabel')}</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('passwordLabel')}</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="universityId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('universityLabel')}</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={field.value?.toString()}
                                disabled={universitiesLoading}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('selectUniversity')} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {universitiesData?.data.map((uni) => (
                                        <SelectItem key={uni.id} value={uni.id}>
                                            {uni.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
