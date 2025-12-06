import React from 'react';
import { Metadata } from 'next';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    GraduationCap,
    School,
    ArrowRight,
    AlertCircle,
    ExternalLink,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdmissionsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: AdmissionsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'admissions' });

    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function AdmissionsPage({ params }: AdmissionsPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('admissions');

    const educationLevels = [
        {
            id: 'bachelor',
            title: t('bachelor'),
            icon: GraduationCap,
            description: t('bachelorDesc'),
            steps: [
                {
                    id: 'step-1',
                    title: t('steps.bachelor.step1Title'),
                    description: t('steps.bachelor.step1Desc'),
                },
                {
                    id: 'step-2',
                    title: t('steps.bachelor.step2Title'),
                    description: t('steps.bachelor.step2Desc'),
                    dates: [
                        {
                            label: t('steps.bachelor.date1Label'),
                            value: t('steps.bachelor.date1Value'),
                        },
                        {
                            label: t('steps.bachelor.date2Label'),
                            value: t('steps.bachelor.date2Value'),
                        },
                        {
                            label: t('steps.bachelor.date3Label'),
                            value: t('steps.bachelor.date3Value'),
                        },
                        {
                            label: t('steps.bachelor.date4Label'),
                            value: t('steps.bachelor.date4Value'),
                        },
                    ],
                    isWarning: true,
                },
                {
                    id: 'step-3',
                    title: t('steps.bachelor.step3Title'),
                    description: t('steps.bachelor.step3Desc'),
                },
                {
                    id: 'step-4',
                    title: t('steps.bachelor.step4Title'),
                    description: t('steps.bachelor.step4Desc'),
                    details: [
                        t('steps.bachelor.doc1'),
                        t('steps.bachelor.doc2'),
                        t('steps.bachelor.doc3'),
                        t('steps.bachelor.doc4'),
                        t('steps.bachelor.doc5'),
                        t('steps.bachelor.doc6'),
                    ],
                },
                {
                    id: 'step-5',
                    title: t('steps.bachelor.step5Title'),
                    description: t('steps.bachelor.step5Desc'),
                },
            ],
        },
        {
            id: 'master',
            title: t('master'),
            icon: BookOpen,
            description: t('masterDesc'),
            steps: [
                {
                    id: 'm-step-1',
                    title: t('steps.master.step1Title'),
                    description: t('steps.master.step1Desc'),
                },
                {
                    id: 'm-step-2',
                    title: t('steps.master.step2Title'),
                    description: t('steps.master.step2Desc'),
                },
                {
                    id: 'm-step-3',
                    title: t('steps.master.step3Title'),
                    description: t('steps.master.step3Desc'),
                    dates: [
                        {
                            label: t('steps.master.date1Label'),
                            value: t('steps.master.date1Value'),
                        },
                        {
                            label: t('steps.master.date2Label'),
                            value: t('steps.master.date2Value'),
                        },
                        {
                            label: t('steps.master.date3Label'),
                            value: t('steps.master.date3Value'),
                        },
                        {
                            label: t('steps.master.date4Label'),
                            value: t('steps.master.date4Value'),
                        },
                    ],
                    isWarning: true,
                },
                {
                    id: 'm-step-4',
                    title: t('steps.master.step4Title'),
                    description: t('steps.master.step4Desc'),
                },
                {
                    id: 'm-step-5',
                    title: t('steps.master.step5Title'),
                    description: t('steps.master.step5Desc'),
                },
            ],
        },
        {
            id: 'phd',
            title: t('phd'),
            icon: School,
            description: t('phdDesc'),
            steps: [
                {
                    id: 'p-step-1',
                    title: t('steps.phd.step1Title'),
                    description: t('steps.phd.step1Desc'),
                },
                {
                    id: 'p-step-2',
                    title: t('steps.phd.step2Title'),
                    description: t('steps.phd.step2Desc'),
                },
                {
                    id: 'p-step-3',
                    title: t('steps.phd.step3Title'),
                    description: t('steps.phd.step3Desc'),
                    dates: [
                        {
                            label: t('steps.phd.date1Label'),
                            value: t('steps.phd.date1Value'),
                        },
                        {
                            label: t('steps.phd.date2Label'),
                            value: t('steps.phd.date2Value'),
                        },
                        {
                            label: t('steps.phd.date3Label'),
                            value: t('steps.phd.date3Value'),
                        },
                    ],
                    isWarning: true,
                },
                {
                    id: 'p-step-4',
                    title: t('steps.phd.step4Title'),
                    description: t('steps.phd.step4Desc'),
                },
                {
                    id: 'p-step-5',
                    title: t('steps.phd.step5Title'),
                    description: t('steps.phd.step5Desc'),
                },
            ],
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-muted/10">
            <div className="bg-background border-b py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <Tabs defaultValue="bachelor" className="space-y-8">
                    <div className="flex justify-center md:justify-start overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <TabsList className="grid w-full max-w-md grid-cols-3 h-12 p-1 bg-muted/50 border">
                            <TabsTrigger
                                value="bachelor"
                                className="text-sm md:text-base"
                            >
                                {t('bachelor')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="master"
                                className="text-sm md:text-base"
                            >
                                {t('master')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="phd"
                                className="text-sm md:text-base"
                            >
                                {t('phd')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {educationLevels.map((level) => (
                        <TabsContent
                            key={level.id}
                            value={level.id}
                            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-card p-6 rounded-2xl border shadow-sm">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <level.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        {level.title}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {level.description}
                                    </p>
                                </div>
                                <div className="md:ml-auto">
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        asChild
                                    >
                                        <a
                                            href="https://app.testcenter.kz"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {t('nctSite')}{' '}
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-12">
                                <div className="md:col-span-12 lg:col-span-8 space-y-6">
                                    {level.steps.map((step, index) => (
                                        <Card
                                            key={step.id}
                                            className={cn(
                                                'relative overflow-hidden transition-all hover:border-primary/50',
                                                step.isWarning &&
                                                    'border-l-4 border-l-primary',
                                            )}
                                        >
                                            <CardHeader>
                                                <div className="flex items-start gap-4">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-4 ring-white dark:ring-gray-900">
                                                            {index + 1}
                                                        </span>
                                                        {index !==
                                                            level.steps.length -
                                                                1 && (
                                                            <div className="h-full w-px bg-border my-2" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 pt-1 flex-1">
                                                        <CardTitle className="text-xl">
                                                            {step.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-base mt-2">
                                                            {step.description}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pl-16 md:pl-20">
                                                {step.dates && (
                                                    <div className="mt-2 grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-2">
                                                        {step.dates.map(
                                                            (date, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex flex-col space-y-1"
                                                                >
                                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                                        {
                                                                            date.label
                                                                        }
                                                                    </span>
                                                                    <div className="flex items-center gap-2 font-semibold text-foreground">
                                                                        <Calendar className="h-4 w-4 text-primary" />
                                                                        {
                                                                            date.value
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {step.details && (
                                                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        {step.details.map(
                                                            (detail, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                                                                    <span>
                                                                        {detail}
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="md:col-span-12 lg:col-span-4 space-y-6">
                                    <div className="sticky top-24">
                                        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <AlertCircle className="h-5 w-5" />
                                                    {t('important')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm opacity-90 leading-relaxed">
                                                    {t('importantText1')}
                                                </p>
                                                <p className="text-sm opacity-90 leading-relaxed">
                                                    {t('importantText2')}
                                                </p>
                                                <Button
                                                    variant="secondary"
                                                    className="w-full mt-2 font-semibold text-primary hover:bg-white/90"
                                                    asChild
                                                >
                                                    <a
                                                        href="https://testcenter.kz"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {t('goToTestCenter')}{' '}
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
