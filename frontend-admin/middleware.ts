import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const hasRefreshToken = request.cookies.has('refreshToken');

    const isAuthRoute =
        !pathname.includes('/login') &&
        !pathname.includes('/api') &&
        !pathname.match(/\.(.*)$/);

    if (isAuthRoute && !hasRefreshToken) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'ru';
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    if (pathname.includes('/login') && hasRefreshToken) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'ru';
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/(ru|kk|en)/:path*'],
};
