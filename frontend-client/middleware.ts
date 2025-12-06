import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('client-auth-storage');
    const { pathname } = request.nextUrl;

    const authRoutes = ['/login', '/register'];

    const protectedRoutes = ['/profile', '/settings', '/dashboard'];

    let isAuthenticated = false;

    if (authCookie) {
        try {
            const parsed = JSON.parse(authCookie.value);
            isAuthenticated =
                parsed.state.isAuthenticated && !!parsed.state.accessToken;
        } catch (e) {
            isAuthenticated = false;
        }
    }

    if (authRoutes.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (
        protectedRoutes.some((route) => pathname.startsWith(route)) &&
        !isAuthenticated
    ) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|dummy-poster.png).*)',
    ],
};
