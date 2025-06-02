/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase timeouts for API routes
  experimental: {
    serverComponentsExternalPackages: ['puppeteer'],
    workerThreads: false,
    optimizeCss: true,
  },
  // API routes timeout configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiTimeout: 120000, // 2 minutes for AI API calls
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/maps/api/place/photo/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  swcMinify: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  }
}

module.exports = nextConfig
