import type { NextConfig } from 'next';

const contentSecurityPolicy = [
  "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "form-action 'self'",
  "img-src 'self'", "font-src 'self'",
  ...(process.env.NODE_ENV === 'production' ? [
    // Prerendered Next.js HTML uses inline hydration scripts.
    "default-src 'self'", "script-src 'self' 'unsafe-inline'", "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'", "connect-src 'self'",
  ] : []),
].join('; ');

const config: NextConfig = {
  agentRules: false,
  devIndicators: false,
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: true,
  async redirects() {
    return [{ source: '/', destination: '/id/', permanent: false }];
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
      ],
    }];
  },
};

export default config;
