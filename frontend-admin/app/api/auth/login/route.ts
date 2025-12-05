import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();

    if (body.email === 'admin@datanub.kz' && body.password === '123123') {
        const accessToken = 'fake_access_token_' + Date.now();
        const refreshToken = 'fake_refresh_token_' + Date.now();
        const user = {
            id: '1',
            email: body.email,
            name: 'Admin User',
            role: 'admin',
        };

        const cookieStore = await cookies();

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        });

        return NextResponse.json({ accessToken, user });
    }

    return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
    );
}
