/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    turbopack: true,
    // explicit root for Turbopack to avoid inferring a parent directory
    // use process.cwd() instead of __dirname because this file is ESM
    turbopack: {
      root: process.cwd(),
    },
  },
};

export default config;
