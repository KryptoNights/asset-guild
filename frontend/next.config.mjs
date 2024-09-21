/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.lighthouse.storage',
        port: '',  // Leave empty unless you need to specify a port
        pathname: '/ipfs/**',  // Pattern for IPFS paths
      },
    ],
  },
};

export default nextConfig;
