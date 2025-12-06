import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.akorda.kz',
                port: '',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
    },
};

export default nextConfig;
