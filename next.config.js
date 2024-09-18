/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    // output: 'export',
    reactStrictMode: true,
    images: {
        domains: ["storage.googleapis.com"],
    }
}

module.exports = nextConfig
