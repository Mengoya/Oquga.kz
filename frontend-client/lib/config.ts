import {
    GraduationCap,
    BookOpen,
    UserPlus,
    Cuboid,
    Globe,
    Scale,
} from 'lucide-react';

export const SITE_CONFIG = {
    name: 'Oquga.kz',
    description: 'Oquga — Единая платформа для выбора университета',
};

export const NAV_LINKS = [
    {
        label: 'Университеты',
        href: '/universities',
        icon: GraduationCap,
        description: 'Информация о миссии и истории',
    },
    {
        label: 'Программы',
        href: '/programs',
        icon: BookOpen,
        description: 'Бакалавриат, магистратура и курсы',
    },
    {
        label: 'Поступление',
        href: '/admissions',
        icon: UserPlus,
        description: 'Гранты, сроки и требования',
    },
    {
        label: '3D-тур',
        href: '/tours',
        icon: Cuboid,
        description: 'Виртуальное путешествие по кампусу',
    },
    {
        label: 'Сотрудничество',
        href: '/international',
        icon: Globe,
        description: 'Программы обмена и партнеры',
    },
    {
        label: 'Сравнение',
        href: '/compare',
        icon: Scale,
        description: 'Сравнить вузы и программы',
    },
];
