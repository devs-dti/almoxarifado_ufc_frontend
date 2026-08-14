/** @type {import('next').NextConfig} */
const config = {
  async rewrites() {
    const apiUrl = process.env.API_URL

    if (!apiUrl) {
      return []
    }

    return [
      {
        source: '/api/backend/:path*',
        destination: `${apiUrl.replace(/\/$/, '')}/:path*`,
      },
    ]
  },
};

export default config;
