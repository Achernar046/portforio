import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /* ── Image optimisation ── */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 h
  },

  /* ── HTTP compression ── */
  compress: true,

  /* ── Bundle optimisation ── */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
