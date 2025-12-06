import { UserPlus } from 'lucide-react';

export const SITE_CONFIG = {
    name: 'Oquga.kz',
    description: 'Платформа для поиска образовательных программ в Казахстане',
    url: 'https://oquga.kz',
};

export const NAV_LINKS = [
    {
        label: 'Главная',
        href: '/',
        description: 'Вернуться на главную страницу',
    },
    {
        label: 'Вузы',
        href: '/universities',
        description: 'Каталог университетов Казахстана',
    },
    {
        label: 'Поступление',
        href: '/admissions',
        icon: UserPlus,
        description: 'Гранты, сроки и требования',
    },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
