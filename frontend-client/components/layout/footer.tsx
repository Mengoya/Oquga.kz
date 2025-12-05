import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/config';
import { Mail } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity w-fit"
                        >
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/logo.png"
                                    alt={`${SITE_CONFIG.name} Лого`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span>{SITE_CONFIG.name}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            {SITE_CONFIG.description}. Мы помогаем абитуриентам
                            найти свой идеальный путь в образовании через
                            инновационные технологии и прозрачные данные.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">
                            Платформа
                        </h3>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">
                            Контакты
                        </h3>
                        <ul className="space-y-4 text-sm text-muted-foreground mb-6">
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href="mailto:info@oquga.kz"
                                    className="hover:text-foreground transition-colors"
                                    aria-label="Написать нам письмо"
                                >
                                    info@oquga.kz
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {SITE_CONFIG.name}. Все права
                        защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}
