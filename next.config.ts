import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.reimaginehome.ai' },
      { protocol: 'https', hostname: '*.reimaginehome.ai' },
    ],
  },
}

export default nextConfig
