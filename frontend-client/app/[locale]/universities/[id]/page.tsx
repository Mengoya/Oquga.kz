import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Info, Cuboid, BookOpen, Users, Award } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUniversityById } from '@/features/universities/api';
import {
    UniversityDetail,
    UniversityTranslation,
} from '@/features/universities/types';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

import { UniversityHero } from '@/components/universities/university-hero';
import { ContactSidebar } from '@/components/universities/contact-sidebar';
import { MobileActionBar } from '@/components/universities/mobile-action-bar';
import { ContentSection } from '@/components/universities/content-section';
import { VirtualTourViewer } from '@/components/universities/virtual-tour-viewer';

function getUniversityTranslation(
    uni: UniversityDetail,
    locale: string,
): UniversityTranslation {
    return (
        uni.translations[locale] ||
        uni.translations['ru'] ||
        uni.translations['en'] ||
        Object.values(uni.translations)[0] || {
            name: '',
            shortDescription: '',
            description: '',
            city: '',
            isComplete: false,
        }
    );
}

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id, locale } = await params;

    try {
        const uni = await getUniversityById(id);
        const translation = getUniversityTranslation(uni, locale);
        const t = await getTranslations({ locale, namespace: 'universities' });

        return {
            title: translation.name || t('university'),
            description:
                translation.shortDescription ||
                `${t('aboutUniversity')} - ${translation.name}`,
            openGraph: {
                title: translation.name,
                description: translation.shortDescription,
                images: [uni.photoUrl || PLACEHOLDER_IMAGE],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: translation.name,
                description: translation.shortDescription,
                images: [uni.photoUrl || PLACEHOLDER_IMAGE],
            },
        };
    } catch {
        const t = await getTranslations({ locale, namespace: 'universities' });
        return {
            title: t('notFound'),
        };
    }
}

