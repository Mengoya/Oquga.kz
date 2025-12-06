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

export const metadata: Metadata = {
    title: 'Поступление',
    description:
        'Правила поступления, сроки ЕНТ/КТ и инструкции для абитуриентов (Бакалавриат, Магистратура, Докторантура).',
};

interface AdmissionStep {
    id: string;
    title: string;
    description: string;
    dates?: { label: string; value: string }[];
    details?: string[];
    isWarning?: boolean;
}

interface EducationLevel {
    id: string;
    title: string;
    icon: React.ElementType;
    description: string;
    steps: AdmissionStep[];
}

const ADMISSION_DATA: Record<string, EducationLevel> = {
    bachelor: {
        id: 'bachelor',
        title: 'Бакалавриат',
        icon: GraduationCap,
        description:
            'Первая ступень высшего образования. Поступление через Единое Национальное Тестирование (ЕНТ).',
        steps: [
            {
                id: 'step-1',
                title: 'Определитесь с направлением и вузами',
                description:
                    'Выберите образовательные программы, изучите профильные предметы ЕНТ, язык обучения, стоимость и наличие общежития.',
            },
            {
                id: 'step-2',
                title: 'Зарегистрируйтесь на ЕНТ',
                description:
                    'Регистрация проходит через сайт app.testcenter.kz. Следите за обновлениями, даты могут меняться.',
                dates: [
                    {
                        label: 'Январское ЕНТ (Заявления)',
                        value: '20–30 декабря',
                    },
                    {
                        label: 'Январское ЕНТ (Тест)',
                        value: '18 января – 10 февраля',
                    },
                    { label: 'Основное ЕНТ (Заявления)', value: '6–14 мая' },
                    { label: 'Основное ЕНТ (Тест)', value: '16 мая – 5 июля' },
                ],
                isWarning: true,
            },
            {
                id: 'step-3',
                title: 'Проверьте минимальные требования',
                description:
                    'На сайте выбранного ВУЗа уточните проходной балл и наличие специальных/творческих экзаменов.',
            },
            {
                id: 'step-4',
                title: 'Соберите пакет документов',
                description:
                    'Подготовьте оригиналы и копии для подачи в приемную комиссию.',
                details: [
                    'Удостоверение личности',
                    'Аттестат с приложением',
                    'Сертификат ЕНТ',
                    'Медсправка (075-У)',
                    'Фото 3x4 (6 шт.)',
                    'Приписное свидетельство (для юношей)',
                ],
            },
            {
                id: 'step-5',
                title: 'Подайте заявление',
                description:
                    'После получения результатов ЕНТ подайте документы онлайн или офлайн в ВУЗ. Следите за статусом гранта.',
            },
        ],
    },
    master: {
        id: 'master',
        title: 'Магистратура',
        icon: BookOpen,
        description:
            'Углубленная профессиональная подготовка. Поступление через Комплексное Тестирование (КТ).',
        steps: [
            {
                id: 'm-step-1',
                title: 'Выберите направление',
                description:
                    'Определитесь с профилем (научно-педагогическое или профильное) и языком обучения.',
            },
            {
                id: 'm-step-2',
                title: 'Узнайте требования ВУЗа',
                description:
                    'Вам понадобится диплом бакалавра, определенный GPA и участие в КТ.',
            },
            {
                id: 'm-step-3',
                title: 'Зарегистрируйтесь на КТ',
                description:
                    'Регистрация проходит на сайте app.testcenter.kz в два потока.',
                dates: [
                    {
                        label: 'Летний поток (Регистрация)',
                        value: '1 июня – 8 июля',
                    },
                    {
                        label: 'Летний поток (Тест)',
                        value: '20 июля – 10 августа',
                    },
                    {
                        label: 'Зимний поток (Регистрация)',
                        value: '28 октября – 10 ноября',
                    },
                    {
                        label: 'Зимний поток (Тест)',
                        value: '18 ноября – 11 декабря',
                    },
                ],
                isWarning: true,
            },
            {
                id: 'm-step-4',
                title: 'Сдайте КТ и экзамены',
                description:
                    'КТ включает тест на иностранный язык, готовность к обучению и профильные предметы.',
            },
            {
                id: 'm-step-5',
                title: 'Подайте документы',
                description:
                    'В сроки приема (июль-август или ноябрь-декабрь) подайте заявление и оригиналы документов в ВУЗ.',
            },
        ],
    },
    phd: {
        id: 'phd',
        title: 'Докторантура',
        icon: School,
        description:
            'Подготовка научных кадров высшей квалификации. Требуется наличие степени магистра.',
        steps: [
            {
                id: 'p-step-1',
                title: 'Направление и руководитель',
                description:
                    'Ключевой этап: выберите область исследований и заранее согласуйте научного руководителя.',
            },
            {
                id: 'p-step-2',
                title: 'Проверка требований',
                description:
                    'Необходим сертификат на знание языка (IELTS/TOEFL + KAZTEST), публикации и research proposal.',
            },
            {
                id: 'p-step-3',
                title: 'Регистрация на экзамен',
                description: 'Вступительные экзамены проходят через НЦТ.',
                dates: [
                    {
                        label: 'Летний поток (Заявления)',
                        value: '3 июля – 3 августа',
                    },
                    {
                        label: 'Летний поток (Экзамен)',
                        value: '4 – 20 августа',
                    },
                    {
                        label: 'Осенний поток',
                        value: 'По отдельным решениям МНВО',
                    },
                ],
                isWarning: true,
            },
            {
                id: 'p-step-4',
                title: 'Подготовка научного пакета',
                description:
                    'Соберите рекомендации, список публикаций, план исследования и сертификаты языков.',
            },
            {
                id: 'p-step-5',
                title: 'Экзамены и конкурс',
                description:
                    'Сдайте профильный экзамен, пройдите собеседование на кафедре и заключите договор.',
            },
        ],
    },
};

export default function AdmissionsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/10">
            <div className="bg-background border-b py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Как поступить в университет?
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Пошаговое руководство для абитуриентов всех уровней.
                            Узнайте сроки, требования и необходимые документы
                            для успешного поступления.
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
                                Бакалавриат
                            </TabsTrigger>
                            <TabsTrigger
                                value="master"
                                className="text-sm md:text-base"
                            >
                                Магистратура
                            </TabsTrigger>
                            <TabsTrigger
                                value="phd"
                                className="text-sm md:text-base"
                            >
                                Докторантура
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {Object.values(ADMISSION_DATA).map((level) => (
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
                                            Сайт НЦТ{' '}
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
                                                    Важно знать
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm opacity-90 leading-relaxed">
                                                    Даты тестирований и приема
                                                    документов могут меняться
                                                    ежегодно согласно приказам
                                                    МНВО РК.
                                                </p>
                                                <p className="text-sm opacity-90 leading-relaxed">
                                                    Всегда проверяйте актуальную
                                                    информацию на официальном
                                                    сайте Национального центра
                                                    тестирования перед оплатой и
                                                    регистрацией.
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
                                                        Перейти на TestCenter.kz{' '}
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
