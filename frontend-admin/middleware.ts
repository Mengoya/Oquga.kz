import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const publicPathnames = ['/login'];

export default function middleware(request: NextRequest) {
    const response = handleI18nRouting(request);

    const { pathname } = request.nextUrl;

    if (response.status === 307 || response.status === 308) {
        return response;
    }

    const locale = pathname.split('/')[1];

    if (!routing.locales.includes(locale as any)) {
        return response;
    }

    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    const isPublicPage = publicPathnames.includes(pathnameWithoutLocale);

    const authCookie = request.cookies.get('auth-storage');
    let isAuthenticated = false;

    if (authCookie) {
        try {
            const authData = JSON.parse(authCookie.value);
            isAuthenticated = authData?.state?.isAuthenticated === true;
        } catch (e) {
            isAuthenticated = false;
        }
    }

    if (!isAuthenticated && !isPublicPage) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isPublicPage) {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};