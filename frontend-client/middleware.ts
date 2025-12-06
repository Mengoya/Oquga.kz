import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const response = intlMiddleware(request);

    const locale = pathname.split('/')[1];
    const validLocales = ['ru', 'kk', 'en'];
    const currentLocale = validLocales.includes(locale) ? locale : 'ru';

    const pathWithoutLocale = validLocales.includes(locale)
        ? pathname.replace(`/${locale}`, '') || '/'
        : pathname;

    const protectedRoutes = ['/profile', '/settings', '/dashboard'];

    const authRoutes = ['/login', '/register'];

    const authCookie = request.cookies.get('client-auth-storage');
    let isAuthenticated = false;

    if (authCookie) {
        try {
            const parsed = JSON.parse(authCookie.value);
            isAuthenticated =
                parsed.state.isAuthenticated && !!parsed.state.accessToken;
        } catch {
            isAuthenticated = false;
        }
    }

    if (authRoutes.includes(pathWithoutLocale) && isAuthenticated) {
        const homeUrl = new URL(`/${currentLocale}`, request.url);
        return NextResponse.redirect(homeUrl);
    }

    if (
        protectedRoutes.some((route) => pathWithoutLocale.startsWith(route)) &&
        !isAuthenticated
    ) {
        const loginUrl = new URL(`/${currentLocale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathWithoutLocale);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|dummy-poster.png|.*\\..*).*)',
    ],
};
