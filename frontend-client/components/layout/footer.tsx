import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/config';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations();
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
                                    alt={`${SITE_CONFIG.name} Logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span>{SITE_CONFIG.name}</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            {t('Metadata.description')}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">
                            {t('Footer.platform')}
                        </h3>
                        <ul className="space-y-3">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {t(`Navigation.${item.key}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">
                            {t('Footer.contacts')}
                        </h3>
                        <ul className="space-y-4 text-sm text-muted-foreground mb-6">
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href="mailto:info@oquga.kz"
                                    className="hover:text-foreground transition-colors"
                                    aria-label="Email"
                                >
                                    info@oquga.kz
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {SITE_CONFIG.name}.{' '}
                        {t('Footer.rights')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