export default async function UniversityDetailPage({ params }: PageProps) {
    const { id, locale } = await params;

    setRequestLocale(locale);

    const t = await getTranslations('universities');
    const tCommon = await getTranslations('common');
    const tNav = await getTranslations('nav');

    let uni: UniversityDetail;
    let translation: UniversityTranslation;

    try {
        uni = await getUniversityById(id);
        translation = getUniversityTranslation(uni, locale);
    } catch (error) {
        console.error('Error loading university:', error);
        notFound();
    }

    const createMarkup = (htmlContent: string) => {
        return { __html: htmlContent };
    };

    const tourUrl =
        uni.virtualTourUrl || 'https://iitu.edu.kz/_static/3d-tour-iitu/';

    const heroTranslations = {
        university: t('university'),
        verifiedProfile: t('verifiedProfile'),
        views: tCommon('views'),
        founded: tCommon('founded'),
        officialSite: t('officialSite'),
        backToList: t('backToList'),
        share: 'Поделиться',
        addToFavorites: 'Добавить в избранное',
        breadcrumbHome: tNav('home'),
        breadcrumbUniversities: tNav('universities'),
    };

    const statsTranslations = {
        founded: 'Год основания',
        programs: 'Программ обучения',
        students: 'Студентов',
        faculties: 'Факультетов',
        partners: 'Партнёров',
        graduates: 'Выпускников',
    };

    const contactTranslations = {
        contacts: t('contacts'),
        phone: t('phone'),
        email: t('email') || 'Email',
        website: t('website'),
        location: 'Местоположение',
        applyDocuments: t('applyDocuments'),
        applyNote: t('applyNote'),
        scheduleVisit: 'Записаться на экскурсию',
        askQuestion: 'Задать вопрос',
        copied: 'Скопировано!',
    };

    const mobileTranslations = {
        call: 'Позвонить',
        website: 'Сайт',
        apply: 'Подать заявку',
    };

    return (
        <div className="min-h-screen bg-muted/10 pb-24 lg:pb-12">
            <UniversityHero
                name={translation.name}
                city={translation.city}
                photoUrl={uni.photoUrl}
                websiteUrl={uni.websiteUrl}
                foundedYear={uni.foundedYear}
                viewCount={uni.viewCount}
                progressPercent={uni.progressPercent}
                locale={locale}
                translations={heroTranslations}
            />

            <div className="container mx-auto px-4 md:px-6">
                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="sticky top-[calc(4rem+3.5rem)] z-30 bg-muted/10 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0">
                        <TabsList className="h-12 p-1 bg-muted/60 border w-full md:w-auto justify-start overflow-x-auto">
                            <TabsTrigger
                                value="overview"
                                className="gap-2 px-4 md:px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                <Info className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {t('overview')}
                                </span>
                                <span className="sm:hidden">Обзор</span>
                            </TabsTrigger>
                            {tourUrl && (
                                <TabsTrigger
                                    value="virtual-tour"
                                    className="gap-2 px-4 md:px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                >
                                    <Cuboid className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        {t('virtualTour')}
                                    </span>
                                    <span className="sm:hidden">3D Тур</span>
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="programs"
                                className="gap-2 px-4 md:px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Программы
                                </span>
                                <span className="sm:hidden">Программы</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent
                        value="overview"
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            <div className="lg:col-span-8 space-y-6">
                                <ContentSection
                                    title={t('aboutUniversity')}
                                    icon={<Info className="h-5 w-5" />}
                                    id="about"
                                >
                                    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                                        {translation.description ? (
                                            <div
                                                dangerouslySetInnerHTML={createMarkup(
                                                    translation.description,
                                                )}
                                                className="[&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="p-4 rounded-full bg-muted/50 mb-4">
                                                    <Info className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground italic max-w-md">
                                                    {t('noDescription')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </ContentSection>

                                <ContentSection
                                    title="Аккредитация и лицензии"
                                    icon={<Award className="h-5 w-5" />}
                                    id="accreditation"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            {
                                                title: 'Государственная лицензия',
                                                description: 'МОН РК №12345',
                                                status: 'Действующая',
                                            },
                                            {
                                                title: 'Международная аккредитация',
                                                description: 'ABET, FIBAA',
                                                status: 'До 2027',
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.title}
                                                className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors"
                                            >
                                                <h4 className="font-medium mb-1">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {item.description}
                                                </p>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ContentSection>
                            </div>

                            <ContactSidebar
                                contactPhone={uni.contactPhone}
                                contactEmail={uni.contactEmail}
                                websiteUrl={uni.websiteUrl}
                                city={translation.city}
                                translations={contactTranslations}
                            />
                        </div>
                    </TabsContent>

                    {tourUrl && (
                        <TabsContent
                            value="virtual-tour"
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        >
                            <VirtualTourViewer
                                url={tourUrl}
                                title={translation.name}
                            />
                        </TabsContent>
                    )}

                    <TabsContent
                        value="programs"
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <ContentSection
                            title="Образовательные программы"
                            icon={<BookOpen className="h-5 w-5" />}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {
                                        name: 'Информационные системы',
                                        level: 'Бакалавриат',
                                        duration: '4 года',
                                    },
                                    {
                                        name: 'Компьютерные науки',
                                        level: 'Бакалавриат',
                                        duration: '4 года',
                                    },
                                    {
                                        name: 'Кибербезопасность',
                                        level: 'Магистратура',
                                        duration: '2 года',
                                    },
                                    {
                                        name: 'Data Science',
                                        level: 'Магистратура',
                                        duration: '2 года',
                                    },
                                    {
                                        name: 'Искусственный интеллект',
                                        level: 'PhD',
                                        duration: '3 года',
                                    },
                                    {
                                        name: 'Финансы',
                                        level: 'Бакалавриат',
                                        duration: '4 года',
                                    },
                                ].map((program, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                                            {program.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="px-2 py-0.5 rounded bg-muted text-xs">
                                                {program.level}
                                            </span>
                                            <span>{program.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ContentSection>
                    </TabsContent>
                </Tabs>
            </div>

            <MobileActionBar
                contactPhone={uni.contactPhone}
                websiteUrl={uni.websiteUrl}
                translations={mobileTranslations}
            />
        </div>
    );
}
