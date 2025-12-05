import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];
const locales = ['ru', 'kk', 'en'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    let pathWithoutLocale = pathname;
    let currentLocale = 'ru';

    if (pathnameHasLocale) {
        const locale = locales.find(
            (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
        );
        if (locale) {
            currentLocale = locale;
            pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
        }
    }

    const isPublicRoute = publicRoutes.some(
        (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    );

    const authCookie = request.cookies.get('auth-storage');

    let isAuthenticated = false;
    if (authCookie) {
        try {
            const authData = JSON.parse(authCookie.value);
            isAuthenticated = authData?.state?.isAuthenticated === true;
        } catch {
            isAuthenticated = false;
        }
    }

    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL(`/${currentLocale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isPublicRoute) {
        return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
