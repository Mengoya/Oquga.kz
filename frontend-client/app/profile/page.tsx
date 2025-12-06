import { Metadata } from 'next';
import { UserCog, Shield, History, GraduationCap } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { SecurityForm } from '@/components/profile/security-form';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Мой профиль',
    description: 'Управление личными данными и настройками безопасности.',
};

import { ProfileHeader } from '@/components/profile/profile-header';

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Настройки профиля
                    </h1>
                    <p className="text-muted-foreground">
                        Управляйте вашей личной информацией, безопасностью и
                        предпочтениями.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <ProfileHeader />

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Ваш статус
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Роль
                                    </span>
                                    <Badge variant="secondary">Студент</Badge>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Прогресс заполнения
                                    </span>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-full w-[70%] rounded-full bg-primary" />
                                    </div>
                                    <span className="text-xs text-right text-muted-foreground">
                                        70%
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        <Tabs
                            defaultValue="general"
                            className="w-full space-y-6"
                        >
                            <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto">
                                <TabsTrigger
                                    value="general"
                                    className="gap-2 py-2 px-4"
                                >
                                    <UserCog className="h-4 w-4" />
                                    Общие данные
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="gap-2 py-2 px-4"
                                >
                                    <Shield className="h-4 w-4" />
                                    Безопасность
                                </TabsTrigger>
                                <TabsTrigger
                                    value="activity"
                                    className="gap-2 py-2 px-4"
                                >
                                    <History className="h-4 w-4" />
                                    История
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="general"
                                className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Личная информация</CardTitle>
                                        <CardDescription>
                                            Обновите ваше имя и контактные
                                            данные. Изменения вступают в силу
                                            мгновенно.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ProfileEditForm />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="security"
                                className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Пароль и Аутентификация
                                        </CardTitle>
                                        <CardDescription>
                                            Рекомендуем использовать сложный
                                            пароль для защиты вашего аккаунта.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SecurityForm />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="activity"
                                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>История действий</CardTitle>
                                        <CardDescription>
                                            Последние просмотры вузов и заявки.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4 text-center py-10">
                                            <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                                                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-lg">
                                                История пуста
                                            </h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto">
                                                Вы пока не подавали заявок и не
                                                сохраняли университеты в
                                                избранное.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-fit mx-auto mt-2"
                                                asChild
                                            >
                                                <a href="/universities">
                                                    Перейти в каталог
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
