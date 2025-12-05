'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema, CreateUserValues } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, MOCK_UNIVERSITIES_LIST } from '../api';
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
import { useAuthStore } from '@/stores/use-auth-store';

interface Props {
    onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: Props) {
    const t = useTranslations('UsersPage');
    const tCommon = useTranslations('Common');
    const queryClient = useQueryClient();

    const { user: currentUser } = useAuthStore();

    const isSuperAdmin =
        !currentUser?.role ||
        (currentUser.role === 'admin' && !('universityId' in currentUser));
    const isGlobalAdmin = currentUser?.email === 'admin@datanub.kz';

    const form = useForm<CreateUserValues>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'viewer',
            universityId: isGlobalAdmin ? null : 'uni-1',
        },
    });

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success(tCommon('feedback.success'), {
                description: tCommon('feedback.created'),
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onSuccess();
        },
        onError: () => {
            toast.error(tCommon('feedback.error'), {
                description: tCommon('feedback.genericError'),
            });
        },
    });

    const onSubmit = (values: CreateUserValues) => {
        if (!isGlobalAdmin) {
            // values.universityId = currentUser.universityId;
        }
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
                            <FormLabel>{t('createModal.nameLabel')}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('createModal.emailLabel')}</FormLabel>
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
                            <FormLabel>
                                {t('createModal.passwordLabel')}
                            </FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('createModal.roleLabel')}
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            {t('roles.admin')}
                                        </SelectItem>
                                        <SelectItem value="manager">
                                            {t('roles.manager')}
                                        </SelectItem>
                                        <SelectItem value="viewer">
                                            {t('roles.viewer')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isGlobalAdmin && (
                        <FormField
                            control={form.control}
                            name="universityId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('createModal.universityLabel')}
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select University" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {MOCK_UNIVERSITIES_LIST.map(
                                                (uni) => (
                                                    <SelectItem
                                                        key={uni.id}
                                                        value={uni.id}
                                                    >
                                                        {uni.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

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
