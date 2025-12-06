import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.oquga.kz',
            },
            {
                protocol: 'https',
                hostname: '**.oquga.kz',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
        unoptimized: true,
    },
};

export default withNextIntl(nextConfig);
