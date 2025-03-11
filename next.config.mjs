// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Fine for Vercel if you don’t need image optimization
  },
};

export default nextConfig;