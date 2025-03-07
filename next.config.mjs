/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Generates static site in the `out` folder
    basePath: '/fumi-nozawa-bot-gen', // Matches GitHub Pages subpath
    images: {
      unoptimized: true, // Required for static export on GitHub Pages
    },
  };
  
  export default nextConfig;