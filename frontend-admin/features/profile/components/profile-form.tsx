'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema, UpdateProfileValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/use-auth-store';

export function ProfileForm() {
    const t = useTranslations('ProfilePage');
    const tCommon = useTranslations('Common');
    const { user, setAuth, accessToken } = useAuthStore();

    const displayName = user ? `${user.firstName} ${user.lastName}` : '';

    const form = useForm<UpdateProfileValues>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: displayName,
        },
    });

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            toast.success(tCommon('feedback.success'), {
                description: t('feedback.updateSuccess'),
            });

            if (user && accessToken) {
                const [firstName, ...lastNameParts] = data.user.name.split(' ');
                setAuth(
                    {
                        ...user,
                        firstName: firstName || user.firstName,
                        lastName: lastNameParts.join(' ') || user.lastName,
                    },
                    accessToken,
                );
            }
        },
        onError: () => {
            toast.error(tCommon('feedback.error'), {
                description: tCommon('feedback.genericError'),
            });
        },
    });

    const onSubmit = (values: UpdateProfileValues) => {
        mutation.mutate(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('labels.name')}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t('placeholders.name')}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>{t('labels.email')}</FormLabel>
                    <FormControl>
                        <Input
                            value={user?.email || ''}
                            disabled
                            className="bg-muted"
                        />
                    </FormControl>
                    <FormDescription>{t('emailDescription')}</FormDescription>
                </FormItem>

                <FormItem>
                    <FormLabel>{t('labels.role')}</FormLabel>
                    <FormControl>
                        <Input
                            value={user?.role || ''}
                            disabled
                            className="bg-muted"
                        />
                    </FormControl>
                    <FormDescription>{t('roleDescription')}</FormDescription>
                </FormItem>

                <div className="flex justify-start">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {tCommon('actions.save')}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
