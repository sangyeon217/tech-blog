import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.ctfassets.net" }],
  },
  async redirects() {
    return [
      {
        source: "/rss.xml",
        destination: "/rss",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
