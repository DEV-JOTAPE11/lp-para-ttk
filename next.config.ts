import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF primeiro: o fundo e o robô caem para uma fração do PNG original.
    formats: ["image/avif", "image/webp"],
    qualities: [80, 90],
  },
};

export default nextConfig;
