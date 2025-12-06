import { Metadata } from 'next';
import { UserCog, Shield, History, GraduationCap } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { ProfileEditForm } from '@/components/profile/profile-edit-form';
import { SecurityForm } from '@/components/profile/security-form';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from '@/components/profile/profile-header';
import { Link } from '@/i18n/navigation';

interface ProfilePageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: ProfilePageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'profile' });

    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('profile');

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <ProfileHeader />

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    {t('status')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {t('role')}
                                    </span>
                                    <Badge variant="secondary">
                                        {t('student')}
                                    </Badge>
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
                                    {t('generalTab')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="gap-2 py-2 px-4"
                                >
                                    <Shield className="h-4 w-4" />
                                    {t('securityTab')}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="activity"
                                    className="gap-2 py-2 px-4"
                                >
                                    <History className="h-4 w-4" />
                                    {t('historyTab')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent
                                value="general"
                                className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {t('personalInfo')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('personalInfoDesc')}
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
                                            {t('passwordTitle')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('passwordDesc')}
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
                                        <CardTitle>
                                            {t('historyTitle')}
                                        </CardTitle>
                                        <CardDescription>
                                            {t('historyDesc')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4 text-center py-10">
                                            <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                                                <GraduationCap className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-lg">
                                                {t('historyEmpty')}
                                            </h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto">
                                                {t('historyEmptyDesc')}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-fit mx-auto mt-2"
                                                asChild
                                            >
                                                <Link href="/universities">
                                                    {t('goToCatalog')}
                                                </Link>
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
