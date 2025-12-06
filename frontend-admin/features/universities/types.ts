import { z } from 'zod';

export const UniversityStatusSchema = z.enum(['active', 'archived', 'pending']);

const TranslationStatusSchema = z.object({
    isComplete: z.boolean(),
});

export const UniversitySchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    photoUrl: z.string().nullable(),
    shortDescription: z.string().nullable(),
    programsCount: z.number(),
    studentsCount: z.number(),
    rating: z.number().min(0).max(5),
    status: UniversityStatusSchema,
    progressPercent: z.number(),
    viewCount: z.number(),
    translations: z.record(z.string(), TranslationStatusSchema).optional(),
    updatedAt: z.string(),
});

export type University = z.infer<typeof UniversitySchema>;

export type UniversityFilters = {
    search?: string;
    page?: number;
    limit?: number;
};

const TranslationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
});

export const CreateUniversitySchema = z.object({
    translations: z
        .object({
            ru: TranslationSchema.optional(),
            kk: TranslationSchema.optional(),
            en: TranslationSchema.optional(),
        })
        .refine((data) => data.ru?.name || data.kk?.name || data.en?.name, {
            message: 'At least one translation with name is required',
        }),
});

export type CreateUniversityValues = z.infer<typeof CreateUniversitySchema>;

export interface PhotoUploadResponse {
    photoUrl: string;
}

export interface UniversityApiTranslation {
    name: string;
    shortDescription: string | null;
    description: string | null;
    city: string | null;
    isComplete: boolean;
}

export interface UniversityDetailTranslation {
    name: string;
    shortDescription: string | null;
    description: string | null;
    goal: string | null;
    address: string | null;
    city: string | null;
    historyText: string | null;
    isComplete: boolean;
}

export interface LeadershipDto {
    id: number | null;
    fullName: string;
    position: string;
    bioSummary: string | null;
    sortOrder: number;
}

export interface AchievementDto {
    id: number | null;
    title: string;
    year: number | null;
    rankValue: string | null;
    details: string | null;
    sortOrder: number;
}

export interface HistoryEventDto {
    id: number | null;
    eventYear: number;
    eventDescription: string | null;
    sortOrder: number;
}

export interface FacultyTranslationDto {
    name: string;
    description: string | null;
}

export interface DepartmentTranslationDto {
    name: string;
    goal: string | null;
    mission: string | null;
    tasks: string | null;
}

export interface ProgramGroupTranslationDto {
    name: string;
    description: string | null;
}

export interface ProgramTranslationDto {
    name: string;
    description: string | null;
}

export interface PassingScoreDto {
    minScoreGrant: number | null;
    minScorePaid: number | null;
    profileSubjects: string | null;
    isCreativeExam: boolean;
}

export interface EducationalProgramDto {
    id: number | null;
    code: string;
    sortOrder: number;
    translations: Record<string, ProgramTranslationDto>;
}

export interface EducationalProgramGroupDto {
    id: number | null;
    departmentId: number | null;
    degreeLevel: string;
    code: string;
    sortOrder: number;
    translations: Record<string, ProgramGroupTranslationDto>;
    programs: EducationalProgramDto[];
    passingScore: PassingScoreDto | null;
}

export interface DepartmentDto {
    id: number | null;
    sortOrder: number;
    translations: Record<string, DepartmentTranslationDto>;
}

export interface FacultyDto {
    id: number | null;
    sortOrder: number;
    translations: Record<string, FacultyTranslationDto>;
    departments: DepartmentDto[];
    programGroups: EducationalProgramGroupDto[];
}

export interface AdmissionRuleDto {
    startDate: string | null;
    endDate: string | null;
    documentsText: string | null;
    stepsText: string | null;
    militaryDepartmentInfo: string | null;
    dormitoryInfo: string | null;
}

export interface TuitionDiscountDto {
    id: number | null;
    categoryName: string;
    pricePerYear: number | null;
    scholarshipInfo: string | null;
    sortOrder: number;
}

export interface InternationalSectionTranslationDto {
    title: string;
    description: string | null;
}

export interface InternationalItemTranslationDto {
    title: string;
    description: string | null;
}

export interface InternationalItemDto {
    id: number | null;
    externalUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    translations: Record<string, InternationalItemTranslationDto>;
}

export interface InternationalSectionDto {
    id: number | null;
    externalUrl: string | null;
    sortOrder: number;
    isActive: boolean;
    translations: Record<string, InternationalSectionTranslationDto>;
    items: InternationalItemDto[];
}

export interface SectionProgress {
    name: string;
    percent: number;
    maxPercent: number;
    filledFields: number;
    totalFields: number;
}

export interface ProgressDto {
    totalPercent: number;
    basicInfo: SectionProgress;
    description: SectionProgress;
    leadership: SectionProgress;
    achievements: SectionProgress;
    faculties: SectionProgress;
    admissionRules: SectionProgress;
    tuition: SectionProgress;
    international: SectionProgress;
}

export interface UniversityApiResponse {
    id: number;
    slug: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    virtualTourUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    viewCount: number;
    translations: Record<string, UniversityApiTranslation>;
    progressPercent: number;
    createdAt: string;
    updatedAt: string;
}

export interface UniversityDetailResponse {
    id: number;
    slug: string;
    photoUrl: string | null;
    websiteUrl: string | null;
    virtualTourUrl: string | null;
    foundedYear: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
    viewCount: number;
    translations: Record<string, UniversityDetailTranslation>;
    leadership: LeadershipDto[];
    achievements: AchievementDto[];
    historyEvents: HistoryEventDto[];
    faculties: FacultyDto[];
    admissionRule: AdmissionRuleDto | null;
    tuitionDiscounts: TuitionDiscountDto[];
    internationalSections: InternationalSectionDto[];
    progress: ProgressDto;
    createdAt: string;
    updatedAt: string;
}

export interface UniversityListApiResponse {
    data: UniversityApiResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateUniversityValues {
    photoUrl?: string;
    websiteUrl?: string;
    virtualTourUrl: string | null;
    foundedYear?: number | null;
    contactPhone?: string;
    contactEmail?: string;
    translations: Record<
        string,
        {
            name?: string;
            city?: string;
            shortDescription?: string;
            description?: string;
            goal?: string;
            address?: string;
            historyText?: string;
        }
    >;
    leadership?: LeadershipDto[];
    achievements?: AchievementDto[];
    historyEvents?: HistoryEventDto[];
    faculties?: FacultyDto[];
    admissionRule?: AdmissionRuleDto | null;
    tuitionDiscounts?: TuitionDiscountDto[];
    internationalSections?: InternationalSectionDto[];
}
