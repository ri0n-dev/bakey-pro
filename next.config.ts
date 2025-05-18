import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['localhost', 'bakey.pro', 'nbyvfubvidiudjzyrrqd.supabase.co'],
    unoptimized: true,
  },
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/profiles',
        permanent: true
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/6BPfVm6cST',
        permanent: true
      },
    ];
  },
  swcMinify: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
