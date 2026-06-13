/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    KIMI_API_URL: process.env.KIMI_API_URL,
  },
};

export default nextConfig;
