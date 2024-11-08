/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  distDir: 'build',
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [ "storage.googleapis.com", "127.0.0.1", "admin.spacemakers.tv" ],
  },
}

module.exports = nextConfig
