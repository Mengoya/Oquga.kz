import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const publicPages = ['/login'];

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const response = handleI18nRouting(request);
    const [, locale, ...segments] = pathname.split('/');
    const pathWithoutLocale = `/${segments.join('/')}`;

    if (response.headers.has('location')) {
        return response;
    }

    const authCookie = request.cookies.get('auth-storage');
    let isAuthenticated = false;

    if (authCookie) {
        try {
            const authData = JSON.parse(authCookie.value);
            isAuthenticated = authData?.state?.isAuthenticated === true;
        } catch (error) {
            console.error('Error parsing auth cookie:', error);
            isAuthenticated = false;
        }
    }

    const isPublicPage = publicPages.some(
        (route) =>
            pathWithoutLocale === route ||
            pathWithoutLocale.startsWith(`${route}/`),
    );

    const currentLocale = routing.locales.includes(locale as any)
        ? locale
        : routing.defaultLocale;

    if (!isAuthenticated && !isPublicPage) {
        const loginUrl = new URL(`/${currentLocale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isPublicPage) {
        return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)', '/'],
};
