import { randomBytes } from "node:crypto";
import type { NextConfig } from "next";

process.env.BUILD_SESSION_SECRET ||= randomBytes(32).toString("hex");

const nextConfig: NextConfig = {
  env: {
    BUILD_SESSION_SECRET: process.env.BUILD_SESSION_SECRET,
  },
  images: {
    // unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.builder.io",
      },
    ],
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
