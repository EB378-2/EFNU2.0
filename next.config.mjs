

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
  ],
};

export default nextIntl(baseConfig);