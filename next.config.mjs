/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    turbopack: true,
    // explicit root for Turbopack to avoid inferring a parent directory
    turbopack: {
      root: __dirname,
    },
  },
};

export default config;
