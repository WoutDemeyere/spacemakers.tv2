/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // output: 'export',
  reactStrictMode: true,
  images: {
    domains: [ "storage.googleapis.com", "127.0.0.1" ],
  },
}

module.exports = nextConfig
