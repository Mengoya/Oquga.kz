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

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const INTERNAL_API_URL =
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

if (
    process.env.NODE_ENV === 'development' &&
    !process.env.NEXT_PUBLIC_API_URL
) {
    console.warn(
        '⚠️ [Config] NEXT_PUBLIC_API_URL не установлен. Используется fallback: http://localhost:8080',
    );
}
