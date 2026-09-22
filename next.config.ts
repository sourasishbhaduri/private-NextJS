import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during builds (CI runs lint separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking during builds (CI runs tsc separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Required for Midnight SDK packages that use Node.js built-ins in browser context
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'isomorphic-ws': require('path').resolve(__dirname, 'mock-ws.mjs'),
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        buffer: false,
      };
    }
    return config;
  },
};

export default nextConfig;
