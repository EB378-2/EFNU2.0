

// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';


const nextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const baseConfig = {
  experimental: {
    useCache: true,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/sw.js',
      headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    },
  ],
};

export default nextIntl(baseConfig);