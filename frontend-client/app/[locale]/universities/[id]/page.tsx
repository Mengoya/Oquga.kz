import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Info, Cuboid, BookOpen, Award } from 'lucide-react';
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
    const tStats = await getTranslations('stats');

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

    const tourUrl = uni.virtualTourUrl || null;

    const heroTranslations = {
        university: t('university'),
        verifiedProfile: t('verifiedProfile'),
        views: tCommon('views'),
        founded: tCommon('founded'),
        officialSite: t('officialSite'),
        backToList: t('backToList'),
        share: t('share'),
        addToFavorites: t('addToFavorites'),
        removedFromFavorites: t('removedFromFavorites'),
        addedToFavorites: t('addedToFavorites'),
        linkCopied: t('linkCopied'),
        breadcrumbHome: tNav('home'),
        breadcrumbUniversities: tNav('universities'),
    };

    const statsTranslations = {
        founded: tStats('founded'),
        programs: tStats('programs'),
        students: tStats('students'),
        faculties: tStats('faculties'),
        partners: tStats('partners'),
        graduates: tStats('graduates'),
    };

    const contactTranslations = {
        contacts: t('contacts'),
        phone: t('phone'),
        email: t('email'),
        website: t('website'),
        location: t('location'),
        applyDocuments: t('applyDocuments'),
        applyNote: t('applyNote'),
        scheduleVisit: t('scheduleVisit'),
        askQuestion: t('askQuestion'),
        copied: t('copied'),
    };

    const mobileTranslations = {
        call: t('call'),
        website: t('website'),
        apply: t('apply'),
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
                                <span className="sm:hidden">{t('overview')}</span>
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
                                    <span className="sm:hidden">{t('virtualTour')}</span>
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="programs"
                                className="gap-2 px-4 md:px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>{t('programs')}</span>
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
                                    title={t('accreditationAndLicenses')}
                                    icon={<Award className="h-5 w-5" />}
                                    id="accreditation"
                                >
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                                            <Award className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground italic max-w-md">
                                            {t('noAccreditation')}
                                        </p>
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
                            title={t('educationalPrograms')}
                            icon={<BookOpen className="h-5 w-5" />}
                        >
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="p-4 rounded-full bg-muted/50 mb-4">
                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground italic max-w-md">
                                    {t('noPrograms')}
                                </p>
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
