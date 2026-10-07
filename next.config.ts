import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/courses/dermatology",
        destination: "/courses/category/dermatology",
        permanent: false,
      },
      {
        source: "/dermatology",
        destination: "/courses/category/dermatology",
        permanent: false,
      },
      {
        source: "/dermatology-fellowship",
        destination: "/landing/dermatology-fellowship",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
