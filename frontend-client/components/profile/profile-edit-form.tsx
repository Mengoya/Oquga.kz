'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, User as UserIcon, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

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
import {
    ProfileUpdateSchema,
    ProfileUpdateValues,
} from '@/features/profile/types';
import { updateProfile } from '@/features/profile/api';
import { useAuthStore } from '@/stores/use-auth-store';
import { useRouter } from 'next/navigation';

export function ProfileEditForm() {
    const { user, setAuth, accessToken } = useAuthStore();
    const router = useRouter();

    const form = useForm<ProfileUpdateValues>({
        resolver: zodResolver(ProfileUpdateSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const onSubmit = async (values: ProfileUpdateValues) => {
        try {
            const updatedUser = await updateProfile(values);

            if (accessToken) {
                setAuth(updatedUser, accessToken);
            }

            toast.success('Профиль успешно обновлен');
            router.refresh();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Не удалось обновить профиль',
            );
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Имя</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" {...field} />
                                    </div>
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
                                <FormLabel>Фамилия</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        Email
                        <Lock className="h-3 w-3 text-muted-foreground" />
                    </FormLabel>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 bg-muted/50 cursor-not-allowed"
                            value={user?.email || ''}
                            disabled
                            readOnly
                            aria-readonly="true"
                        />
                    </div>
                    <FormDescription>
                        Email нельзя изменить. Он используется для входа в
                        систему.
                    </FormDescription>
                </FormItem>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </Form>
    );
}
