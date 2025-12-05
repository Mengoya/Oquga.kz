import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken');

    if (!refreshToken) {
        return NextResponse.json(
            { message: 'No refresh token' },
            { status: 401 },
        );
    }

    const newAccessToken = 'new_fake_access_token_' + Date.now();

    return NextResponse.json({ accessToken: newAccessToken });
}
