/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Remove the runtime key that's causing issues
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Add this for Netlify deployment
  output: 'standalone',
}

export default nextConfig

