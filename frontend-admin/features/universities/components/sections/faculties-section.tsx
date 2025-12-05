'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    UpdateUniversityValues,
    FacultyDto,
    DepartmentDto,
    EducationalProgramGroupDto,
    EducationalProgramDto,
    PassingScoreDto
} from '../../types';
import { Plus, Trash2, ChevronDown, ChevronRight, Building2, BookOpen, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Props {
    data: UpdateUniversityValues;
    onChange: (updates: Partial<UpdateUniversityValues>) => void;
}

const languages = ['ru', 'kk', 'en'] as const;
const languageLabels = { ru: 'RU', kk: 'KK', en: 'EN' };

const degreeLevels = [
    { value: 'BACHELOR', label: 'Бакалавриат' },
    { value: 'MASTER', label: 'Магистратура' },
    { value: 'DOCTORATE', label: 'Докторантура' },
];

export function FacultiesSection({ data, onChange }: Props) {
    const faculties = data.faculties || [];
    const [expandedFaculty, setExpandedFaculty] = useState<number | null>(null);
    const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);
    const [expandedProgramGroup, setExpandedProgramGroup] = useState<string | null>(null);

    const addFaculty = () => {
        const newFaculty: FacultyDto = {
            id: null,
            sortOrder: faculties.length,
            translations: {
                ru: { name: '', description: null },
                kk: { name: '', description: null },
                en: { name: '', description: null },
            },
            departments: [],
            programGroups: [],
        };
        onChange({ faculties: [...faculties, newFaculty] });
    };

    const removeFaculty = (index: number) => {
        onChange({ faculties: faculties.filter((_, i) => i !== index) });
    };

    const updateFaculty = (index: number, updates: Partial<FacultyDto>) => {
        onChange({
            faculties: faculties.map((f, i) => (i === index ? { ...f, ...updates } : f)),
        });
    };

    const updateFacultyTranslation = (facultyIndex: number, lang: string, field: string, value: string) => {
        const faculty = faculties[facultyIndex];
        updateFaculty(facultyIndex, {
            translations: {
                ...faculty.translations,
                [lang]: {
                    ...faculty.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    const addDepartment = (facultyIndex: number) => {
        const faculty = faculties[facultyIndex];
        const newDepartment: DepartmentDto = {
            id: null,
            sortOrder: faculty.departments.length,
            translations: {
                ru: { name: '', goal: null, mission: null, tasks: null },
                kk: { name: '', goal: null, mission: null, tasks: null },
                en: { name: '', goal: null, mission: null, tasks: null },
            },
        };
        updateFaculty(facultyIndex, {
            departments: [...faculty.departments, newDepartment],
        });
    };

    const removeDepartment = (facultyIndex: number, deptIndex: number) => {
        const faculty = faculties[facultyIndex];
        updateFaculty(facultyIndex, {
            departments: faculty.departments.filter((_, i) => i !== deptIndex),
        });
    };

    const updateDepartment = (facultyIndex: number, deptIndex: number, updates: Partial<DepartmentDto>) => {
        const faculty = faculties[facultyIndex];
        updateFaculty(facultyIndex, {
            departments: faculty.departments.map((d, i) => (i === deptIndex ? { ...d, ...updates } : d)),
        });
    };

    const updateDepartmentTranslation = (facultyIndex: number, deptIndex: number, lang: string, field: string, value: string) => {
        const faculty = faculties[facultyIndex];
        const dept = faculty.departments[deptIndex];
        updateDepartment(facultyIndex, deptIndex, {
            translations: {
                ...dept.translations,
                [lang]: {
                    ...dept.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    const addProgramGroup = (facultyIndex: number) => {
        const faculty = faculties[facultyIndex];
        const newGroup: EducationalProgramGroupDto = {
            id: null,
            departmentId: null,
            degreeLevel: 'BACHELOR',
            code: '',
            sortOrder: faculty.programGroups.length,
            translations: {
                ru: { name: '', description: null },
                kk: { name: '', description: null },
                en: { name: '', description: null },
            },
            programs: [],
            passingScore: null,
        };
        updateFaculty(facultyIndex, {
            programGroups: [...faculty.programGroups, newGroup],
        });
    };

    const removeProgramGroup = (facultyIndex: number, groupIndex: number) => {
        const faculty = faculties[facultyIndex];
        updateFaculty(facultyIndex, {
            programGroups: faculty.programGroups.filter((_, i) => i !== groupIndex),
        });
    };

    const updateProgramGroup = (facultyIndex: number, groupIndex: number, updates: Partial<EducationalProgramGroupDto>) => {
        const faculty = faculties[facultyIndex];
        updateFaculty(facultyIndex, {
            programGroups: faculty.programGroups.map((g, i) => (i === groupIndex ? { ...g, ...updates } : g)),
        });
    };

    const updateProgramGroupTranslation = (facultyIndex: number, groupIndex: number, lang: string, field: string, value: string) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        updateProgramGroup(facultyIndex, groupIndex, {
            translations: {
                ...group.translations,
                [lang]: {
                    ...group.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    const addProgram = (facultyIndex: number, groupIndex: number) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        const newProgram: EducationalProgramDto = {
            id: null,
            code: '',
            sortOrder: group.programs.length,
            translations: {
                ru: { name: '', description: null },
                kk: { name: '', description: null },
                en: { name: '', description: null },
            },
        };
        updateProgramGroup(facultyIndex, groupIndex, {
            programs: [...group.programs, newProgram],
        });
    };

    const removeProgram = (facultyIndex: number, groupIndex: number, progIndex: number) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        updateProgramGroup(facultyIndex, groupIndex, {
            programs: group.programs.filter((_, i) => i !== progIndex),
        });
    };

    const updateProgram = (facultyIndex: number, groupIndex: number, progIndex: number, updates: Partial<EducationalProgramDto>) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        updateProgramGroup(facultyIndex, groupIndex, {
            programs: group.programs.map((p, i) => (i === progIndex ? { ...p, ...updates } : p)),
        });
    };

    const updateProgramTranslation = (facultyIndex: number, groupIndex: number, progIndex: number, lang: string, field: string, value: string) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        const prog = group.programs[progIndex];
        updateProgram(facultyIndex, groupIndex, progIndex, {
            translations: {
                ...prog.translations,
                [lang]: {
                    ...prog.translations[lang],
                    [field]: value || null,
                },
            },
        });
    };

    const updatePassingScore = (facultyIndex: number, groupIndex: number, updates: Partial<PassingScoreDto> | null) => {
        const faculty = faculties[facultyIndex];
        const group = faculty.programGroups[groupIndex];
        if (updates === null) {
            updateProgramGroup(facultyIndex, groupIndex, { passingScore: null });
        } else {
            updateProgramGroup(facultyIndex, groupIndex, {
                passingScore: { ...(group.passingScore || { minScoreGrant: null, minScorePaid: null, profileSubjects: null, isCreativeExam: false }), ...updates },
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Факультеты</h3>
                    <p className="text-sm text-muted-foreground">
                        Структура: Факультеты → Кафедры → Группы программ → Программы
                    </p>
                </div>
                <Button onClick={addFaculty} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить факультет
                </Button>
            </div>

            {faculties.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Нет факультетов</p>
                </div>
            )}

            <div className="space-y-4">
                {faculties.map((faculty, facultyIndex) => (
                    <div key={facultyIndex} className="border rounded-lg">
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                            onClick={() => setExpandedFaculty(expandedFaculty === facultyIndex ? null : facultyIndex)}
                        >
                            <div className="flex items-center gap-2">
                                {expandedFaculty === facultyIndex ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                    {faculty.translations.ru?.name || `Факультет #${facultyIndex + 1}`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ({faculty.departments.length} каф., {faculty.programGroups.length} гр. прог.)
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFaculty(facultyIndex);
                                }}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {expandedFaculty === facultyIndex && (
                            <div className="p-4 border-t space-y-6">
                                <Tabs defaultValue="ru">
                                    <TabsList>
                                        {languages.map((lang) => (
                                            <TabsTrigger key={lang} value={lang}>
                                                {languageLabels[lang]}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {languages.map((lang) => (
                                        <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                                            <div>
                                                <Label>Название факультета</Label>
                                                <Input
                                                    value={faculty.translations[lang]?.name || ''}
                                                    onChange={(e) => updateFacultyTranslation(facultyIndex, lang, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Описание</Label>
                                                <Textarea
                                                    value={faculty.translations[lang]?.description || ''}
                                                    onChange={(e) => updateFacultyTranslation(facultyIndex, lang, 'description', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Кафедры
                                        </h4>
                                        <Button onClick={() => addDepartment(facultyIndex)} size="sm" variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Добавить кафедру
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {faculty.departments.map((dept, deptIndex) => {
                                            const deptKey = `${facultyIndex}-${deptIndex}`;
                                            return (
                                                <div key={deptIndex} className="border rounded-lg bg-muted/30">
                                                    <div
                                                        className="flex items-center justify-between p-3 cursor-pointer"
                                                        onClick={() => setExpandedDepartment(expandedDepartment === deptKey ? null : deptKey)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {expandedDepartment === deptKey ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                                            <span className="text-sm">{dept.translations.ru?.name || `Кафедра #${deptIndex + 1}`}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeDepartment(facultyIndex, deptIndex);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    {expandedDepartment === deptKey && (
                                                        <div className="p-3 border-t space-y-4">
                                                            <Tabs defaultValue="ru">
                                                                <TabsList className="h-8">
                                                                    {languages.map((lang) => (
                                                                        <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1">
                                                                            {languageLabels[lang]}
                                                                        </TabsTrigger>
                                                                    ))}
                                                                </TabsList>
                                                                {languages.map((lang) => (
                                                                    <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
                                                                        <div>
                                                                            <Label className="text-xs">Название</Label>
                                                                            <Input
                                                                                className="h-8 text-sm"
                                                                                value={dept.translations[lang]?.name || ''}
                                                                                onChange={(e) => updateDepartmentTranslation(facultyIndex, deptIndex, lang, 'name', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">Цель</Label>
                                                                            <Textarea
                                                                                className="text-sm"
                                                                                value={dept.translations[lang]?.goal || ''}
                                                                                onChange={(e) => updateDepartmentTranslation(facultyIndex, deptIndex, lang, 'goal', e.target.value)}
                                                                                rows={2}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">Миссия</Label>
                                                                            <Textarea
                                                                                className="text-sm"
                                                                                value={dept.translations[lang]?.mission || ''}
                                                                                onChange={(e) => updateDepartmentTranslation(facultyIndex, deptIndex, lang, 'mission', e.target.value)}
                                                                                rows={2}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">Задачи</Label>
                                                                            <Textarea
                                                                                className="text-sm"
                                                                                value={dept.translations[lang]?.tasks || ''}
                                                                                onChange={(e) => updateDepartmentTranslation(facultyIndex, deptIndex, lang, 'tasks', e.target.value)}
                                                                                rows={2}
                                                                            />
                                                                        </div>
                                                                    </TabsContent>
                                                                ))}
                                                            </Tabs>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            Группы образовательных программ
                                        </h4>
                                        <Button onClick={() => addProgramGroup(facultyIndex)} size="sm" variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Добавить группу
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {faculty.programGroups.map((group, groupIndex) => {
                                            const groupKey = `${facultyIndex}-${groupIndex}`;
                                            return (
                                                <div key={groupIndex} className="border rounded-lg bg-muted/30">
                                                    <div
                                                        className="flex items-center justify-between p-3 cursor-pointer"
                                                        onClick={() => setExpandedProgramGroup(expandedProgramGroup === groupKey ? null : groupKey)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {expandedProgramGroup === groupKey ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                                            <span className="text-sm">
                                                                {group.translations.ru?.name || group.code || `Группа #${groupIndex + 1}`}
                                                            </span>
                                                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                                {degreeLevels.find(d => d.value === group.degreeLevel)?.label}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                ({group.programs.length} прог.)
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeProgramGroup(facultyIndex, groupIndex);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    {expandedProgramGroup === groupKey && (
                                                        <div className="p-3 border-t space-y-4">
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <div>
                                                                    <Label className="text-xs">Уровень</Label>
                                                                    <Select
                                                                        value={group.degreeLevel}
                                                                        onValueChange={(v) => updateProgramGroup(facultyIndex, groupIndex, { degreeLevel: v })}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-sm">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {degreeLevels.map((level) => (
                                                                                <SelectItem key={level.value} value={level.value}>
                                                                                    {level.label}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs">Код</Label>
                                                                    <Input
                                                                        className="h-8 text-sm"
                                                                        value={group.code}
                                                                        onChange={(e) => updateProgramGroup(facultyIndex, groupIndex, { code: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs">Кафедра</Label>
                                                                    <Select
                                                                        value={group.departmentId?.toString() || 'none'}
                                                                        onValueChange={(v) => updateProgramGroup(facultyIndex, groupIndex, { departmentId: v === 'none' ? null : Number(v) })}
                                                                    >
                                                                        <SelectTrigger className="h-8 text-sm">
                                                                            <SelectValue placeholder="Не выбрана" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="none">Не выбрана</SelectItem>
                                                                            {faculty.departments.map((d, di) => (
                                                                                <SelectItem key={di} value={d.id?.toString() || `new-${di}`}>
                                                                                    {d.translations.ru?.name || `Кафедра #${di + 1}`}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>

                                                            <Tabs defaultValue="ru">
                                                                <TabsList className="h-8">
                                                                    {languages.map((lang) => (
                                                                        <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-1">
                                                                            {languageLabels[lang]}
                                                                        </TabsTrigger>
                                                                    ))}
                                                                </TabsList>
                                                                {languages.map((lang) => (
                                                                    <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
                                                                        <div>
                                                                            <Label className="text-xs">Название группы</Label>
                                                                            <Input
                                                                                className="h-8 text-sm"
                                                                                value={group.translations[lang]?.name || ''}
                                                                                onChange={(e) => updateProgramGroupTranslation(facultyIndex, groupIndex, lang, 'name', e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">Описание</Label>
                                                                            <Textarea
                                                                                className="text-sm"
                                                                                value={group.translations[lang]?.description || ''}
                                                                                onChange={(e) => updateProgramGroupTranslation(facultyIndex, groupIndex, lang, 'description', e.target.value)}
                                                                                rows={2}
                                                                            />
                                                                        </div>
                                                                    </TabsContent>
                                                                ))}
                                                            </Tabs>

                                                            <div className="border-t pt-3">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <Label className="text-xs font-medium">Проходные баллы</Label>
                                                                    {!group.passingScore && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="h-7 text-xs"
                                                                            onClick={() => updatePassingScore(facultyIndex, groupIndex, { minScoreGrant: null, minScorePaid: null, profileSubjects: null, isCreativeExam: false })}
                                                                        >
                                                                            <Plus className="h-3 w-3 mr-1" />
                                                                            Добавить
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                {group.passingScore && (
                                                                    <div className="space-y-3 p-3 bg-background rounded border">
                                                                        <div className="grid grid-cols-2 gap-3">
                                                                            <div>
                                                                                <Label className="text-xs">Мин. балл (грант)</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    className="h-8 text-sm"
                                                                                    value={group.passingScore.minScoreGrant || ''}
                                                                                    onChange={(e) => updatePassingScore(facultyIndex, groupIndex, { minScoreGrant: e.target.value ? Number(e.target.value) : null })}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-xs">Мин. балл (платное)</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    className="h-8 text-sm"
                                                                                    value={group.passingScore.minScorePaid || ''}
                                                                                    onChange={(e) => updatePassingScore(facultyIndex, groupIndex, { minScorePaid: e.target.value ? Number(e.target.value) : null })}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="text-xs">Профильные предметы</Label>
                                                                            <Input
                                                                                className="h-8 text-sm"
                                                                                value={group.passingScore.profileSubjects || ''}
                                                                                onChange={(e) => updatePassingScore(facultyIndex, groupIndex, { profileSubjects: e.target.value || null })}
                                                                                placeholder="Математика, Физика"
                                                                            />
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`creative-${groupKey}`}
                                                                                checked={group.passingScore.isCreativeExam}
                                                                                onChange={(e) => updatePassingScore(facultyIndex, groupIndex, { isCreativeExam: e.target.checked })}
                                                                                className="h-4 w-4"
                                                                            />
                                                                            <Label htmlFor={`creative-${groupKey}`} className="text-xs">Творческий экзамен</Label>
                                                                        </div>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            className="h-7 text-xs text-destructive"
                                                                            onClick={() => updatePassingScore(facultyIndex, groupIndex, null)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                                            Удалить баллы
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="border-t pt-3">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <Label className="text-xs font-medium">Образовательные программы</Label>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-7 text-xs"
                                                                        onClick={() => addProgram(facultyIndex, groupIndex)}
                                                                    >
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Добавить программу
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {group.programs.map((prog, progIndex) => (
                                                                        <div key={progIndex} className="p-3 bg-background rounded border space-y-3">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs font-medium">Программа #{progIndex + 1}</span>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-6 w-6 text-destructive"
                                                                                    onClick={() => removeProgram(facultyIndex, groupIndex, progIndex)}
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                            <div>
                                                                                <Label className="text-xs">Код программы</Label>
                                                                                <Input
                                                                                    className="h-8 text-sm"
                                                                                    value={prog.code}
                                                                                    onChange={(e) => updateProgram(facultyIndex, groupIndex, progIndex, { code: e.target.value })}
                                                                                />
                                                                            </div>
                                                                            <Tabs defaultValue="ru">
                                                                                <TabsList className="h-7">
                                                                                    {languages.map((lang) => (
                                                                                        <TabsTrigger key={lang} value={lang} className="text-xs px-2 py-0.5">
                                                                                            {languageLabels[lang]}
                                                                                        </TabsTrigger>
                                                                                    ))}
                                                                                </TabsList>
                                                                                {languages.map((lang) => (
                                                                                    <TabsContent key={lang} value={lang} className="space-y-2 mt-2">
                                                                                        <div>
                                                                                            <Label className="text-xs">Название</Label>
                                                                                            <Input
                                                                                                className="h-8 text-sm"
                                                                                                value={prog.translations[lang]?.name || ''}
                                                                                                onChange={(e) => updateProgramTranslation(facultyIndex, groupIndex, progIndex, lang, 'name', e.target.value)}
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="text-xs">Описание</Label>
                                                                                            <Textarea
                                                                                                className="text-sm"
                                                                                                value={prog.translations[lang]?.description || ''}
                                                                                                onChange={(e) => updateProgramTranslation(facultyIndex, groupIndex, progIndex, lang, 'description', e.target.value)}
                                                                                                rows={2}
                                                                                            />
                                                                                        </div>
                                                                                    </TabsContent>
                                                                                ))}
                                                                            </Tabs>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
