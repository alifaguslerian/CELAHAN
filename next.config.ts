import type { NextConfig } from 'next';

const config: NextConfig = {
  agentRules: false,
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
        { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'" },
      ],
    }];
  },
};

export default config;
