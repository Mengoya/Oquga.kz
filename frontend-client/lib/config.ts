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
};

export const NAV_ITEMS = [
    { key: 'universities', href: '/universities', icon: GraduationCap },
    { key: 'programs', href: '/programs', icon: BookOpen },
    { key: 'admissions', href: '/admissions', icon: UserPlus },
    { key: 'tours', href: '/tours', icon: Cuboid },
    { key: 'international', href: '/international', icon: Globe },
    { key: 'compare', href: '/compare', icon: Scale },
];
