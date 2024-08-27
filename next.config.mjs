/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: "/study-gamification",
  assetPrefix: "/study-gamification",
};

export default nextConfig;
