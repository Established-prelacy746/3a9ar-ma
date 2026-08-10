/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bullmq", "ioredis", "stripe", "meilisearch", "cloudinary"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "content.avito.ma" },
      { protocol: "https", hostname: "www.mubawab-media.com" },
    ],
  },
};

export default nextConfig;
