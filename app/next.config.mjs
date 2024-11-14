/** @type {import('next').NextConfig} */

// Environment variables come from .env.local at the root directory
const nextConfig = {
  env: {
    DEEPLYNX_BASE: process.env.DEEPLYNX_BASE,
    DEEPLYNX_KEY: process.env.DEEPLYNX_KEY,
    DEEPLYNX_SECRET: process.env.DEEPLYNX_SECRET,
    DEEPLYNX_CONTAINER: process.env.DEEPLYNX_CONTAINER,
    POSTGRES_URL: undefined,
  },
};

export default nextConfig;
