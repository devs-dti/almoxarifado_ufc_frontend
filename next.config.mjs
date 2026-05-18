/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    // explicit root for Turbopack to avoid inferring a parent directory
    // use process.cwd() instead of __dirname because this file is ESM
    turbopack: {
      root: process.cwd(),
    },
  },
  
  // CHANGED: Added rewrites to proxy API requests to the senior's backend.
  // This bypasses browser CORS and cross-domain cookie blocks!
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.BACKEND_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default config;