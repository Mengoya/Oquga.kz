import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    output: 'standalone',

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '9000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's3.*.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME || 's3.example.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'avatar.vercel.sh',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: process.env.NODE_ENV === 'development' ? 60 : 3600,
    },
};

export default withNextIntl(nextConfig);
